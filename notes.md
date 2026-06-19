# Notes

Known limitation: import API response time is 60-120 seconds due to local LLM inference without GPU acceleration. In production this would use a GPU-enabled deployment (or a managed LLM service) to reduce latency.

Additional notes:
- The server is defensive when building prompt context from vector search hits; it falls back to chunk id or serialized metadata when `payload.content` is missing.
- Tests now include a case for minimal hit payloads to prevent regressions.
