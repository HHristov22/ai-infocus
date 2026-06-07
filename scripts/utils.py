from newspaper import Article
from refactor import classify_news_content, prepare_news_versions
from db import article_exists, upsert_article

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

def persist_article(news):
    """
    Persists a news object to the database.
    """
    translation_table = str.maketrans({
        ' ': '_', ':': '_', '/': '', '%': '_', '\\': '', '?': '', '"': '', 
        '<': '', '>': '', '|': '', '*': '', '.': '_', '&': '_', '!': '', 
        '@': '', '#': '', '$': '_', '^': '_', '`': '_', '=': '_', '+': '_'
    })
    translated_title = news.title[:50].translate(translation_table).lower()
    filename = f"{news.published.replace(':', '-')}_{translated_title}.md"

    slug = filename.replace('.md', '')
    exists_in_database = article_exists(slug)

    if exists_in_database:
        print(f"Skipped existing article: {slug}")
        return

    prepared_versions = prepare_news_versions(news.title, news.content)
    if not prepared_versions or not prepared_versions.get("is_valid"):
        print(f"Skipped low-quality/incomplete article: {slug}")
        return

    news.set_localized_versions(
        prepared_versions["title_en"],
        prepared_versions["content_en"],
        prepared_versions["title_bg"],
        prepared_versions["content_bg"],
    )

    if len(news.content) <= 1500:
        print(f"Skipped short article after preparation: {slug}")
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

    try:
        upsert_article(news, slug)
        print(f"Saved to database: {slug}")
    except Exception as error:
        print(f"Database save failed for {slug}: {error}")