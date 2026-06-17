# Design

## Architecture

A simple web server exposes two API endpoints and serves a static frontend.
- `POST /api/import` accepts a Wikipedia URL
  - Scrapes article text and metadata
  - Generates a summary via Ollama
  - Chunks text and creates embeddings
  - Stores embeddings in Qdrant with article metadata
- `POST /api/chat` accepts a question and article ID
  - Generates a query embedding via Ollama
  - Retrieves matching chunks from Qdrant
  - Sends a grounded prompt to Ollama to answer the question

## Components

- `src/server.js` — Express server and API wiring
- `src/services/scrape.js` — HTML scraping and content extraction
- `src/services/chunk.js` — text chunking algorithm
- `src/services/ollamaClient.js` — local LLM / embedding API abstraction
- `src/services/vectorClient.js` — Qdrant REST wrapper
- `public/` — static UI for URL input, summary display, and chat

## Data flow

1. User submits a Wikipedia URL.
2. Server scrapes the article and creates a plain-text representation.
3. Server asks Ollama to summarise the article text.
4. Server splits the article into overlapping chunks.
5. Ollama creates embeddings for each chunk.
6. Server stores chunk vectors and metadata in Qdrant.
7. User submits a chat query.
8. Server embeds the query, retrieves the highest-scoring chunks, and asks Ollama to answer with the retrieved context.

## Local LLM runtime

- Chosen runtime: Ollama
- Chosen model: `llama3:3b`
- Deployment: containerised Ollama service exposed at `http://ollama:11434`
- Motivation: Ollama provides a local inference runtime with a standard REST interface and is aligned with the brief.

## Vector store

- Chosen database: Qdrant
- Justification: Docker-friendly, easy REST API, supports filtered nearest-neighbor searches.
- Collection: `wiki-articles`
- Payload: article ID, chunk text, section, and chunk index.

## Chunking strategy

- Chunks are generated from article paragraphs and headings.
- Each chunk is approximately 400 words with a 50-word overlap.
- This keeps context focused and supports more accurate retrieval.

## Frontend

- Minimal static HTML plus JavaScript.
- User flow: URL input → summary + article loaded → question input → chat answer.

## Diagram

User -> Browser UI -> Express API
          |                  |
          +-- POST /api/import +--> Scrape -> Summarise -> Chunk -> Embed -> Qdrant
          +-- POST /api/chat   +--> Embed query -> Search Qdrant -> Grounded prompt -> Ollama
