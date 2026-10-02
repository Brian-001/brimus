"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X, ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { NAV_LINKS } from "@/lib/constants";
import { services } from "@/lib/data";
import { Sheet, SheetHeader, SheetClose } from "@/components/ui/sheet";
import { ServicesMenu } from "@/components/sections/services-menu";
import { useAuth } from "@/lib/use-auth";

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
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const { token, ready } = useAuth();
  const me = useQuery(api.users.me, ready && token ? { token } : "skip");
  const signedIn = !!me;
  const links = NAV_LINKS.filter((link) => link.href !== "/");
  const isActive = (href: string) =>
    href === "/about"
      ? pathname === "/about" ||
        (pathname.startsWith("/about/") && !pathname.startsWith("/about/team"))
      : href === "/about/team"
        ? pathname.startsWith("/about/team")
        : href === "/insights"
          ? pathname.startsWith("/insights")
          : pathname === href;

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
            {links.map((link) =>
              link.href === "/services" ? (
                <ServicesMenu
                  key={link.href}
                  active={pathname.startsWith("/services")}
                />
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-white/15 text-white shadow-inner"
                      : "text-cyan-50/85 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-cyan-300" />
                  )}
                </Link>
              ),
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href={signedIn ? "/dashboard" : "/login"}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-cyan-50/85 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ShieldCheck className="h-4 w-4" />
              {signedIn ? "Dashboard" : "Login"}
            </Link>
            <Link href="/contact" className="hidden lg:block">
              <Button
                size="sm"
                variant="light"
                className="rounded-full bg-white px-5"
              >
                Talk to an Advisor <ArrowRight className="h-4 w-4" />
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
        <div className="fixed left-0 top-0 h-full w-72 overflow-y-auto border-r border-border bg-white shadow-xl dark:bg-cyan-950">
          <SheetHeader>
            <SheetClose
              aria-label="Close menu"
              autoFocus
              className="absolute right-4 top-4"
            >
              <X className="h-5 w-5" />
            </SheetClose>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-4 pt-12">
            {links.map((link) => {
              if (link.href === "/services") {
                const active = pathname.startsWith("/services");
                return (
                  <div key={link.href}>
                    <button
                      type="button"
                      onClick={() => setServicesOpen((open) => !open)}
                      aria-expanded={servicesOpen}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-50/10 dark:text-cyan-300"
                          : "text-slate-600 hover:bg-cyan-50/60 hover:text-cyan-700 dark:text-slate-300 dark:hover:bg-cyan-50/10 dark:hover:text-cyan-200",
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          servicesOpen && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {servicesOpen && (
                      <div className="ml-4 mt-1 space-y-3 border-l border-border py-1 pl-4">
                        {services.map((service) => (
                          <div key={service.id}>
                            <Link
                              href={`/services#${service.id}`}
                              onClick={() => setMobileOpen(false)}
                              className="block text-sm font-semibold text-foreground transition-colors hover:text-primary dark:text-white"
                            >
                              {service.title}
                            </Link>
                            <ul className="mt-1 space-y-1">
                              {service.items?.map((item) => (
                                <li key={item}>
                                  <Link
                                    href={`/services#${service.id}`}
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-xs text-muted-foreground transition-colors hover:text-foreground dark:text-slate-400"
                                  >
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-50/10 dark:text-cyan-300"
                      : "text-slate-600 hover:bg-cyan-50/60 hover:text-cyan-700 dark:text-slate-300 dark:hover:bg-cyan-50/10 dark:hover:text-cyan-200",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-600/25 transition-colors hover:from-cyan-700 hover:to-cyan-600"
            >
              Talk to an Advisor <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </Sheet>
    </>
  );
}