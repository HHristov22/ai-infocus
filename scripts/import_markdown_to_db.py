import os
from pathlib import Path

import yaml
from dotenv import load_dotenv

from db import init_db, upsert_article_payload


def _parse_markdown_file(file_path):
    content = file_path.read_text(encoding="utf-8")

    if not content.startswith("---"):
        return None

    try:
        _, frontmatter, body = content.split("---", 2)
    except ValueError:
        return None

    metadata = yaml.safe_load(frontmatter) or {}

    slug = file_path.stem
    tags_list = metadata.get("tags", [])
    tags_dict = {}

    if isinstance(tags_list, list):
        for item in tags_list:
            if isinstance(item, dict):
                for key, value in item.items():
                    tags_dict[str(key)] = value

    return {
        "slug": slug,
        "title": metadata.get("title") or "Untitled",
        "source": metadata.get("source"),
        "published_at": metadata.get("date"),
        "link": metadata.get("link"),
        "tags": tags_dict,
        "content": body.strip(),
    }


def import_markdown_news(news_dir="news"):
    if not init_db():
        raise RuntimeError("POSTGRES_URL / DATABASE_URL is missing. Cannot import markdown files.")

    root = Path(news_dir)
    if not root.exists():
        print(f"Directory '{news_dir}' does not exist. Nothing to import.")
        return

    files = sorted(root.glob("*.md"))
    if not files:
        print("No markdown files found for import.")
        return

    imported = 0
    skipped = 0

    for file_path in files:
        parsed = _parse_markdown_file(file_path)
        if not parsed:
            print(f"Skipped invalid markdown format: {file_path.name}")
            skipped += 1
            continue

        upsert_article_payload(**parsed)
        imported += 1

    print(f"Import finished. Imported/updated: {imported}, skipped: {skipped}.")


if __name__ == "__main__":
    load_dotenv()
    import_markdown_news()
