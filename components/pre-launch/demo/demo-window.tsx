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
    <div className="w-2xl border-l border-y border-border rounded-l-lg overflow-hidden font-mono text-sm">
      {/* Window header with macOS dots */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-foreground/5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="text-xs opacity-50 ml-2">
          <span className="opacity-25">https://</span>nextup.build – analysis
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs border-r border-border transition-colors ${
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
      <div className="p-4 min-h-48 bg-foreground/2">
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
