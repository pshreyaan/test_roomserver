import { Session } from "./session.ts";
import { GamePayload } from "./types/gamePayload.type.ts";
import { logEvent } from "./log.ts";
import { ServerEvent } from "./types/serverEvent.ts";
import { getRandomIndexInArray } from "./utils.ts";

const locations = [
  "✈️💺 Airport",
  // "🎡🎢 Amusement Park",
  "🏦💰 Bank",
  "🎰💵 Casino",
  "🎞🍿 Cinema",
  // "🎪🤡 Circus Show",
  "🦸🦹 Cosplay Convention",
  "🛳🌊 Cruise Ship",
  "🏝🥥 Desert Island",
  "⚽️🏟 Football Stadium",
  "🌳🏕 Forest Camp",
  "🏪🛒 Grocery Store",
  "🏥🧑‍⚕️ Hospital",
  "🏨🛏 Hotel",
  // "⛸️🧊 Ice Rink",
  "🌕🧑‍🚀 Moon Colony",
  "⛰🥾 Mountain Hike",
  "🏛🖼 Museum",
  "🏤📮 Post Office",
  "🍽👩‍🍳 Restaurant",
  "🏟🎸 Rock Concert",
  "🚄🛤 Train Station",
  "🏫🎓 University",
];

export function startGame(session: Session, customLocations: Set<string>) {
  const clientsArray = Array.from(session.players);
  const spyIndex = getRandomIndexInArray(clientsArray.length);
  const firstPlayer =
    clientsArray[getRandomIndexInArray(clientsArray.length)].data.name;

  const gameLocations = [...locations, ...customLocations];
  const currentLocationIndex = getRandomIndexInArray(locations.length);
  const currentLocation = gameLocations[currentLocationIndex];

  // There is a 1/1000 chance that everyone is a spy!
  const isAllSpies = Math.random() < 0.001;
  if (isAllSpies) {
    logEvent({
      room: session.id,
      type: ServerEvent.StartGame,
      msg: "All spies!",
    });
  }

  clientsArray.forEach((client, index) => {
    const isSpy = isAllSpies || (spyIndex === index);
    client.data.ready = false;
    client.sendStartGame({
      spy: isSpy,
      location: isSpy ? "?" : currentLocation,
      locations: gameLocations,
      first: firstPlayer,
    } as GamePayload);
  });
  session.startGame();
}
