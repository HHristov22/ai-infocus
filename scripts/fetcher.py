import feedparser
import time
import re
from datetime import datetime, timedelta
from utils import extract_article_content
from news import News
import json


def _is_active_feed(feed):
    bozo_exception = getattr(feed, 'bozo_exception', None)
    harmless_bozo = (
        bozo_exception is not None
        and bozo_exception.__class__.__name__ == 'CharacterEncodingOverride'
    )
    return bool(feed.entries) and (
        not getattr(feed, 'bozo', False) or harmless_bozo
    )

def load_rss_feeds(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        rss_feeds = json.load(file)
    return rss_feeds


def validate_rss_feed(url):
    feed = feedparser.parse(url)
    is_valid = _is_active_feed(feed)
    return is_valid, feed


def get_valid_rss_feeds(file_path):
    rss_feeds = load_rss_feeds(file_path)
    valid_feeds = {}

    for source, url in rss_feeds.items():
        is_valid, _ = validate_rss_feed(url)
        if is_valid:
            valid_feeds[source] = url
            print(f"PASS RSS feed: {source} -> {url}")
        else:
            print(f"Skipping invalid RSS feed: {source} -> {url}")

    return valid_feeds
 

def fetch_ai_news():
    """
    Retrieves news from RSS feeds related to AI.
    """
    strong_signals = {
        'agentic ai', 'ai agents', 'autonomous agent', 'reasoning model',
        'large language model', 'small language model', 'foundation model',
        'retrieval-augmented generation', 'retrieval augmented generation', 'rag',
        'multimodal', 'vision-language model', 'diffusion model',
        'mixture of experts', 'moe', 'quantization', 'distillation',
        'synthetic data', 'fine-tuning', 'ai safety', 'alignment',
        'model evaluation', 'gemini', 'llama', 'claude', 'gpt',
        'codex', 'qwen', 'mistral', 'deepseek'
    }

    medium_signals = {
        'artificial intelligence', 'machine learning', 'deep learning',
        'neural network', 'natural language processing', 'computer vision',
        'generative ai', 'reasoning', 'text-to-image', 'text-to-video',
        'video generation', 'inference', 'red teaming', 'benchmarks',
        'autonomous systems', 'edge ai', 'ai chip', 'robotics'
    }

    weak_signals = {
        'data science',
    }

    min_score = 1.5
    
    ai_news = []
    rss_feeds = get_valid_rss_feeds('./scripts/rss_feeds.json')
    now = datetime.now()
    n_hours_ago = now - timedelta(hours=12)

    for source, url in rss_feeds.items():
        extracted_for_source = 0
        _, feed = validate_rss_feed(url)
        for entry in feed.entries:
            published_time = None
            if hasattr(entry, 'published_parsed') and entry.published_parsed:
                published_time = datetime.fromtimestamp(time.mktime(entry.published_parsed))
            
            if published_time and published_time >= n_hours_ago:
                title = getattr(entry, 'title', '') or ''
                summary = getattr(entry, 'summary', '') or ''
                combined_text = f"{title} {summary}".lower()

                score = 0
                for keyword in strong_signals:
                    if keyword in combined_text:
                        score += 2

                for keyword in medium_signals:
                    if keyword in combined_text:
                        score += 1

                for keyword in weak_signals:
                    if keyword in combined_text:
                        score += 0.5

                if re.search(r'\bai\b', combined_text):
                    score += 1

                has_ai_signal = score >= min_score

                if has_ai_signal:
                    content= extract_article_content(entry.link)
                    if content:
                        if len(content)>750:
                            ai_news.append(News(
                                title=entry.title,
                                content=content,
                                link=entry.link,
                                source=source,
                                published=published_time
                            ))
                            extracted_for_source += 1

        print(f"EXTRACTED {source}: {extracted_for_source} articles -> {url}")
    return ai_news
