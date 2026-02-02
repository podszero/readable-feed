export interface Feed {
  id: string;
  title: string;
  xmlUrl: string;
  htmlUrl: string;
  unreadCount: number;
}

export interface Article {
  id: string;
  feedId: string;
  feedTitle: string;
  title: string;
  link: string;
  content: string;
  excerpt: string;
  author?: string;
  pubDate: Date;
  isRead: boolean;
  imageUrl?: string;
}

export interface FeedGroup {
  title: string;
  feeds: Feed[];
}

export type ViewMode = "all" | "unread" | "starred";
export type ArticleLayout = "list" | "card" | "magazine";
