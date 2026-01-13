"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun03Icon, Moon02Icon } from "@hugeicons/core-free-icons";

function toggleThemeClass() {
  const root = document.documentElement;
  const isCurrentlyLight = root.classList.contains("light");
  const newTheme = isCurrentlyLight ? "dark" : "light";

  root.classList.remove("light", "dark");
  root.classList.add(newTheme);
  localStorage.setItem("theme", newTheme);
}

export function ThemeToggle() {
  const handleClick = useCallback(() => {
    toggleThemeClass();
  }, []);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      aria-label="Toggle theme"
    >
      {/* Dark mode: show sun (to switch to light) */}
      <span className="theme-icon-sun">
        <HugeiconsIcon icon={Sun03Icon} size={20} />
      </span>
      {/* Light mode: show moon (to switch to dark) */}
      <span className="theme-icon-moon">
        <HugeiconsIcon icon={Moon02Icon} size={20} />
      </span>
    </Button>
  );
}
