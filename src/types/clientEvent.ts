export enum ClientEvent {
  /** Default event from socket.io */
  Connect = "connect",
  /** Default event from socket.io */
  Disconnect = "disconnect",

  JoinSession = "join-session",
  ClientReady = "player-ready",
  StartGame = "start-game",
  ChatEvent = "chat-event",
}
