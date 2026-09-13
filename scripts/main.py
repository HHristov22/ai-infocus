import argparse

from fetcher import fetch_ai_news
from utils import persist_article
from db import init_db

def main(times=1, days=0):
    init_db()

    for _ in range(times):
        print("Fetching AI news...")
        ai_news = fetch_ai_news(days=days)
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
    parser.add_argument(
        "--days",
        type=int,
        default=0,
        help="Look back this many days; 0 keeps the default 12-hour window.",
    )
    args = parser.parse_args()

    main(times=args.times, days=args.days)