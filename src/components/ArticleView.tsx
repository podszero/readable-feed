import { Article } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow, format } from "date-fns";
import {
  X,
  ExternalLink,
  Star,
  BookOpen,
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
  if (!article) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select an article to read</p>
          <p className="text-sm mt-1">Choose from the list on the left</p>
        </div>
      </div>
    );
  }

  const formattedDate = format(article.pubDate, "MMMM d, yyyy 'at' h:mm a");
  const timeAgo = formatDistanceToNow(article.pubDate, { addSuffix: true });

  return (
    <div className="flex-1 flex flex-col bg-background animate-slide-in-right">
      {/* Header */}
      <header className="flex items-center justify-between p-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground truncate max-w-[200px]">
            {article.feedTitle}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleStarred}
            className="h-8 w-8"
          >
            <Star
              className={cn(
                "h-4 w-4",
                isStarred ? "fill-primary text-primary" : "text-muted-foreground"
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8"
          >
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </header>

      {/* Content */}
      <ScrollArea className="flex-1">
        <article className="max-w-3xl mx-auto p-6 md:p-8 lg:p-12">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4 text-article-title">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-article-meta mb-8 pb-6 border-b border-border">
            {article.author && (
              <>
                <span className="font-medium">{article.author}</span>
                <span>·</span>
              </>
            )}
            <time dateTime={article.pubDate.toISOString()} title={formattedDate}>
              {timeAgo}
            </time>
            <span>·</span>
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
