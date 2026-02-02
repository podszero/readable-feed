const STORAGE_KEYS = {
  READ_ARTICLES: "rss_reader_read_articles",
  STARRED_ARTICLES: "rss_reader_starred_articles",
  PREFERENCES: "rss_reader_preferences",
};

export function getReadArticles(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.READ_ARTICLES);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (e) {
    console.error("Error reading from localStorage:", e);
  }
  return new Set();
}

export function markArticleRead(articleId: string): void {
  const readArticles = getReadArticles();
  readArticles.add(articleId);
  try {
    localStorage.setItem(
      STORAGE_KEYS.READ_ARTICLES,
      JSON.stringify([...readArticles])
    );
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }
}

export function markArticleUnread(articleId: string): void {
  const readArticles = getReadArticles();
  readArticles.delete(articleId);
  try {
    localStorage.setItem(
      STORAGE_KEYS.READ_ARTICLES,
      JSON.stringify([...readArticles])
    );
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }
}

export function getStarredArticles(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STARRED_ARTICLES);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (e) {
    console.error("Error reading from localStorage:", e);
  }
  return new Set();
}

export function toggleStarredArticle(articleId: string): boolean {
  const starred = getStarredArticles();
  const isNowStarred = !starred.has(articleId);
  
  if (isNowStarred) {
    starred.add(articleId);
  } else {
    starred.delete(articleId);
  }
  
  try {
    localStorage.setItem(
      STORAGE_KEYS.STARRED_ARTICLES,
      JSON.stringify([...starred])
    );
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }
  
  return isNowStarred;
}

export interface Preferences {
  theme: "light" | "dark" | "system";
  fontSize: "small" | "medium" | "large";
  articleLayout: "list" | "card" | "magazine";
}

export const defaultPreferences: Preferences = {
  theme: "system",
  fontSize: "medium",
  articleLayout: "list",
};

export function getPreferences(): Preferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (stored) {
      return { ...defaultPreferences, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error("Error reading preferences:", e);
  }
  return defaultPreferences;
}

export function savePreferences(prefs: Partial<Preferences>): void {
  const current = getPreferences();
  const updated = { ...current, ...prefs };
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving preferences:", e);
  }
}

export function markAllAsRead(articleIds: string[]): void {
  const readArticles = getReadArticles();
  articleIds.forEach((id) => readArticles.add(id));
  try {
    localStorage.setItem(
      STORAGE_KEYS.READ_ARTICLES,
      JSON.stringify([...readArticles])
    );
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }
}
