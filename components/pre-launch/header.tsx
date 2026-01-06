import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function PreLaunchHeader() {
  return (
    <header className="px-4 sm:px-8 py-3 sm:py-4 border-b border-border flex items-center justify-between">
      <Logo />
      <ThemeToggle />
    </header>
  );
}
