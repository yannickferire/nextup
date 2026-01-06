export type TabId = "context" | "analytics" | "feedback" | "results";

interface DemoContentProps {
  activeTab: TabId;
}

type LineSegment = {
  text: string;
  color?: "orange" | "blue" | "green" | "purple" | "gray";
};

type Line = LineSegment[];

const TOTAL_LINES = 13;

// Helper to create a simple text line
const text = (str: string): Line => [{ text: str }];
const empty = (): Line => [{ text: " " }];

// Syntax-highlighted content
const content: Record<TabId, Line[]> = {
  context: [
    [
      { text: "# ", color: "gray" },
      { text: "Nextup Landing Page", color: "purple" },
    ],
    empty(),
    [
      { text: "## ", color: "gray" },
      { text: "Goal", color: "blue" },
    ],
    text("Convert visitors into waitlist signups"),
    empty(),
    [
      { text: "## ", color: "gray" },
      { text: "Target", color: "blue" },
    ],
    text("Indie hackers, startup founders,"),
    text("product managers seeking data-driven"),
    text("feature prioritization."),
    empty(),
    [
      { text: "## ", color: "gray" },
      { text: "Current state", color: "blue" },
    ],
    text("Minimal MVP landing page"),
    text("Monochrome design, basic CTA"),
  ],
  analytics: [
    [{ text: "{", color: "orange" }],
    [
      { text: '  "', color: "gray" },
      { text: "page_views", color: "blue" },
      { text: '": ', color: "gray" },
      { text: "1247", color: "orange" },
      { text: ",", color: "gray" },
    ],
    [
      { text: '  "', color: "gray" },
      { text: "unique_visitors", color: "blue" },
      { text: '": ', color: "gray" },
      { text: "892", color: "orange" },
      { text: ",", color: "gray" },
    ],
    [
      { text: '  "', color: "gray" },
      { text: "cta_clicks", color: "blue" },
      { text: '": ', color: "gray" },
      { text: "23", color: "orange" },
      { text: ",", color: "gray" },
    ],
    [
      { text: '  "', color: "gray" },
      { text: "ctr", color: "blue" },
      { text: '": "', color: "gray" },
      { text: "3.04%", color: "green" },
      { text: '",', color: "gray" },
    ],
    [
      { text: '  "', color: "gray" },
      { text: "scroll_depth_avg", color: "blue" },
      { text: '": "', color: "gray" },
      { text: "34%", color: "green" },
      { text: '",', color: "gray" },
    ],
    [
      { text: '  "', color: "gray" },
      { text: "bounce_rate", color: "blue" },
      { text: '": "', color: "gray" },
      { text: "78%", color: "green" },
      { text: '",', color: "gray" },
    ],
    [
      { text: '  "', color: "gray" },
      { text: "form_completions", color: "blue" },
      { text: '": ', color: "gray" },
      { text: "8", color: "orange" },
      { text: ",", color: "gray" },
    ],
    [
      { text: '  "', color: "gray" },
      { text: "conversion_rate", color: "blue" },
      { text: '": "', color: "gray" },
      { text: "0.89%", color: "green" },
      { text: '"', color: "gray" },
    ],
    [{ text: "}", color: "orange" }],
    empty(),
    empty(),
    empty(),
  ],
  feedback: [
    [
      { text: "User #127", color: "purple" },
      { text: " - 2 days ago", color: "gray" },
    ],
    [{ text: "─────────────────────────", color: "gray" }],
    text('"The tool sounds interesting but'),
    text("the page feels... empty? I wasn't"),
    text("sure if this was a real product"),
    text("or just a concept."),
    empty(),
    text("Maybe add some social proof or"),
    text("show what the output looks like?"),
    empty(),
    text('I almost signed up but hesitated."'),
    empty(),
    [
      { text: "→ ", color: "gray" },
      { text: "Trust score: ", color: "blue" },
      { text: "Low", color: "orange" },
    ],
  ],
  results: [
    [
      { text: "# ", color: "gray" },
      { text: "Applied changes", color: "green" },
    ],
    empty(),
    [
      { text: "✓ ", color: "green" },
      { text: "Early spots badge", color: "purple" },
      { text: " with live count", color: "gray" },
    ],
    [
      { text: "✓ ", color: "green" },
      { text: "Text opacity", color: "purple" },
      { text: " increased", color: "gray" },
    ],
    [
      { text: "✓ ", color: "green" },
      { text: "CTA", color: "purple" },
      { text: " bigger + gradient bg + icon", color: "gray" },
    ],
    [
      { text: "✓ ", color: "green" },
      { text: "Input placeholder", color: "purple" },
      { text: " simplified", color: "gray" },
    ],
    [
      { text: "✓ ", color: "green" },
      { text: "Glow effect", color: "purple" },
      { text: " for more depth", color: "gray" },
    ],
    [
      { text: "✓ ", color: "green" },
      { text: "Accent color", color: "purple" },
      { text: " on key message in title", color: "gray" },
    ],
    [
      { text: "✓ ", color: "green" },
      { text: "Trust element", color: "purple" },
      { text: " below CTA", color: "gray" },
    ],
    empty(),
    [
      { text: "## ", color: "gray" },
      { text: "Expected impact", color: "blue" },
    ],
    [
      { text: "Conversion: ", color: "gray" },
      { text: "0.89%", color: "orange" },
      { text: " → ", color: "gray" },
      { text: "~4%", color: "green" },
    ],
    [
      { text: "Trust score: ", color: "gray" },
      { text: "Low", color: "orange" },
      { text: " → ", color: "gray" },
      { text: "High", color: "green" },
    ],
  ],
};

const colorStyles: Record<string, React.CSSProperties> = {
  orange: { color: 'var(--syntax-orange)' },
  blue: { color: 'var(--syntax-blue)' },
  green: { color: 'var(--syntax-green)' },
  purple: { color: 'var(--syntax-purple)' },
  gray: { opacity: 0.4 },
};

export function DemoContent({ activeTab }: DemoContentProps) {
  const lines = content[activeTab];

  // Pad to TOTAL_LINES
  const paddedLines = [...lines];
  while (paddedLines.length < TOTAL_LINES) {
    paddedLines.push(empty());
  }

  return (
    <div className="flex">
      {/* Line numbers */}
      <div className="pr-4 select-none opacity-30 text-right">
        {paddedLines.map((_, i) => (
          <div key={i} className="leading-6">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        {paddedLines.map((line, i) => (
          <div key={i} className="leading-6 whitespace-pre">
            {line.map((segment, j) => (
              <span
                key={j}
                style={segment.color ? colorStyles[segment.color] : undefined}
              >
                {segment.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
