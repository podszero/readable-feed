import { Article, Feed } from "./types";

// Using allorigins.win as a CORS proxy
const CORS_PROXY = "https://api.allorigins.win/raw?url=";

export async function fetchFeed(feed: Feed): Promise<Article[]> {
  try {
    const encodedUrl = encodeURIComponent(feed.xmlUrl);
    const response = await fetch(`${CORS_PROXY}${encodedUrl}`, {
      headers: {
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status}`);
    }

    const text = await response.text();
    return parseRSSFeed(text, feed);
  } catch (error) {
    console.error(`Error fetching feed ${feed.title}:`, error);
    return [];
  }
}

function parseRSSFeed(xmlText: string, feed: Feed): Article[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  const articles: Article[] = [];

  // Check if it's RSS or Atom
  const isAtom = doc.querySelector("feed") !== null;

  if (isAtom) {
    const entries = doc.querySelectorAll("entry");
    entries.forEach((entry, index) => {
      if (index >= 20) return; // Limit to 20 articles per feed

      const title = getTextContent(entry, "title") || "Untitled";
      const linkEl = entry.querySelector('link[rel="alternate"]') || entry.querySelector("link");
      const link = linkEl?.getAttribute("href") || "";
      const content =
        getTextContent(entry, "content") ||
        getTextContent(entry, "summary") ||
        "";
      const author = getTextContent(entry, "author name") || getTextContent(entry, "author");
      const pubDateStr = getTextContent(entry, "published") || getTextContent(entry, "updated");
      const pubDate = pubDateStr ? new Date(pubDateStr) : new Date();

      const article = createArticle(feed, title, link, content, author, pubDate);
      articles.push(article);
    });
  } else {
    // RSS format
    const items = doc.querySelectorAll("item");
    items.forEach((item, index) => {
      if (index >= 20) return;

      const title = getTextContent(item, "title") || "Untitled";
      const link = getTextContent(item, "link") || "";
      const content =
        getTextContent(item, "content\\:encoded") ||
        getTextContent(item, "description") ||
        "";
      const author = getTextContent(item, "dc\\:creator") || getTextContent(item, "author");
      const pubDateStr = getTextContent(item, "pubDate");
      const pubDate = pubDateStr ? new Date(pubDateStr) : new Date();

      const article = createArticle(feed, title, link, content, author, pubDate);
      articles.push(article);
    });
  }

  return articles;
}

function createArticle(
  feed: Feed,
  title: string,
  link: string,
  content: string,
  author: string | undefined,
  pubDate: Date
): Article {
  const excerpt = extractExcerpt(content);
  const imageUrl = extractFirstImage(content);

  return {
    id: generateArticleId(link, title),
    feedId: feed.id,
    feedTitle: feed.title,
    title: cleanText(title),
    link,
    content,
    excerpt,
    author,
    pubDate,
    isRead: false,
    imageUrl,
  };
}

function getTextContent(element: Element, selector: string): string {
  const child = element.querySelector(selector);
  return child?.textContent?.trim() || "";
}

function extractExcerpt(html: string, maxLength: number = 200): string {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, "").trim();
  // Decode HTML entities
  const decoded = decodeHTMLEntities(text);
  // Truncate
  if (decoded.length <= maxLength) return decoded;
  return decoded.substring(0, maxLength).trim() + "...";
}

function extractFirstImage(html: string): string | undefined {
  const imgMatch = html.match(/<img[^>]+src="([^"]+)"/i);
  if (imgMatch && imgMatch[1]) {
    const src = imgMatch[1];
    // Skip data URIs and tracking pixels
    if (!src.startsWith("data:") && !src.includes("pixel") && !src.includes("tracking")) {
      return src;
    }
  }
  return undefined;
}

function cleanText(text: string): string {
  return decodeHTMLEntities(text.replace(/<[^>]*>/g, "").trim());
}

function decodeHTMLEntities(text: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function generateArticleId(link: string, title: string): string {
  const str = link || title;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `article_${Math.abs(hash).toString(16)}`;
}

export async function fetchMultipleFeeds(
  feeds: Feed[],
  onProgress?: (current: number, total: number) => void
): Promise<Article[]> {
  const allArticles: Article[] = [];
  
  // Fetch in batches to avoid overwhelming the proxy
  const batchSize = 3;
  for (let i = 0; i < feeds.length; i += batchSize) {
    const batch = feeds.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((feed) => fetchFeed(feed)));
    results.forEach((articles) => allArticles.push(...articles));
    
    if (onProgress) {
      onProgress(Math.min(i + batchSize, feeds.length), feeds.length);
    }
    
    // Small delay between batches
    if (i + batchSize < feeds.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  // Sort by date, newest first
  return allArticles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}
