from fetcher import fetch_ai_news
from utils import save_as_markdown, delete_old_markdown_files
from db import init_db

def main(times=1):
    init_db()

    for _ in range(times):
        print("Fetching AI news...")
        ai_news = fetch_ai_news()
        print(f"Found {len(ai_news)} articles published.")
        
        if ai_news:
            print("Persisting articles...")
            for news in ai_news:
                save_as_markdown(news)
            print("All articles processed!")
        else:
            print("No articles found.")
        
        print("Cleaning old markdown files...")
        delete_old_markdown_files()
        print("Cleanup finished.")


if __name__ == "__main__":
    main()