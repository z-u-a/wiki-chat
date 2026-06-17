const baseUrl = () => process.env.OLLAMA_URL || 'http://localhost:11434';

export default class OllamaClient {
  async summarize(text) {
    const prompt = `Summarize the following article in 3 concise sentences:\n\n${text}`;
    const response = await this._post(`/api/chat`, {
      model: process.env.LLM_MODEL,
      prompt,
      max_tokens: 200,
      temperature: 0.2
    });

    return response?.choices?.[0]?.message?.content?.trim() || '';
  }

  async embedTexts(texts) {
    const response = await this._post(`/api/embed`, {
      model: process.env.EMBEDDING_MODEL,
      input: texts
    });
    if (!Array.isArray(response?.embeddings)) {
      throw new Error('Invalid embedding response');
    }
    return response.embeddings;
  }

  async answerQuestion(question, context) {
    const prompt = `You are a helpful assistant. Use only the following context to answer the question.\n\nContext:\n${context}\n\nQuestion: ${question}\n\nAnswer concisely and ground your answer in the context.`;
    const response = await this._post(`/api/chat`, {
      model: process.env.LLM_MODEL,
      prompt,
      max_tokens: 250,
      temperature: 0.2
    });
    return response?.choices?.[0]?.message?.content?.trim() || '';
  }

  async _post(path, body) {
    const response = await fetch(`${baseUrl()}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Ollama error: ${response.status} ${text}`);
    }
    return response.json();
  }
}
