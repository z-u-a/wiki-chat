import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import * as scrapeSvc from '../src/services/scrape.js';

const mockOllama = {
  summarize: vi.fn(),
  embedTexts: vi.fn(),
  answerQuestion: vi.fn()
};

const mockVector = {
  ensureCollection: vi.fn(),
  upsertArticleChunks: vi.fn(),
  searchArticleChunks: vi.fn()
};

vi.mock('../src/services/ollamaClient.js', () => ({
  default: class {
    summarize = mockOllama.summarize;
    embedTexts = mockOllama.embedTexts;
    answerQuestion = mockOllama.answerQuestion;
  }
}));

vi.mock('../src/services/vectorClient.js', () => ({
  default: class {
    ensureCollection = mockVector.ensureCollection;
    upsertArticleChunks = mockVector.upsertArticleChunks;
    searchArticleChunks = mockVector.searchArticleChunks;
  }
}));

const app = await import('../src/server.js').then((mod) => mod.default);

beforeEach(() => {
  vi.resetAllMocks();
});

describe('API routes', () => {
  it('imports article successfully', async () => {
    vi.spyOn(scrapeSvc, 'scrapeWikipediaArticle').mockResolvedValue({ title: 'Test', text: 'Hello world' });
    mockOllama.summarize.mockResolvedValue('Summary');
    mockOllama.embedTexts.mockResolvedValue([[0.1, 0.2]]);

    const response = await request(app)
      .post('/api/import')
      .send({ url: 'https://en.wikipedia.org/wiki/Test' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Test');
    expect(response.body.summary).toBe('Summary');
    expect(mockVector.upsertArticleChunks).toHaveBeenCalled();
  });

  it('answers chat successfully', async () => {
    mockOllama.embedTexts.mockResolvedValue([[0.5, 0.6]]);
    mockVector.searchArticleChunks.mockResolvedValue([{ payload: { content: 'Relevant chunk' } }]);
    mockOllama.answerQuestion.mockResolvedValue('Answer text');

    const response = await request(app)
      .post('/api/chat')
      .send({ articleId: 'abc123', question: 'What is this?' });

    expect(response.status).toBe(200);
    expect(response.body.answer).toBe('Answer text');
  });

  it('handles search hits without payload.content', async () => {
    mockOllama.embedTexts.mockResolvedValue([[0.5, 0.6]]);
    // simulate minimal hit shape returned by some vector stores
    mockVector.searchArticleChunks.mockResolvedValue([{ id: 1, version: 2, score: 0.76 }]);
    mockOllama.answerQuestion.mockResolvedValue('Answer for minimal hits');

    const response = await request(app)
      .post('/api/chat')
      .send({ articleId: 'abc123', question: 'What is this?' });

    expect(response.status).toBe(200);
    expect(response.body.answer).toBe('Answer for minimal hits');
  });
});
