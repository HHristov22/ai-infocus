import argparse

from fetcher import fetch_ai_news
from utils import persist_article
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
                persist_article(news)
            print("All articles processed!")
        else:
            print("No articles found.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run AI news ingestion pipeline.")
    parser.add_argument("--times", type=int, default=1, help="How many ingestion iterations to run.")
    args = parser.parse_args()

    main(times=args.times)