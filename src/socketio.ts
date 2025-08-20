import { Server as HttpServer } from "node:http";
import { Server, ServerOptions } from "socket.io";
import process from "node:process";

export function initSocketIO(server: HttpServer) {
  const corsOrigins = process.env.CORS_ALLOW?.split(",");
  console.log(`[setup] Allowing cors for [${corsOrigins}]`);
  const serverOptions: Partial<ServerOptions> = {
    cors: {
      origin: corsOrigins,
      methods: ["GET", "POST"],
    },
  };

  return new Server(server, serverOptions);
}
