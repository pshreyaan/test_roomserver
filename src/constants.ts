// src/constants.ts
import process from "node:process";

export const roundDurationSeconds = 120;

// Set desired cap via env, e.g. MAX_PLAYERS=24
export const MAX_PLAYERS = Number(process.env.MAX_PLAYERS ?? 32);

const baseAvatars = [
  "🐶",
  "🐱",
  "🦊",
  "🐭",
  "🐼",
  "🐧",
  "🐰",
  "🐯",
  "🦁",
  "🐻",
  "🐸",
  "🦖",
  "🦉",
  "🐠",
  "🦩",
  "🐢",
  "🐬",
  "🦆",
  "🦄",
  "🐨",
  "🐙",
  "🦚",
  "🦜",
  "🦥",
  "🦔",
  "🦇",
  "🦒",
  "🦌",
  "🦓",
  "🦝",
  "🦨",
  "🦘",
];

// Generates a list of unique avatars up to MAX_PLAYERS.
// If MAX_PLAYERS > baseAvatars.length, it cycles emojis and appends a counter.
export const allAvatars: string[] = (() => {
  const needed = Math.max(1, MAX_PLAYERS);
  const out: string[] = [];
  for (let i = 0; i < needed; i++) {
    const emoji = baseAvatars[i % baseAvatars.length];
    const batch = Math.floor(i / baseAvatars.length);
    out.push(batch === 0 ? emoji : `${emoji}${batch + 1}`);
  }
  return out;
})();
