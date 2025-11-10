Contributing Guide

Branching
- main: stable
- feature/*: new features
- fix/*: bug fixes

Commit Messages
- Conventional style: feat:, fix:, docs:, refactor:, chore:, test:

Code Style
- Backend: Node 18+, use async/await, error handling middleware.
- AI service: follow PEP8, docstrings for endpoints, avoid committing large model files.
- Frontend: React function components, hooks, prop types or TypeScript (optional).

Env and Secrets
- Use .env files; do not commit secrets. Replace backend/config.js hardcoded values before production.

PR Checklist
- Lint passes
- Added/updated docs as needed
- Tested locally (frontend, backend, ai-service running)

Testing
- Manual: Postman/curl for API endpoints.
- Add unit tests over time (Jest for frontend, Mocha/Jest for backend, pytest for AI service).
