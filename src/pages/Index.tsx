import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRSSReader } from "@/hooks/useRSSReader";
import { FeedSidebar } from "@/components/FeedSidebar";
import { ArticleList } from "@/components/ArticleList";
import { ArticleView } from "@/components/ArticleView";
import { MobileHeader } from "@/components/MobileHeader";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showArticleList, setShowArticleList] = useState(true);

  const {
    feeds,
    articles,
    isLoading,
    loadingProgress,
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
    handleToggleStarred,
    handleMarkAllRead,
    readArticleIds,
    starredArticleIds,
    totalUnread,
    totalStarred,
  } = useRSSReader();

  // Handle article selection with mobile responsiveness
  const onArticleSelect = (article: typeof selectedArticle) => {
    if (article) {
      handleSelectArticle(article);
      // On mobile, hide article list when viewing article
      if (window.innerWidth < 768) {
        setShowArticleList(false);
      }
    }
  };

  // Handle closing article view on mobile
  const onCloseArticle = () => {
    setSelectedArticle(null);
    setShowArticleList(true);
  };

  // Handle feed selection from sidebar
  const handleFeedSelect = (feedId: string | null) => {
    setSelectedFeedId(feedId);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-background">
      {/* Mobile Header */}
      <MobileHeader onOpenSidebar={() => setMobileSidebarOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex h-full">
          <FeedSidebar
            feeds={feeds}
            selectedFeedId={selectedFeedId}
            onSelectFeed={handleFeedSelect}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalUnread={totalUnread}
            totalStarred={totalStarred}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            onRefresh={refreshFeeds}
            isLoading={isLoading}
          />
        </div>

        {/* Mobile Sidebar Sheet */}
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[280px] sm:w-80">
            <FeedSidebar
              feeds={feeds}
              selectedFeedId={selectedFeedId}
              onSelectFeed={handleFeedSelect}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalUnread={totalUnread}
              totalStarred={totalStarred}
              isCollapsed={false}
              onToggleCollapse={() => setMobileSidebarOpen(false)}
              onRefresh={refreshFeeds}
              isLoading={isLoading}
            />
          </SheetContent>
        </Sheet>

        {/* Article List - Hidden on mobile when viewing article */}
        <div
          className={cn(
            "flex-shrink-0 h-full",
            showArticleList ? "flex" : "hidden md:flex"
          )}
        >
          <ArticleList
            articles={articles}
            selectedArticle={selectedArticle}
            onSelectArticle={onArticleSelect}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onMarkAllRead={handleMarkAllRead}
            readArticleIds={readArticleIds}
            starredArticleIds={starredArticleIds}
            onToggleStarred={handleToggleStarred}
            isLoading={isLoading}
            loadingProgress={loadingProgress}
          />
        </div>

        {/* Article View - Full width on mobile when showing */}
        <div
          className={cn(
            "flex-1 min-w-0 h-full",
            !showArticleList ? "flex" : "hidden md:flex"
          )}
        >
          <ArticleView
            article={selectedArticle}
            onClose={onCloseArticle}
            isStarred={selectedArticle ? starredArticleIds.has(selectedArticle.id) : false}
            onToggleStarred={() => {
              if (selectedArticle) {
                handleToggleStarred(selectedArticle.id);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
