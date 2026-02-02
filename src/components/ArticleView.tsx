import { Article } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow, format } from "date-fns";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  BookOpen,
  Share2,
} from "lucide-react";

interface ArticleViewProps {
  article: Article | null;
  onClose: () => void;
  isStarred: boolean;
  onToggleStarred: () => void;
}

export function ArticleView({
  article,
  onClose,
  isStarred,
  onToggleStarred,
}: ArticleViewProps) {
  const handleShare = async () => {
    if (article && navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          url: article.link,
        });
      } catch (e) {
        // User cancelled or error
      }
    }
  };

  if (!article) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground p-8">
          <BookOpen className="h-16 w-16 mx-auto mb-6 opacity-40" />
          <p className="text-xl font-medium mb-2">Select an article to read</p>
          <p className="text-sm">Choose from the list on the left</p>
        </div>
      </div>
    );
  }

  const formattedDate = format(article.pubDate, "MMMM d, yyyy 'at' h:mm a");
  const timeAgo = formatDistanceToNow(article.pubDate, { addSuffix: true });

  return (
    <div className="flex-1 flex flex-col bg-background animate-slide-in-right min-w-0">
      {/* Header */}
      <header className="flex items-center justify-between p-2 sm:p-3 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden h-10 w-10 flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm text-muted-foreground truncate">
            {article.feedTitle}
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleStarred}
            className="h-10 w-10 sm:h-9 sm:w-9"
          >
            <Star
              className={cn(
                "h-5 w-5 sm:h-4 sm:w-4",
                isStarred ? "fill-primary text-primary" : "text-muted-foreground"
              )}
            />
          </Button>
          {typeof navigator.share === 'function' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-10 w-10 sm:h-9 sm:w-9"
            >
              <Share2 className="h-5 w-5 sm:h-4 sm:w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-10 w-10 sm:h-9 sm:w-9"
          >
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new tab"
            >
              <ExternalLink className="h-5 w-5 sm:h-4 sm:w-4" />
            </a>
          </Button>
        </div>
      </header>

      {/* Content */}
      <ScrollArea className="flex-1">
        <article className="max-w-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-12 lg:py-10">
          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4 text-article-title">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-article-meta mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border">
            {article.author && (
              <>
                <span className="font-medium">{article.author}</span>
                <span className="hidden sm:inline">·</span>
              </>
            )}
            <time dateTime={article.pubDate.toISOString()} title={formattedDate} className="block sm:inline">
              {timeAgo}
            </time>
            <span className="hidden sm:inline">·</span>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View original
            </a>
          </div>

          {/* Body */}
          <div
            className="prose-reader"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.content) }}
          />
        </article>
      </ScrollArea>
    </div>
  );
}

// Basic HTML sanitization for article content
function sanitizeHTML(html: string): string {
  // Create a temporary element to parse HTML
  const doc = new DOMParser().parseFromString(html, "text/html");

  // Remove script tags
  doc.querySelectorAll("script").forEach((el) => el.remove());

  // Remove style tags
  doc.querySelectorAll("style").forEach((el) => el.remove());

  // Remove onclick and other event handlers
  doc.querySelectorAll("*").forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith("on")) {
        el.removeAttribute(attr.name);
      }
    });
  });

  // Make all links open in new tab
  doc.querySelectorAll("a").forEach((el) => {
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });

  // Make images responsive
  doc.querySelectorAll("img").forEach((el) => {
    el.style.maxWidth = "100%";
    el.style.height = "auto";
  });

  return doc.body.innerHTML;
}
