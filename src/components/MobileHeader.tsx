import { Button } from "@/components/ui/button";
import { Rss, Menu } from "lucide-react";

interface MobileHeaderProps {
  onOpenSidebar: () => void;
  title?: string;
}

export function MobileHeader({ onOpenSidebar, title = "RSS Reader" }: MobileHeaderProps) {
  return (
    <header className="flex md:hidden items-center gap-3 px-2 py-2 border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-20 safe-top">
      <Button
        variant="ghost"
        size="icon"
        onClick={onOpenSidebar}
        className="h-11 w-11 touch-manipulation"
      >
        <Menu className="h-6 w-6" />
      </Button>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Rss className="h-5 w-5 text-primary flex-shrink-0" />
        <h1 className="font-semibold text-lg truncate">{title}</h1>
      </div>
    </header>
  );
}
