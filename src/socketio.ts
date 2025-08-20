// socketio.ts
import { Server as HttpServer } from "node:http";
import { Server, ServerOptions } from "socket.io";
import process from "node:process";

export function initSocketIO(server: HttpServer) {
  // If CORS_ALLOW is set (comma-separated), use it. Otherwise allow all ("*")
  const allowList = process.env.CORS_ALLOW
    ? process.env.CORS_ALLOW.split(",").map((s) => s.trim()).filter(Boolean)
    : "*";

  console.log(`[setup] Socket.IO CORS origin =`, allowList);

  const serverOptions: Partial<ServerOptions> = {
    cors: {
      origin: allowList,                // "*" or ["https://foo", "https://bar"]
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["*"],
      credentials: false,
    },
  };

  return new Server(server, serverOptions);
}
