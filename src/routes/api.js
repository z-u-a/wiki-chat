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

    const summary = await ollama.summarize(article.text);
    const chunks = chunkText(article.text);
    const embeddings = await ollama.embedTexts(chunks.map(({ text }) => text));

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
    const context = hits.map((hit, index) => `${index + 1}. ${hit.payload.content}`).join('\n\n');

    const answer = await ollama.answerQuestion(question, context);
    res.json({ answer, context });
  } catch (error) {
    next(error);
  }
});

export default router;
