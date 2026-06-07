from datetime import datetime

class News:
    def __init__(self, title, content, link, source, published):
        self.title = title
        self.content = content
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
            tags = []
            # raise ValueError("The 'tags' attribute must be a dictionary with tag names as keys and relevance as values.")
        if not all(isinstance(k, str) and isinstance(v, (int, float)) for k, v in tags.items()):
            tags = []
            # raise ValueError("Each tag must be a string key with an integer or float value representing relevance.")
        
        self.tags = tags

    def to_markdown(self):
        """
        Generates content for the Markdown file from the object.
        """
        # Escape special characters in the title
        safe_title = self.title.replace('"', '\\"')

        # Format tags as a list
        formatted_tags = [{key: value} for key, value in self.tags.items()]

        return f"""---
title: "{safe_title}"
source: {self.source}
date: {self.published}
link: {self.link}
tags: {formatted_tags}
---

{self.content}
"""
