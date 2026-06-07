import json
import feedparser

RSS_FEEDS_FILE = './scripts/rss_feeds.json'


def is_active_feed(feed):
    bozo_exception = getattr(feed, 'bozo_exception', None)
    harmless_bozo = (
        bozo_exception is not None
        and bozo_exception.__class__.__name__ == 'CharacterEncodingOverride'
    )
    return bool(feed.entries) and (
        not getattr(feed, 'bozo', False) or harmless_bozo
    )


def main():
    with open(RSS_FEEDS_FILE, 'r', encoding='utf-8') as file:
        rss_feeds = json.load(file)

    valid = {}
    invalid = {}

    for source, url in rss_feeds.items():
        feed = feedparser.parse(url)
        is_valid = is_active_feed(feed)

        if is_valid:
            valid[source] = {
                'url': url,
                'entries': len(feed.entries),
            }
        else:
            invalid[source] = url

    print('Valid feeds:')
    for source, info in valid.items():
        print(f"- {source}: {info['entries']} entries -> {info['url']}")

    print('\nInvalid feeds:')
    for source, url in invalid.items():
        print(f"- {source}: {url}")


if __name__ == '__main__':
    main()
