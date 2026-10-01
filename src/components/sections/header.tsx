"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X, ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { NAV_LINKS } from "@/lib/constants";
import { Sheet, SheetHeader, SheetClose } from "@/components/ui/sheet";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const toggleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-2 text-cyan-50 transition-colors hover:bg-white/15 hover:text-white"
      aria-label="Toggle theme"
    >
      {mounted && theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </button>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
        <div className="nav-cyan mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl px-4 shadow-2xl shadow-cyan-950/25 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex h-16 shrink-0 items-center gap-3">
            <Logo className="logo-monochrome shrink-0" />
            <span className="whitespace-nowrap text-sm font-bold uppercase tracking-[0.14em] text-white drop-shadow-sm">
              Brimus
              <span className="hidden text-cyan-200 sm:inline"> Consultancy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-white/15 text-white shadow-inner"
                    : "text-cyan-50/85 hover:bg-white/10 hover:text-white",
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-cyan-300" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/contact" className="hidden md:block">
              <Button
                size="sm"
                variant="light"
                className="rounded-full bg-white px-5"
              >
                Consult Us <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              className="text-cyan-50 hover:bg-white/15 hover:text-white md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <div className="fixed left-0 top-0 h-full w-72 border-r border-border bg-white shadow-xl dark:bg-cyan-950">
          <SheetHeader>
            <SheetClose asChild>
              <button
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </SheetClose>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-4 pt-12">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-50/10 dark:text-cyan-300"
                    : "text-slate-600 hover:bg-cyan-50/60 hover:text-cyan-700 dark:text-slate-300 dark:hover:bg-cyan-50/10 dark:hover:text-cyan-200",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-600/25 transition-colors hover:from-cyan-700 hover:to-cyan-600"
            >
              Request Consultation <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </Sheet>
    </>
  );
}