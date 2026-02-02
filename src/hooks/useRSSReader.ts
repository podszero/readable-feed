import { useState, useEffect, useCallback, useMemo } from "react";
import { Feed, Article, ViewMode } from "@/lib/types";
import { parseOPML, defaultOPML } from "@/lib/opml-parser";
import { fetchMultipleFeeds } from "@/lib/rss-fetcher";
import {
  getReadArticles,
  markArticleRead,
  markAllAsRead,
  getStarredArticles,
  toggleStarredArticle,
} from "@/lib/storage";

export function useRSSReader() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [readArticleIds, setReadArticleIds] = useState<Set<string>>(new Set());
  const [starredArticleIds, setStarredArticleIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize feeds from OPML
  useEffect(() => {
    const parsedFeeds = parseOPML(defaultOPML);
    setFeeds(parsedFeeds);
  }, []);

  // Load read/starred state from localStorage
  useEffect(() => {
    setReadArticleIds(getReadArticles());
    setStarredArticleIds(getStarredArticles());
  }, []);

  // Fetch all feeds
  const refreshFeeds = useCallback(async () => {
    if (feeds.length === 0) return;

    setIsLoading(true);
    setError(null);
    setLoadingProgress({ current: 0, total: feeds.length });

    try {
      const fetchedArticles = await fetchMultipleFeeds(feeds, (current, total) => {
        setLoadingProgress({ current, total });
      });

      // Apply read state from localStorage
      const readIds = getReadArticles();
      const articlesWithReadState = fetchedArticles.map((article) => ({
        ...article,
        isRead: readIds.has(article.id),
      }));

      setArticles(articlesWithReadState);
      setReadArticleIds(readIds);

      // Update feed unread counts
      const unreadCounts = new Map<string, number>();
      articlesWithReadState.forEach((article) => {
        if (!article.isRead) {
          unreadCounts.set(
            article.feedId,
            (unreadCounts.get(article.feedId) || 0) + 1
          );
        }
      });

      setFeeds((prevFeeds) =>
        prevFeeds.map((feed) => ({
          ...feed,
          unreadCount: unreadCounts.get(feed.id) || 0,
        }))
      );
    } catch (err) {
      setError("Failed to fetch feeds. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [feeds]);

  // Initial fetch
  useEffect(() => {
    if (feeds.length > 0 && articles.length === 0) {
      refreshFeeds();
    }
  }, [feeds.length]);

  // Filter articles based on selected feed, view mode, and search
  const filteredArticles = useMemo(() => {
    let result = articles;

    // Filter by feed
    if (selectedFeedId) {
      result = result.filter((a) => a.feedId === selectedFeedId);
    }

    // Filter by view mode
    if (viewMode === "unread") {
      result = result.filter((a) => !readArticleIds.has(a.id));
    } else if (viewMode === "starred") {
      result = result.filter((a) => starredArticleIds.has(a.id));
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query) ||
          a.feedTitle.toLowerCase().includes(query)
      );
    }

    return result;
  }, [articles, selectedFeedId, viewMode, readArticleIds, starredArticleIds, searchQuery]);

  // Mark article as read
  const handleMarkRead = useCallback((articleId: string) => {
    markArticleRead(articleId);
    setReadArticleIds((prev) => new Set([...prev, articleId]));
    setArticles((prev) =>
      prev.map((a) => (a.id === articleId ? { ...a, isRead: true } : a))
    );
    setFeeds((prev) =>
      prev.map((feed) => {
        const article = articles.find((a) => a.id === articleId);
        if (article && feed.id === article.feedId && feed.unreadCount > 0) {
          return { ...feed, unreadCount: feed.unreadCount - 1 };
        }
        return feed;
      })
    );
  }, [articles]);

  // Toggle starred
  const handleToggleStarred = useCallback((articleId: string) => {
    const isNowStarred = toggleStarredArticle(articleId);
    setStarredArticleIds((prev) => {
      const newSet = new Set(prev);
      if (isNowStarred) {
        newSet.add(articleId);
      } else {
        newSet.delete(articleId);
      }
      return newSet;
    });
  }, []);

  // Mark all visible as read
  const handleMarkAllRead = useCallback(() => {
    const ids = filteredArticles.filter((a) => !a.isRead).map((a) => a.id);
    markAllAsRead(ids);
    setReadArticleIds((prev) => new Set([...prev, ...ids]));
    setArticles((prev) =>
      prev.map((a) => (ids.includes(a.id) ? { ...a, isRead: true } : a))
    );
    setFeeds((prev) =>
      prev.map((feed) => {
        if (!selectedFeedId || feed.id === selectedFeedId) {
          return { ...feed, unreadCount: 0 };
        }
        return feed;
      })
    );
  }, [filteredArticles, selectedFeedId]);

  // Select article
  const handleSelectArticle = useCallback(
    (article: Article) => {
      setSelectedArticle(article);
      if (!article.isRead) {
        handleMarkRead(article.id);
      }
    },
    [handleMarkRead]
  );

  // Stats
  const totalUnread = useMemo(
    () => articles.filter((a) => !readArticleIds.has(a.id)).length,
    [articles, readArticleIds]
  );

  const totalStarred = useMemo(() => starredArticleIds.size, [starredArticleIds]);

  return {
    feeds,
    articles: filteredArticles,
    isLoading,
    loadingProgress,
    error,
    selectedFeedId,
    setSelectedFeedId,
    selectedArticle,
    setSelectedArticle,
    handleSelectArticle,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    refreshFeeds,
    handleMarkRead,
    handleToggleStarred,
    handleMarkAllRead,
    readArticleIds,
    starredArticleIds,
    totalUnread,
    totalStarred,
  };
}
