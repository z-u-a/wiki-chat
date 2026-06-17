import { describe, it, expect } from 'vitest';
import { scrapeWikipediaArticle } from '../src/services/scrape.js';

const wikipediaHtml = `<!DOCTYPE html><html><body><h1 id="firstHeading">Test</h1><div id="mw-content-text"><p>First paragraph.</p><p>Second paragraph.</p><h2><span class="mw-headline">Section</span></h2><div class="references"><ol><li>Ref 1</li></ol></div></div></body></html>`;

globalThis.fetch = async () => ({ ok: true, text: async () => wikipediaHtml });

describe('scrapeWikipediaArticle', () => {
  it('extracts article text and metadata', async () => {
    const article = await scrapeWikipediaArticle('https://en.wikipedia.org/wiki/Test');
    expect(article.title).toBe('Test');
    expect(article.text).toContain('First paragraph.');
    expect(article.sections).toContain('Section');
    expect(article.references).toContain('Ref 1');
  });

  it('throws for unsupported host', async () => {
    await expect(scrapeWikipediaArticle('https://example.com/article')).rejects.toThrow('Only en.wikipedia.org URLs are supported');
  });
});
