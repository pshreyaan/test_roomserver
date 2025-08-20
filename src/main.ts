// src/main.ts
import { Session } from "./session.ts";
import { Player } from "./player.ts";
import { startGame } from "./spy.ts";
import { Socket } from "socket.io";
import { ClientEvent } from "./types/clientEvent.ts";
import { ServerEvent } from "./types/serverEvent.ts";
import { JoinSessionData } from "./types/joinSession.type.ts";
import { ChatPayload } from "./types/chatPayload.type.ts";
import { LobbyStatusPayload } from "./types/lobbyStatusPayload.type.ts";
import { createServer } from "node:http";
import process from "node:process";
import { initSocketIO } from "./socketio.ts";
import { createId } from "./utils.ts";
import { logEvent } from "./log.ts";
import { allAvatars } from "./constants.ts";

// --- CORS helpers for HTTP ---
function setCors(res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
}

// --- Sessions store ---
const sessions: Map<string, Session> = new Map();

// --- HTTP server with /health + CORS ---
const server = createServer((req, res) => {
  // Preflight
  if (req.method === "OPTIONS") {
    setCors(res);
    res.statusCode = 204;
    res.end();
    return;
  }

  // Health check
  if (req.url === "/health" && req.method === "GET") {
    setCors(res);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        status: "ok",
        uptime: process.uptime(),
        rooms: sessions.size,
        maxPlayers: allAvatars.length, // <- exposed cap
        timestamp: Date.now(),
      }),
    );
    return;
  }

  // Fallback
  setCors(res);
  res.statusCode = 404;
  res.end("Not Found");
});

// --- Socket.IO ---
const io = initSocketIO(server);

function createClient(socket: Socket): Player {
  return new Player(socket);
}

function createSession(id = createId(4)): Session {
  while (sessions.has(id)) {
    console.error(`[error] Session ${id} already exists`);
    id = createId();
  }
  const session = new Session(id, io);
  sessions.set(id, session);
  return session;
}

function getSession(id: string): Session | undefined {
  return sessions.get(id);
}

io.on("connection", (socket: Socket) => {
  const client = createClient(socket);
  let session: Session | undefined;

  socket.on(ClientEvent.JoinSession, (data: JoinSessionData) => {
    if (session) {
      leaveSession(session, client);
    }

    session = data.sessionId
      ? getSession(data.sessionId) || createSession(data.sessionId)
      : createSession();

    // TODO event SessionCreated is sent twice?
    client.sendSessionInfo(ServerEvent.SessionCreated, {
      sessionId: session.id,
    } as LobbyStatusPayload);

    if (session) {
      client.data.name = data.playerName;
      logEvent({
        room: session.id,
        player: client.data.name,
        type: ClientEvent.JoinSession,
        totalRooms: sessions.size,
      });

      if (session.join(client)) {
        session.broadcastPeers();
      } else {
        socket.disconnect();
      }
    }
  });

  socket.on(ClientEvent.ChatEvent, (data: ChatPayload) => {
    if (!session) {
      socket.disconnect();
      return;
    }
    logEvent({
      room: session.id,
      player: client.data.name,
      type: ServerEvent.ChatEvent,
      msg: data.message,
    });
    session.broadcastChat({
      author: client.data,
      message: data.message,
    });
  });

  socket.on(ClientEvent.ClientReady, (data: { ready: boolean }) => {
    if (!session) {
      socket.disconnect();
      return;
    }
    client.data.ready = data.ready;
    session.broadcastPeers();
  });

  socket.on(ClientEvent.StartGame, () => {
    if (!session) {
      socket.disconnect();
      return;
    }
    const allReady = Array.from(session.players).reduce(
      (acc: boolean, player: Player): boolean => acc && player.data.ready,
      true,
    );
    if (allReady) {
      const customLocations = new Set<string>(); // TODO: custom locations
      startGame(session, customLocations);
    } else {
      client.sendChat({
        message: "All players must be ready",
        color: "red",
      });
    }
  });

  socket.on(ClientEvent.Disconnect, () => {
    if (session) leaveSession(session, client);
  });
});

function leaveSession(session: Session, client: Player) {
  if (!session) return;
  session.removeClient(client);
  if (session.players.size === 0) {
    sessions.delete(session.id);
    logEvent({
      room: session.id,
      type: ServerEvent.SessionDeleted,
      totalRooms: sessions.size,
    });
  }
}

// --- Start ---
const defaultPort = 8081;
const actualPort = process.env.PORT || defaultPort;
server.listen(actualPort, () => {
  console.log(
    `[setup] Listening for requests on http://localhost:${actualPort}`,
  );
});
