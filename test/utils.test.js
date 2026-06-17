import { describe, it, expect } from 'vitest';
import { createArticleId } from '../src/services/utils.js';

describe('createArticleId', () => {
  it('produces deterministic ID from URL', () => {
    const id1 = createArticleId('https://en.wikipedia.org/wiki/Test');
    const id2 = createArticleId('https://en.wikipedia.org/wiki/Test');
    expect(id1).toBe(id2);
    expect(id1).toHaveLength(16);
  });
});
