# Tasks

## Plan
- [ ] Create `REQUIREMENTS.md`, `DESIGN.md`, `TASKS.md`
- [ ] Decide stack and runtime (Express + static UI, Ollama + Qdrant)
- [ ] Define API contract for import and chat
- [ ] Draft Docker Compose stack for app, Qdrant, Ollama

## Backend
- [ ] Build Express server and API routes
- [ ] Implement Wikipedia scraping service
- [ ] Implement chunking utility
- [ ] Implement Ollama client for summarisation, embeddings, chat
- [ ] Implement Qdrant client for collection and search
- [ ] Wire import flow: scrape, summarise, embed, store
- [ ] Wire chat flow: embed question, retrieve, answer

## Frontend
- [ ] Build static UI with URL form, summary area, chat box
- [ ] Connect frontend to backend API
- [ ] Add error handling and loading states

## Testing
- [ ] Write unit tests for scrape, chunk, Ollama client, Qdrant client
- [ ] Write integration test for import/chat routes with mocked services
- [ ] Confirm coverage ≥ 85%

## Containerisation
- [ ] Build Dockerfile for backend
- [ ] Write `docker-compose.yml` for app, Qdrant, Ollama
- [ ] Document model pull instructions for Ollama

## Finish
- [ ] Validate stack with `docker compose up`
- [ ] Add README and notes
- [ ] Commit final files with an audit-ready structure
