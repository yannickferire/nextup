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
    <div className="relative w-full lg:w-xl xl:w-2xl lg:border-l lg:border-y lg:border-r-0 rounded-lg lg:rounded-l-lg lg:rounded-r-none overflow-hidden font-mono text-xs sm:text-sm" style={{ background: 'var(--editor-bg)', color: 'var(--editor-text)', borderColor: 'var(--editor-border)', borderWidth: '1px', borderStyle: 'solid' }}>
      {/* Window header with macOS dots */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3" style={{ borderBottom: '1px solid var(--editor-border)', background: 'var(--editor-header-bg)' }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="text-[10px] sm:text-xs opacity-50 ml-2 truncate">
          <span className="opacity-25">https://</span>nextup.build – analysis
        </p>
      </div>

      {/* Suggestion area - mobile/tablet only (before tabs) */}
      <div className="lg:hidden">
        <DemoSuggestion
          onApply={handleApply}
          enhanced={enhanced}
          isLoading={isLoading}
        />
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid var(--editor-border)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2.5 sm:px-4 py-2 text-[10px] sm:text-xs transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? ""
                : "opacity-50 hover:opacity-75"
            } ${tab.id === "results" ? "text-emerald-500" : ""}`}
            style={{ borderRight: '1px solid var(--editor-border)', background: activeTab === tab.id ? 'var(--editor-header-bg)' : 'transparent' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="p-3 sm:p-4 min-h-48 overflow-x-auto" style={{ background: 'var(--editor-content-bg)' }}>
        <DemoContent activeTab={activeTab} />
      </div>

      {/* Suggestion area - desktop only (after content) */}
      <div className="hidden lg:block">
        <DemoSuggestion
          onApply={handleApply}
          enhanced={enhanced}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
