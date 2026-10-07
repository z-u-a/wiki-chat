# RAG Chat

A minimal Wikipedia article ingestion app with local LLM summarisation and RAG-powered chat.

## What it does
- Accepts a Wikipedia URL
- Scrapes the article content from Wikipedia
- Generates a summary using a local Ollama model
- Chunks the article text and stores embeddings in Qdrant
- Answers user questions using retrieved chunks and a grounded local LLM response

## Prerequisites
- Docker / Docker Compose
- Node.js 20+ for local test execution

## Quick start
1. Copy `.env.example` to `.env` and adjust values if needed.
2. Start the full stack:
   ```bash
   docker compose up --build
   ```
3. Open the app at `http://localhost:4000`

## Local testing
Install dependencies and run coverage tests:
```bash
npm install
npm test
```

## Local Ollama model
The app uses Ollama via `http://ollama:11434`.
If you need to pull a model into the Ollama container:
```bash
docker compose run ollama ollama pull llama3.2:1b
```

Note: `docker compose up` will start the Ollama service and (by default) pull the configured models. Pulling and loading models can take several minutes and the first chat/import requests may return empty content while a model finishes loading. See `notes.md` for known limitations and timings.

## Notes
- The vector database is Qdrant, containerised in `docker-compose.yml`.
- Both summarisation and chat are routed through local Ollama inference.
- The UI is intentionally minimal: URL input, summary display, and chat box.

Known limitation: import API response time can be 60–120 seconds when running locally without GPU acceleration. See `notes.md` for details.

## Useful files
- `REQUIREMENTS.md`
- `DESIGN.md`
- `TASKS.md`
- `docker-compose.yml`
- `Dockerfile`
- `src/`
- `test/`
