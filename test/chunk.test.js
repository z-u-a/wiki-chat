import { describe, it, expect } from 'vitest';
import { chunkText } from '../src/services/chunk.js';

describe('chunkText', () => {
  it('splits text into overlapping chunks', () => {
    const text = Array.from({ length: 300 }, (_, i) => `word${i + 1}`).join(' ');
    const chunks = chunkText(text);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0].text).toContain('word1');
    expect(chunks[1].text).toContain('word201');
  });

  it('returns empty array for blank text', () => {
    expect(chunkText('')).toEqual([]);
  });
});
