""" Explore by Keyword search page extras
"""
from core_explore_keyword_app.utils.abstract_keyword_search_extras import (
    AbstractKeywordSearchExtras,
)


class KeywordSearchExtras(AbstractKeywordSearchExtras):
    """KeywordSearchExtras"""

    @staticmethod
    def get_extra_html():
        return []

    @staticmethod
    def get_extra_js():
        return [{"path": "js/explore_keyword.js", "is_raw": False}]

    @staticmethod
    def get_extra_css():
        return ["css/explore_keyword.css"]
