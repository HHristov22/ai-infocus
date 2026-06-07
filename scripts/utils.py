import os
from datetime import datetime, timedelta
from newspaper import Article
from refactor import refactor_news_content, classify_news_content
from db import article_exists, upsert_article

NEWS_DIR = "news"


def _get_storage_mode():
    mode = os.getenv("NEWS_STORAGE_MODE", "database").strip().lower()
    if mode in {"db", "database"}:
        return "database"
    if mode in {"file", "markdown"}:
        return "file"
    if mode == "both":
        return "both"
    return "database"

def extract_article_content(url):
    """
    Fetches article content from a URL.
    """
    try:
        article = Article(url)
        article.download()
        article.parse()
        if len(article.text.strip()) == 0:
            return None
        return article.text
    except Exception as e:
        print(f"Error extracting content from {url}: {e}")
        return None

def save_as_markdown(news):
    """
    Persists a news object to the selected storage backend.
    """
    storage_mode = _get_storage_mode()
    persist_to_database = storage_mode in {"database", "both"}
    persist_to_file = storage_mode in {"file", "both"}

    if persist_to_file and not os.path.exists(NEWS_DIR):
        os.makedirs(NEWS_DIR)

    translation_table = str.maketrans({
        ' ': '_', ':': '_', '/': '', '%': '_', '\\': '', '?': '', '"': '', 
        '<': '', '>': '', '|': '', '*': '', '.': '_', '&': '_', '!': '', 
        '@': '', '#': '', '$': '_', '^': '_', '`': '_', '=': '_', '+': '_'
    })
    translated_title = news.title[:50].translate(translation_table).lower()
    filename = f"{news.published.replace(':', '-')}_{translated_title}.md"

    slug = filename.replace('.md', '')
    file_path = os.path.join(NEWS_DIR, filename)
    exists_in_file = persist_to_file and os.path.exists(file_path)
    exists_in_database = persist_to_database and article_exists(slug)

    if exists_in_file and (not persist_to_database or exists_in_database):
        print(f"Skipped existing article: {slug}")
        return

    news.content = refactor_news_content(news.content)
    if len(news.content) <= 1500:
        print(f"Skipped short article after refactor: {slug}")
        return

    tags = classify_news_content(news.content)

    for attempt in range(2):
        if isinstance(tags, dict) and len(tags) == 3:
            if all("tag" not in key and "name" not in key for key in tags.keys()):
                news.set_tags(tags)
                break
            print(f"Error with tag keys in {filename}: keys contain 'tag' or 'name'.")
            news.set_tags({})
        else:
            print(f"Error with NEWS TAGS:\n|{tags}|")
            news.set_tags({})

        if attempt == 0:
            print("Retrying...")
        else:
            print("Final attempt failed. Continuing with empty tags.")

    if persist_to_database:
        try:
            upsert_article(news, slug)
            print(f"Saved to database: {slug}")
        except Exception as error:
            print(f"Database save failed for {slug}: {error}")

    if persist_to_file and not exists_in_file:
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(news.to_markdown())
        print(f"Saved markdown: {filename}")




def delete_old_markdown_files():
    """
    Deletes Markdown files in the NEWS_DIR directory whose names start
    with a date older than 1 month from today (YYYY-MM-DD format).
    """
    if _get_storage_mode() not in {"file", "both"}:
        return

    if not os.path.exists(NEWS_DIR):
        print("Directory does not exist.")
        return

    # Calculate the threshold date (1 month ago)
    one_month_ago = datetime.now() - timedelta(days=31)

    for filename in os.listdir(NEWS_DIR):
        # Check if the file name starts with a date in YYYY_MM_DD format
        if filename.endswith(".md") and filename[:10].count('-') == 2:
            try:
                file_date = datetime.strptime(filename[:10], "%Y-%m-%d")
                # Check if the file date is older than 1 month
                if file_date < one_month_ago:
                    os.remove(os.path.join(NEWS_DIR, filename))
                    print(f"Deleted: {filename}")
            except ValueError:
                # Skip files that don't have a valid date format
                pass