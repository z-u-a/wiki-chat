export default class QdrantClient {
  constructor(baseUrl, collection) {
    this.baseUrl = baseUrl || 'http://localhost:6333';
    this.collection = collection || 'wiki-articles';
  }

  async ensureCollection() {
    const url = `${this.baseUrl}/collections/${this.collection}`;
    const response = await fetch(url);
    if (response.ok) return;
    await fetch(`${this.baseUrl}/collections/${this.collection}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vectors: { size: 768, distance: 'Cosine' }
      })
    });
  }

  async upsertArticleChunks(articleId, chunks, embeddings) {
    const points = chunks.map((chunk, index) => ({
      id: index + 1,
      vector: embeddings[index],
      payload: {
        articleId,
        content: chunk.text,
        start: chunk.start,
        end: chunk.end
      }
    }));

    await fetch(`${this.baseUrl}/collections/${this.collection}/points?wait=true`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points })
    });
  }

  async searchArticleChunks(articleId, embedding, limit = 4) {
    const response = await fetch(`${this.baseUrl}/collections/${this.collection}/points/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vector: embedding,
        limit,
        filter: { must: [{ key: 'articleId', match: { value: articleId } }] }
      })
    });
    const data = await response.json();
    return data.result || [];
  }
}
