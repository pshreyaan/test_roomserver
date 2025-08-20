export type GamePayload = {
  /** The player who goes first */
  first: string;
  /** If the player is the spy */
  spy: boolean;
  /** The current location */
  location: string;
  /** List of all locations */
  locations: Array<string>;
};
