# Tasks

## Plan
- [x] Create `REQUIREMENTS.md`, `DESIGN.md`, `TASKS.md`
- [x] Decide stack and runtime (Express + static UI, Ollama + Qdrant)
- [x] Define API contract for import and chat
- [x] Draft Docker Compose stack for app, Qdrant, Ollama

## Backend
- [x] Build Express server and API routes
- [x] Implement Wikipedia scraping service
- [x] Implement chunking utility
- [x] Implement Ollama client for summarisation, embeddings, chat
- [x] Implement Qdrant client for collection and search
- [x] Wire import flow: scrape, summarise, embed, store
- [x] Wire chat flow: embed question, retrieve, answer
- [x] Fix Qdrant collection creation endpoint (PUT vs POST)
- [x] Fix point ID type (string → number)  
- [x] Parallelize summarize and embed with Promise.all
- [x] Handle missing `payload.content` in search hits (robust context builder)

## Frontend
- [x] Build static UI with URL form, summary area, chat box
- [x] Connect frontend to backend API
- [ ] Add error handling and loading states

## Testing
- [x] Write unit tests for scrape, chunk, Ollama client, Qdrant client
- [x] Write integration test for import/chat routes with mocked services
- [x] Confirm coverage ≥ 85%
- [x] Update unit test for chat to include minimal search hit shape

## Containerisation
- [x] Build Dockerfile for backend
- [x] Write `docker-compose.yml` for app, Qdrant, Ollama
- [x] Document model pull instructions for Ollama

## Finish
- [x] Validate stack with `docker compose up`
- [x] Add README and notes
- [x] Commit final files with an audit-ready structure
