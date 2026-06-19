const baseUrl = () => process.env.OLLAMA_URL || 'http://localhost:11434';

export default class OllamaClient {
  async summarize(text) {
    const response = await this._post(`/api/chat`, {
      model: process.env.LLM_MODEL,
      messages: [{ 
        role: 'user', 
        content: `Summarize the following article in 3 concise sentences:\n\n${text.slice(0, 4000)}`
      }],
      stream: false,        // ← was missing
      options: { temperature: 0.2, num_predict: 200 }
    });

    return response?.message?.content?.trim() || '';  // ← was choices[0]
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
      messages: [{ role: 'user', content: prompt }],  // ← messages not prompt
      stream: false,                                    // ← must have this
      options: {
        temperature: 0.2,
        num_predict: 250                               // ← not max_tokens
      }
    });

    return response?.message?.content?.trim() || '';  // ← not choices[0]
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
