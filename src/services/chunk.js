const WORDS_PER_CHUNK = 250;
const OVERLAP = 50;

export function chunkText(text) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const chunks = [];
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + WORDS_PER_CHUNK, words.length);
    const chunkText = words.slice(start, end).join(' ');
    chunks.push({ text: chunkText, start, end });
    if (end === words.length) break;
    start = end - OVERLAP;
  }

  return chunks;
}
