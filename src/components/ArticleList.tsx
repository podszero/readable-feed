import { Article } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import {
  Search,
  CheckCheck,
  Star,
} from "lucide-react";

interface ArticleListProps {
  articles: Article[];
  selectedArticle: Article | null;
  onSelectArticle: (article: Article) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMarkAllRead: () => void;
  readArticleIds: Set<string>;
  starredArticleIds: Set<string>;
  onToggleStarred: (articleId: string) => void;
  isLoading: boolean;
  loadingProgress: { current: number; total: number };
}

export function ArticleList({
  articles,
  selectedArticle,
  onSelectArticle,
  searchQuery,
  onSearchChange,
  onMarkAllRead,
  readArticleIds,
  starredArticleIds,
  onToggleStarred,
  isLoading,
  loadingProgress,
}: ArticleListProps) {
  return (
    <div className="flex flex-col h-full bg-background border-r border-border w-full sm:w-80 md:w-72 lg:w-80 xl:w-96">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-border space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 h-10 sm:h-9"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-muted-foreground">
            {isLoading
              ? `Loading... ${loadingProgress.current}/${loadingProgress.total}`
              : `${articles.length} articles`}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllRead}
            className="text-xs h-8 sm:h-7 px-2 sm:px-3"
          >
            <CheckCheck className="h-3.5 w-3.5 mr-1" />
            <span className="hidden xs:inline">Mark all read</span>
            <span className="xs:hidden">Read all</span>
          </Button>
        </div>
      </div>

      {/* Article List */}
      <ScrollArea className="flex-1">
        {isLoading && articles.length === 0 ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-base">No articles found</p>
            <p className="text-sm mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {articles.map((article) => (
              <ArticleRow
                key={article.id}
                article={article}
                isSelected={selectedArticle?.id === article.id}
                isRead={readArticleIds.has(article.id)}
                isStarred={starredArticleIds.has(article.id)}
                onSelect={() => onSelectArticle(article)}
                onToggleStarred={() => onToggleStarred(article.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

interface ArticleRowProps {
  article: Article;
  isSelected: boolean;
  isRead: boolean;
  isStarred: boolean;
  onSelect: () => void;
  onToggleStarred: () => void;
}

function ArticleRow({
  article,
  isSelected,
  isRead,
  isStarred,
  onSelect,
  onToggleStarred,
}: ArticleRowProps) {
  const timeAgo = formatDistanceToNow(article.pubDate, { addSuffix: true });

  return (
    <article
      onClick={onSelect}
      className={cn(
        "p-3 sm:p-4 cursor-pointer transition-colors group animate-fade-in",
        isSelected ? "bg-accent" : "hover:bg-muted/50 active:bg-muted/70",
        !isRead && "border-l-2 border-l-unread"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-article-meta truncate max-w-[120px] sm:max-w-[150px]">
              {article.feedTitle}
            </span>
            <span className="text-xs text-article-meta">·</span>
            <span className="text-xs text-article-meta whitespace-nowrap">
              {timeAgo}
            </span>
          </div>
          <h3
            className={cn(
              "text-sm sm:text-[15px] leading-snug mb-1.5 line-clamp-2",
              isRead ? "text-article-excerpt" : "text-article-title font-medium"
            )}
          >
            {article.title}
          </h3>
          <p className="text-xs sm:text-sm text-article-excerpt line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
        
        {/* Thumbnail - larger on mobile for touch */}
        {article.imageUrl && (
          <div className="flex-shrink-0 w-16 h-16 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-muted">
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* Star button - always visible on mobile */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStarred();
          }}
          className={cn(
            "p-2 -mr-1 rounded-lg transition-all touch-manipulation",
            "sm:opacity-0 sm:group-hover:opacity-100",
            isStarred && "opacity-100"
          )}
        >
          <Star
            className={cn(
              "h-5 w-5 sm:h-4 sm:w-4",
              isStarred
                ? "fill-primary text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          />
        </button>
      </div>
    </article>
  );
}
