//-------------------------------------------------------
export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

// Format milliseconds to 'X minutes Y seconds'
//-------------------------------------------------------
export const formatTimeFromMsToPretty = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  let result = "";
  if (minutes > 0) {
    result += `${minutes} minute${minutes !== 1 ? "s" : ""} `;
  }
  result += `${seconds} second${seconds !== 1 ? "s" : ""}`;
  return result;
};
