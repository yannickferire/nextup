import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { MagicWand01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

interface DemoSuggestionProps {
  onApply: () => void;
  enhanced: boolean;
  isLoading: boolean;
}

const containerStyle: React.CSSProperties = {
  borderBottom: 'var(--lg-border-bottom, 1px solid var(--editor-border))',
  borderTop: 'var(--lg-border-top, none)',
  background: 'var(--editor-header-bg)',
};

export function DemoSuggestion({
  onApply,
  enhanced,
  isLoading,
}: DemoSuggestionProps) {
  const buttonStyle: React.CSSProperties = {
    background: enhanced ? 'var(--editor-text)' : 'var(--editor-btn-bg)',
    color: enhanced ? 'var(--editor-bg)' : 'var(--editor-btn-text)',
    opacity: enhanced ? 0.3 : 1,
  };

  return (
    <div className="p-3 sm:p-4" style={containerStyle}>
      <div className="flex flex-col gap-2 sm:gap-3">
        <div>
          <p className="text-[10px] sm:text-xs opacity-50 mb-1">Nextup suggestion</p>
          {enhanced ? (
            <p className="text-xs sm:text-sm opacity-50">
              This is what Nextup does: analyze your data, suggest
              improvements, and help you ship faster. Then repeat.
            </p>
          ) : (
            <p className="text-xs sm:text-sm">
              Your landing lacks hierarchy and the CTA doesn&apos;t stand out
              enough. Add trust signals to boost conversions.
            </p>
          )}
        </div>

        <div className="mt-1">
          <Button
            onClick={onApply}
            disabled={enhanced || isLoading}
            className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base"
            style={buttonStyle}
          >
            {isLoading ? (
              <>
                <SpinnerIcon className="w-4.5 h-4.5 animate-spin" />
                <span className="hidden sm:inline">Apply suggestion</span>
                <span className="sm:hidden">Applying...</span>
              </>
            ) : enhanced ? (
              <>
                <HugeiconsIcon icon={Tick02Icon} size={18} />
                <span className="hidden sm:inline">Feature applied</span>
                <span className="sm:hidden">Applied</span>
              </>
            ) : (
              <>
                <HugeiconsIcon icon={MagicWand01Icon} size={18} />
                <span className="hidden sm:inline">Apply suggestion</span>
                <span className="sm:hidden">Apply</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
