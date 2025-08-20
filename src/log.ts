import { ClientEvent } from "./types/clientEvent.ts";
import { ServerEvent } from "./types/serverEvent.ts";

type logPayload = {
  room: string;
  player?: string;
  /** The type of event */
  type: ServerEvent | ClientEvent;

  /** The chat message sent */
  msg?: string;
  /** The amount of active rooms */
  totalRooms?: number;
  /** The number of players in the room */
  playersCount?: number;
  /** How many games have been played (including the one starting) */
  gamesPlayed?: number;
};

export function logEvent(payload: logPayload) {
  console.log(payload);
}
