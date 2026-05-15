export const normalizeText = (text = "") => {
  return text
    .replace(/\s+/g, " ")   // collapse whitespace
    .replace(/\n+/g, " ")   // remove newlines
    .trim();
};
