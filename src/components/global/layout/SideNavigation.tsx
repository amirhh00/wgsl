"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import tags from "@/components/global/layout/navLink";

export default function SideNavigation() {
  const pathname = usePathname();
  const activeIndex = tags.findIndex((tag) => tag.link === pathname);
  const totalTime = tags.reduce((acc, tag) => acc + tag.time, 0);
  const timeRemaining = totalTime - tags.slice(0, activeIndex + 1).reduce((acc, tag) => acc + tag.time, 0);

  return (
    <aside className="fixed flex flex-col h-screen transition-all top-10 z-20 w-[var(--side-nav-width)] overflow-x-hidden pb-8">
      {timeRemaining > 0 && (
        <div className="flex items-center py-3 justify-center gap-3 white">
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
            <path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
          </svg>
          <p className="text-center flex-shrink-0 flex items-center justify-center">{timeRemaining} minutes remaining</p>
        </div>
      )}
      <ScrollArea className="h-full w-full">
        <nav className="p-4 pt-0">
          {tags.map((tag, index) => {
            const isActive = tag.link === pathname;
            return (
              <a
                key={tag.link}
                href={tag.link}
                className={cn(
                  "whitespace-nowrap flex p-4 rounded border mb-3 hover:bg-white/15 transition-colors",
                  activeIndex !== -1 && index < activeIndex + 1 && "bg-white/10 text-primary" && "bg-white/10",
                  isActive && "font-bold"
                )}
              >
                <Badge className={cn("mr-2 aspect-square scale-90 transition-colors", activeIndex !== -1 && index >= activeIndex + 1 && "bg-white/10 text-primary")}>
                  {index + 1}
                </Badge>
                {tag.name}
              </a>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
