from datetime import datetime

class News:
    def __init__(self, title, content, link, source, published):
        self.title = title
        self.title_bg = None
        self.content = content
        self.content_bg = None
        self.link = link
        self.source = source

        # Ensure published is a datetime object and format it as a string
        if isinstance(published, str):
            raise ValueError("The 'published' attribute must be a datetime object, not a string.")
        if not isinstance(published, datetime):
            raise ValueError("The 'published' attribute must be a valid datetime object.")
        
        self.published = published.strftime("%Y-%m-%dT%H:%M:%S")

    def set_tags(self, tags):
        """
        Set or update the tags for the News object.
        :param tags: Dictionary of tags with tag names as keys and relevance as values.
        """
        if not isinstance(tags, dict):
            tags = {}

        normalized_tags = {}
        for key, value in tags.items():
            if not isinstance(key, str) or not isinstance(value, (int, float)):
                continue
            normalized_tags[key] = int(round(value))
        
        self.tags = normalized_tags

    def set_localized_versions(self, title_en, content_en, title_bg, content_bg):
        self.title = title_en
        self.content = content_en
        self.title_bg = title_bg
        self.content_bg = content_bg

