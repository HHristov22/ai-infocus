import os
from datetime import datetime, timedelta
from newspaper import Article
from refactor import refactor_news_content, classify_news_content

NEWS_DIR = "news"

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
    Saves an object of type News as a Markdown file.
    """
    if not os.path.exists(NEWS_DIR):
        os.makedirs(NEWS_DIR)

    translation_table = str.maketrans({
        ' ': '_', ':': '_', '/': '', '%': '_', '\\': '', '?': '', '"': '', 
        '<': '', '>': '', '|': '', '*': '', '.': '_', '&': '_', '!': '', 
        '@': '', '#': '', '$': '_', '^': '_', '`': '_', '=': '_', '+': '_'
    })
    translated_title = news.title[:50].translate(translation_table).lower()
    filename = f"{news.published.replace(':', '-')}_{translated_title}.md"
    
    if not os.path.exists(os.path.join(NEWS_DIR, filename)):
        news.content = refactor_news_content(news.content)  # Refactor the content
        if len(news.content) > 1500:
            tags = classify_news_content(news.content)
            
            # Check if tags is a dictionary with exactly three elements
            for attempt in range(2):
                if isinstance(tags, dict) and len(tags) == 3:
                    # Ensure no key contains "tag" or "name"
                    if all("tag" not in key and "name" not in key for key in tags.keys()):
                        news.set_tags(tags)

                        with open(os.path.join(NEWS_DIR, filename), "w", encoding="utf-8") as file:
                            file.write(news.to_markdown())
                        print(f"Saved: {filename}")
                        break  # Успешно запазено, излизаме от цикъла
                    else:
                        print(f"Error with tag keys in {filename}: keys contain 'tag' or 'name'.")
                        news.set_tags({})
                else:
                    print(f"Error with NEWS TAGS:\n|{tags}|")
                    news.set_tags({})

                if attempt == 0:  # Повторен опит само ако сме в първия опит
                    print("Retrying...")
                else:
                    print("Final attempt failed. Aborting.")




def delete_old_markdown_files():
    """
    Deletes Markdown files in the NEWS_DIR directory whose names start
    with a date older than 1 month from today (YYYY-MM-DD format).
    """
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