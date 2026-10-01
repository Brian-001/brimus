"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabsProps {
  tabs: { label: string; content: React.ReactNode }[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [active, setActive] = React.useState(
    defaultTab || tabs[0]?.label,
  );

  return (
    <div className={cn("w-full", className)}>
      <div className="border-b border-border mb-6">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActive(tab.label)}
              className={cn(
                "relative px-4 py-2.5 text-sm font-medium transition-colors rounded-t-lg",
                active === tab.label
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              {active === tab.label && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="animate-in fade-in duration-200">
        {tabs.find((t) => t.label === active)?.content}
      </div>
    </div>
  );
}
