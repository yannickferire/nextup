function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function PreLaunchFooter() {
  return (
    <footer className="px-4 sm:px-8 py-3 sm:py-4 border-t border-border flex items-center justify-end">
      <a
        href="https://x.com/nextupbuild"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-xs opacity-60 md:opacity-30 hover:opacity-70 transition-opacity"
      >
        <XIcon className="w-4 h-4" />
        <span className="-mt-0.75">@nextupbuild</span>
      </a>
    </footer>
  );
}
