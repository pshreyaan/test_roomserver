import { ClientData } from "./clientData.type.ts";

export type LobbyStatusPayload = {
  /** The ID of the room */
  sessionId: string;
  /** The identity of the current player */
  identity?: string;
  /** List of other players */
  peers?: Array<ClientData>;
};
