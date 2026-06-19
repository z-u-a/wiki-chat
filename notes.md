# Notes

## Known Limitations
- Import API response time is 60-120 seconds due to local LLM inference 
  without GPU acceleration. In production this would use a GPU-enabled 
  deployment to reduce latency.
- Model quality is limited by llama3.2:1b — a larger model would give 
  better summaries and more accurate answers.

## What the AI Got Wrong
- **Qdrant collection endpoint** — AI used `POST /collections` instead of 
  `PUT /collections/{name}`. Caught from 404 logs, corrected manually.
- **Ollama /api/chat format** — AI used `prompt` field instead of 
  `messages` array. Also used OpenAI response format `choices[0].message.content` 
  instead of Ollama's `message.content`.
- **Missing stream:false** — AI didn't add this, causing iterable stream 
  errors on every LLM call.
- **Missing with_payload:true** — Qdrant search was returning hits without 
  content. AI didn't include this flag, context was always empty.
- **Point IDs as strings** — AI generated IDs like "articleId-0". 
  Qdrant requires numbers or UUIDs.
- **Vector dimensions** — AI defaulted to 1536 (OpenAI dimensions). 
  nomic-embed-text outputs 768. Fixed in collection creation.

## What I'd Change With More Time
- Streaming chat responses for better UX
- GPU support for Ollama
- Semantic chunking instead of naive word splitting
- Retry logic for Ollama timeouts on large articles
- Frontend loading progress indicator during import