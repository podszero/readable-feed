import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, Rss } from "lucide-react";

interface MobileHeaderProps {
  onOpenSidebar: () => void;
  title?: string;
}

export function MobileHeader({ onOpenSidebar, title = "RSS Reader" }: MobileHeaderProps) {
  return (
    <header className="flex md:hidden items-center gap-3 p-3 border-b border-border bg-card">
      <Button
        variant="ghost"
        size="icon"
        onClick={onOpenSidebar}
        className="h-9 w-9"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-2">
        <Rss className="h-5 w-5 text-primary" />
        <h1 className="font-semibold">{title}</h1>
      </div>
    </header>
  );
}
