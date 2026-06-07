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
                    source TEXT,
                    published_at TIMESTAMPTZ,
                    link TEXT UNIQUE,
                    tags JSONB DEFAULT '{}'::jsonb,
                    content TEXT NOT NULL,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                """
            )
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
    connection_string = _get_connection_string()
    if not connection_string:
        return False

    with psycopg2.connect(connection_string) as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO articles (slug, title, source, published_at, link, tags, content)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (slug)
                DO UPDATE SET
                    title = EXCLUDED.title,
                    source = EXCLUDED.source,
                    published_at = EXCLUDED.published_at,
                    link = EXCLUDED.link,
                    tags = EXCLUDED.tags,
                    content = EXCLUDED.content,
                    updated_at = NOW();
                """,
                (
                    slug,
                    news.title,
                    news.source,
                    news.published,
                    news.link,
                    Json(news.tags if isinstance(news.tags, dict) else {}),
                    news.content,
                ),
            )
    return True
