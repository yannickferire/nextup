"use client";

import { useState } from "react";
import { DemoContent, type TabId } from "./demo-content";
import { DemoSuggestion } from "./demo-suggestion";

interface DemoWindowProps {
  onApply: () => void;
  enhanced: boolean;
}

const baseTabs = [
  { id: "context" as const, label: "context.md" },
  { id: "analytics" as const, label: "analytics.json" },
  { id: "feedback" as const, label: "feedback.txt" },
];

const resultsTab = { id: "results" as const, label: "results.md" };

export function DemoWindow({ onApply, enhanced }: DemoWindowProps) {
  const [activeTab, setActiveTab] = useState<TabId>("context");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const tabs = showResults ? [...baseTabs, resultsTab] : baseTabs;

  const handleApply = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowResults(true);
    setActiveTab("results");
    onApply();
  };

  return (
    <div className="relative w-full lg:w-2xl border border-border lg:border-l lg:border-y lg:border-r-0 rounded-lg lg:rounded-l-lg lg:rounded-r-none overflow-hidden font-mono text-xs sm:text-sm bg-background">
      {/* Window header with macOS dots */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border bg-foreground/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="text-[10px] sm:text-xs opacity-50 ml-2 truncate">
          <span className="opacity-25 hidden sm:inline">https://</span>nextup.build<span className="hidden sm:inline"> – analysis</span>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2.5 sm:px-4 py-2 text-[10px] sm:text-xs border-r border-border transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-foreground/10"
                : "opacity-50 hover:opacity-75"
            } ${tab.id === "results" ? "text-emerald-300/80" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="p-3 sm:p-4 min-h-48 bg-foreground/2 overflow-x-auto">
        <DemoContent activeTab={activeTab} />
      </div>

      {/* Suggestion area */}
      <DemoSuggestion
        onApply={handleApply}
        enhanced={enhanced}
        isLoading={isLoading}
      />
    </div>
  );
}
