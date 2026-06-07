# AI Infocus

AI Infocus is an automated AI news aggregation app.
It collects articles from RSS feeds, enriches and tags them with AI, stores them as Markdown snapshots, and serves them through a Next.js frontend.

## Architecture (Best Practice for GitHub + Vercel)

### 1) Ingestion Layer (Python)
- Location: `scripts/`
- Responsibilities:
    - Fetch RSS entries from configured sources.
    - Filter by AI relevance + recency.
    - Extract full content.
    - Refactor and classify with LLM.
    - Persist as Markdown in `news/`.

### 2) Content Layer (Git-tracked snapshots)
- Location: `news/`
- Format: Markdown with frontmatter (`title`, `source`, `date`, `link`, `tags`).
- Purpose:
    - Versioned content history in Git.
    - Deterministic deploys on Vercel.
    - Easy rollback of bad ingestion runs.

### 3) Delivery Layer (Next.js)
- Location: `src/pages/`
- Responsibilities:
    - List and render news from Markdown.
    - Provide API endpoint (`/api/articles`) for latest cards.
    - Use response caching headers for faster repeated reads on Vercel CDN.

### 4) Automation Layer (GitHub Actions)
- Location: `.github/workflows/fetch-news.yml`
- Responsibilities:
    - Scheduled runs (hourly).
    - Execute ingestion script.
    - Commit only changed `news/` files.
    - Push to GitHub to trigger Vercel deployment.

## Recommended Hosting Flow
1. GitHub Actions updates `news/` on schedule.
2. Push to default branch triggers Vercel build.
3. Vercel serves updated app globally.

## Save vs Cache Strategy

### Option A (Current and recommended for your setup): Save snapshots in Git
- Pros:
    - Simple and reliable.
    - Full content history.
    - Easy to debug and compare changes.
- Cons:
    - Frequent commits create noise.
    - Each push triggers a deployment.

### Option B (Alternative): Cache outside Git
- Store normalized news in Redis/KV/DB and render dynamically.
- Keep short CDN cache (for example 10-15 min) with stale-while-revalidate.
- Pros: fewer commits/deploys, near-real-time refresh.
- Cons: higher architecture complexity, external infra.

If you want a graduation path: start with Option A, then move to Option B when traffic and update frequency grow.

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
5. Run ingestion manually:
     - `python scripts/main.py`
6. Start frontend:
     - `npm run dev`

## GitHub Secrets Required
- `GEMINI_API_KEY`

## Vercel Setup Checklist
1. Import GitHub repository into Vercel.
2. Set project framework to Next.js.
3. Enable automatic deployments from your main branch.
4. Add environment variables in Vercel only if runtime routes require them.
5. Keep ingestion in GitHub Actions (not in Vercel build step).
