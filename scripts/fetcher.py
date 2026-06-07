import feedparser
import time
from datetime import datetime, timedelta
from utils import extract_article_content
from news import News
import json

def load_rss_feeds(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        rss_feeds = json.load(file)
    return rss_feeds
 

def fetch_ai_news():
    """
    Retrieves news from RSS feeds related to AI.
    """
    ai_keywords = [
        'artificial intelligence', 'machine learning', 'deep learning',
        'neural network', 'natural language processing', 'nlp', 'ml', 'dl',
        'computer vision', 'generative ai', 'large language model',
        'transformer model', 'bard', 'nvidia', 'midjourney',
        'stability ai', 'data science', 'predictive analytics',
        'autonomous systems', 'robotics', 'ai ethics', 'ai bias', 'reinforcement learning'
    ]
    
    ai_news = []
    rss_feeds = load_rss_feeds('./scripts/rss_feeds.json')
    now = datetime.now()
    n_hours_ago = now - timedelta(hours=8)

    for source, url in rss_feeds.items():
        feed = feedparser.parse(url)
        for entry in feed.entries:
            published_time = None
            if hasattr(entry, 'published_parsed') and entry.published_parsed:
                published_time = datetime.fromtimestamp(time.mktime(entry.published_parsed))
            
            if published_time and published_time >= n_hours_ago:
                if any(keyword in entry.title.lower() for keyword in ai_keywords) or ('AI' in entry.title):
                    content= extract_article_content(entry.link)
                    if content:
                        if len(content)>1500:
                            ai_news.append(News(
                                title=entry.title,
                                content=content,
                                link=entry.link,
                                source=source,
                                published=published_time
                            ))
    return ai_news
