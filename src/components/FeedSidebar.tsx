import { Feed, ViewMode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Rss,
  Inbox,
  Star,
  ChevronLeft,
  RefreshCw,
  Home,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

interface FeedSidebarProps {
  feeds: Feed[];
  selectedFeedId: string | null;
  onSelectFeed: (feedId: string | null) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalUnread: number;
  totalStarred: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function FeedSidebar({
  feeds,
  selectedFeedId,
  onSelectFeed,
  viewMode,
  onViewModeChange,
  totalUnread,
  totalStarred,
  isCollapsed,
  onToggleCollapse,
  onRefresh,
  isLoading,
}: FeedSidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 h-full",
        isCollapsed ? "w-16" : "w-64 lg:w-72"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 lg:p-4 border-b border-sidebar-border min-h-[57px]">
        {!isCollapsed && (
          <h1 className="font-semibold text-sidebar-foreground flex items-center gap-2">
            <Rss className="h-5 w-5 text-primary" />
            <span className="text-base">RSS Reader</span>
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className={cn(
            "h-9 w-9 text-sidebar-foreground hover:bg-sidebar-accent flex-shrink-0",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Refresh Action */}
      <div className={cn(
        "p-2 lg:p-3 border-b border-sidebar-border",
        isCollapsed && "flex flex-col items-center"
      )}>
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "sm"}
          onClick={onRefresh}
          disabled={isLoading}
          className={cn(
            "text-sidebar-foreground hover:bg-sidebar-accent h-10 sm:h-9",
            !isCollapsed && "w-full justify-start"
          )}
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin", !isCollapsed && "mr-2")} />
          {!isCollapsed && "Refresh Feeds"}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {/* View Modes */}
        <div className="p-2 lg:p-3 space-y-1">
          <SidebarItem
            icon={Home}
            label="All Articles"
            count={feeds.reduce((acc, f) => acc + f.unreadCount, 0)}
            isActive={viewMode === "all" && !selectedFeedId}
            isCollapsed={isCollapsed}
            onClick={() => {
              onViewModeChange("all");
              onSelectFeed(null);
            }}
          />
          <SidebarItem
            icon={Inbox}
            label="Unread"
            count={totalUnread}
            isActive={viewMode === "unread" && !selectedFeedId}
            isCollapsed={isCollapsed}
            onClick={() => {
              onViewModeChange("unread");
              onSelectFeed(null);
            }}
          />
          <SidebarItem
            icon={Star}
            label="Starred"
            count={totalStarred}
            isActive={viewMode === "starred" && !selectedFeedId}
            isCollapsed={isCollapsed}
            onClick={() => {
              onViewModeChange("starred");
              onSelectFeed(null);
            }}
          />
        </div>

        {/* Feeds */}
        {!isCollapsed && (
          <div className="p-2 lg:p-3">
            <h3 className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Feeds ({feeds.length})
            </h3>
            <div className="space-y-0.5 mt-1">
              {feeds.map((feed) => (
                <button
                  key={feed.id}
                  onClick={() => {
                    onSelectFeed(feed.id);
                    onViewModeChange("all");
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors touch-manipulation",
                    "hover:bg-feed-hover active:bg-sidebar-accent",
                    selectedFeedId === feed.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground"
                  )}
                >
                  <span className="truncate pr-2">{feed.title}</span>
                  {feed.unreadCount > 0 && (
                    <span className="flex-shrink-0 min-w-[20px] px-1.5 py-0.5 text-xs font-medium rounded-full bg-primary text-primary-foreground text-center">
                      {feed.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}

interface SidebarItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count?: number;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

function SidebarItem({
  icon: Icon,
  label,
  count,
  isActive,
  isCollapsed,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 rounded-lg transition-colors touch-manipulation",
        isCollapsed ? "justify-center p-2.5" : "px-3 py-2.5",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground hover:bg-feed-hover active:bg-sidebar-accent"
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left text-sm">{label}</span>
          {count !== undefined && count > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
              {count}
            </span>
          )}
        </>
      )}
    </button>
  );
}
