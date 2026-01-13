import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function PreLaunchHeader() {
  return (
    <header className="px-4 sm:px-8 py-3 sm:py-4 border-b border-border flex items-center justify-between">
      <Logo />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </header>
  );
}
