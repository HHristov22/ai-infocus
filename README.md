# AI Infocus

AI Infocus is an automated AI news aggregation app.
It collects articles from RSS feeds, enriches and tags them with AI, stores them in Postgres (Neon/Vercel), and serves them through a Next.js frontend.

## Architecture (Best Practice for GitHub + Vercel)

### 1) Ingestion Layer (Python)
- Location: `scripts/`
- Responsibilities:
    - Fetch RSS entries from configured sources.
    - Filter by AI relevance + recency.
    - Extract full content.
    - Refactor and classify with LLM.
    - Persist to Postgres (`articles` table).

### 2) Content Layer (Postgres)
- Storage: Neon/Vercel Postgres
- Table: `articles`
- Purpose:
    - Central source of truth for news content.
    - No noisy content commits for every ingestion run.
    - Better scalability for filtering and querying.

Markdown files under `news/` are optional fallback and can be imported into DB.

### 3) Delivery Layer (Next.js)
- Location: `src/pages/`
- Responsibilities:
    - List and render news from DB.
    - Provide API endpoint (`/api/articles`) for latest cards.
    - Use response caching headers for faster repeated reads on Vercel CDN.

### 4) Automation Layer (GitHub Actions)
- Location: `.github/workflows/fetch-news.yml`
- Responsibilities:
    - Scheduled runs (hourly).
    - Execute ingestion script.
    - Write directly to Postgres.

## Recommended Hosting Flow
1. GitHub Actions runs ingestion on schedule.
2. Pipeline writes new content into Postgres.
3. Vercel reads from Postgres at runtime.

## Storage Modes

`NEWS_STORAGE_MODE` controls where ingestion writes content:
- `database` (default): DB only.
- `file`: Markdown only.
- `both`: DB + Markdown.

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.10+

### Setup
1. Install frontend dependencies:
     - `npm install`
2. Create and activate virtual environment:
     - `python3 -m venv venv`
     - `source venv/bin/activate`
3. Install Python dependencies:
     - `pip install -r requirements.txt`
4. Configure environment variables in `.env`:
    - `GEMINI_API_KEY=...`
    - `POSTGRES_URL=...`
5. Run ingestion manually:
    - DB mode: `python scripts/main.py --storage-mode database --times 1`
    - or `npm run ingest:db`
6. Import existing markdown files into DB (optional):
    - `python scripts/import_markdown_to_db.py`
    - or `npm run import:markdown-to-db`
6. Start frontend:
    - `npm run dev`

## GitHub Secrets Required
- `GEMINI_API_KEY`
- `POSTGRES_URL`

## Vercel Setup Checklist
1. Import GitHub repository into Vercel.
2. Set project framework to Next.js.
3. Enable automatic deployments from your main branch.
4. Add environment variables in Vercel only if runtime routes require them.
5. Add `POSTGRES_URL` in Vercel Project Environment Variables.
6. Keep ingestion in GitHub Actions (not in Vercel build step).
