# Requirements

## Functional requirements
- Accept a Wikipedia article URL from the user.
- Scrape the article text, sections and references from the URL.
- Use a locally-deployed LLM to generate a concise article summary.
- Chunk article text and create embeddings.
- Store embeddings in a containerised vector database.
- Provide a chat interface where answers are grounded in retrieved chunks.
- Run as a single stack with Docker Compose.

## Non-functional requirements
- Local inference for summarisation and chat via Ollama or vLLM.
- Vector database containerised as part of the stack.
- No committed secrets; use `.env.example`.
- Test coverage of at least 85% on application code.
- Minimal UI, but functional.

## In-scope
- Single article ingest and chat flow.
- Wikipedia scraping for body text, headings, references.
- Local LLM runtime integration.
- Qdrant vector store.

## Out-of-scope
- User accounts, auth, multi-article history.
- Analytics, logging beyond basic server output.
- Full-text search beyond RAG question answering.

## Assumptions
- The user runs the app on a machine with Docker Compose.
- Ollama is available in a container and can expose a local REST API.
- The model weights are pulled manually if not already available.
- Wikipedia articles are public and can be scraped by HTML.

## Open questions decided unilaterally
- Use Ollama as the local LLM runtime and document model download.
- Use Qdrant for the vector database because it is Docker-friendly.
- Keep the frontend as a static HTML/JS app for simplicity.
