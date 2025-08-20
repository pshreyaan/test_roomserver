/**
 * @param {number} len The length of the ID
 * @param {string} possibleChars the characters to use
 * @returns {string} The generated ID
 */
export function createId(
  len: number = 4,
  possibleChars: string = "ABCDEFGHJKMNPQRTWXYZ34579",
): string {
  let id = "";
  for (let i = 0; i < len; i++) {
    id += possibleChars[getRandomIndexInArray(possibleChars.length)];
  }
  return id;
}

export function getRandomIndexInArray(arraySize: number) {
  return Math.floor(Math.random() * arraySize);
}

export function shuffleArray(array: Array<number | string>) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function getTimeInSeconds() {
  return Math.round(Date.now() / 1000);
}
