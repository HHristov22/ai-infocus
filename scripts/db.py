import os
import psycopg2
from psycopg2.extras import Json


def _get_connection_string():
    return os.getenv("POSTGRES_URL") or os.getenv("DATABASE_URL")


def is_database_configured():
    return bool(_get_connection_string())


def init_db():
    connection_string = _get_connection_string()
    if not connection_string:
        print("POSTGRES_URL / DATABASE_URL not set. Skipping database initialization.")
        return False

    with psycopg2.connect(connection_string) as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS articles (
                    id SERIAL PRIMARY KEY,
                    slug TEXT NOT NULL UNIQUE,
                    title TEXT NOT NULL,
                    title_bg TEXT,
                    source TEXT,
                    published_at TIMESTAMPTZ,
                    link TEXT UNIQUE,
                    tags JSONB DEFAULT '{}'::jsonb,
                    content TEXT NOT NULL,
                    content_bg TEXT,
                    view_count BIGINT NOT NULL DEFAULT 0,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                """
            )
            cursor.execute("ALTER TABLE articles ADD COLUMN IF NOT EXISTS title_bg TEXT;")
            cursor.execute("ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_bg TEXT;")
            cursor.execute("ALTER TABLE articles ADD COLUMN IF NOT EXISTS view_count BIGINT NOT NULL DEFAULT 0;")
    return True


def article_exists(slug):
    connection_string = _get_connection_string()
    if not connection_string:
        return False

    with psycopg2.connect(connection_string) as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1 FROM articles WHERE slug = %s LIMIT 1", (slug,))
            return cursor.fetchone() is not None


def upsert_article(news, slug):
    tags = news.tags if isinstance(news.tags, dict) else {}
    return upsert_article_payload(
        slug=slug,
        title=news.title,
        title_bg=getattr(news, 'title_bg', None),
        source=news.source,
        published_at=news.published,
        link=news.link,
        tags=tags,
        content=news.content,
        content_bg=getattr(news, 'content_bg', None),
    )


def upsert_article_payload(slug, title, title_bg, source, published_at, link, tags, content, content_bg):
    connection_string = _get_connection_string()
    if not connection_string:
        return False

    with psycopg2.connect(connection_string) as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO articles (slug, title, title_bg, source, published_at, link, tags, content, content_bg)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (slug)
                DO UPDATE SET
                    title = EXCLUDED.title,
                    title_bg = EXCLUDED.title_bg,
                    source = EXCLUDED.source,
                    published_at = EXCLUDED.published_at,
                    link = EXCLUDED.link,
                    tags = EXCLUDED.tags,
                    content = EXCLUDED.content,
                    content_bg = EXCLUDED.content_bg,
                    updated_at = NOW();
                """,
                (
                    slug,
                    title,
                    title_bg,
                    source,
                    published_at,
                    link,
                    Json(tags if isinstance(tags, dict) else {}),
                    content,
                    content_bg,
                ),
            )
    return True
