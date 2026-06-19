import express from 'express';
import { scrapeWikipediaArticle } from '../services/scrape.js';
import { chunkText } from '../services/chunk.js';
import OllamaClient from '../services/ollamaClient.js';
import QdrantClient from '../services/vectorClient.js';
import { createArticleId } from '../services/utils.js';

const router = express.Router();
const ollama = new OllamaClient();
const vectorClient = new QdrantClient(process.env.VECTOR_DB_URL, process.env.VECTOR_DB_COLLECTION);

router.post('/import', async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Missing url' });
    }

    const article = await scrapeWikipediaArticle(url);
    const articleId = createArticleId(url);
    const chunks = chunkText(article.text);
    
    const [summary, embeddings] = await Promise.all([
      ollama.summarize(article.text),
      ollama.embedTexts(chunks.map(({ text }) => text))
    ]);

    await vectorClient.ensureCollection();
    await vectorClient.upsertArticleChunks(articleId, chunks, embeddings);

    res.json({ articleId, summary, title: article.title });
  } catch (error) {
    next(error);
  }
});

router.post('/chat', async (req, res, next) => {
  try {
    const { articleId, question } = req.body;
    if (!articleId || !question) {
      return res.status(400).json({ error: 'Missing articleId or question' });
    }

    const queryEmbedding = await ollama.embedTexts([question]);
    const hits = await vectorClient.searchArticleChunks(articleId, queryEmbedding[0], 4);

    const contextParts = hits.map((hit, index) => {
      let content;
      if (hit.payload) {
        if (typeof hit.payload === 'string') {
          content = hit.payload;
        } else {
          content = hit.payload.content ?? hit.payload.text ?? (hit.payload.data && hit.payload.data.content) ?? JSON.stringify(hit.payload);
        }
      } else {
        content = hit.id ? `chunk id:${hit.id}` : JSON.stringify(hit);
      }
      return `${index + 1}. ${content}`;
    });

    const context = contextParts.join('\n\n');

    const answer = await ollama.answerQuestion(question, context);
    console.log('Answer from Ollama:', answer);
    res.json({ answer, context });
  } catch (error) {
    next(error);
  }
});

export default router;
