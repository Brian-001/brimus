"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { useAuth } from "@/lib/use-auth";
import { ForcePasswordChange } from "@/components/dashboard/force-password-change";
import { ROLE_LABELS } from "@convex/roles";
import {
  BarChart3,
  FileText,
  Inbox,
  ExternalLink,
  LogOut,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: BarChart3, exact: true },
  { href: "/dashboard/inquires", label: "Inquiries", icon: Inbox, exact: false },
  { href: "/dashboard/insights", label: "Insights", icon: FileText, exact: false },
  { href: "/dashboard/users", label: "Users", icon: Users, exact: true },
  { href: "/dashboard/profile", label: "Profile", icon: User, exact: true },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      title="Toggle theme"
      data-testid="theme-toggle"
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "h-9 w-9 text-muted-foreground",
      )}
    >
      {mounted && resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, ready, logout, clearToken } = useAuth();
  const me = useQuery(api.users.me, ready && token ? { token } : "skip");
  const logoutMutation = useMutation(api.users.logout);
  const [signingOut, setSigningOut] = useState(false);
  const [navLoading, setNavLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navStartedAt = useRef(0);
  const mainRef = useRef<HTMLElement>(null);

  const authorized = ready && !!token && me !== undefined && me !== null;
  const denied = ready && (!token || me === null);

  useEffect(() => {
    if (denied && !signingOut) router.replace("/login");
  }, [denied, router, signingOut]);

  // Horizontal top loader: shown from sidebar click until the route lands
  // (with a short minimum hold so it never flickers on instant navigations).
  const beginNav = () => {
    navStartedAt.current = Date.now();
    setNavLoading(true);
  };

  useEffect(() => {
    if (!navLoading) return;
    const hideAt = Math.max(navStartedAt.current + 550, Date.now() + 350);
    const timer = setTimeout(
      () => setNavLoading(false),
      Math.max(0, hideAt - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [navLoading, pathname]);

  // The content column has its own scrollbar — reset it on navigation.
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  const onSignOut = async () => {
    setSigningOut(true);
    try {
      if (token) await logoutMutation({ token });
    } catch {
      // Session may already be invalid — clear locally regardless.
    }
    clearToken();
    logout();
  };

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Checking access…</p>
      </main>
    );
  }

  if (me!.mustChangePassword) {
    return (
      <ForcePasswordChange
        token={token!}
        user={me!}
        onSignOut={onSignOut}
      />
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Horizontal navigation progress bar — spans the viewport above everything */}
      <div
        data-testid="nav-progress-bar"
        aria-hidden={!navLoading}
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-50 h-1 overflow-hidden transition-opacity duration-200",
          navLoading ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="h-full w-full bg-primary/15" />
        <div className="animate-progress-slide absolute inset-y-0 left-0 w-1/4 rounded-r-full bg-primary" />
      </div>

      {/* Desktop sidebar — fixed rail with its own scrollbar */}
      <aside className="hidden w-52 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold text-foreground">Brimus Admin</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          <NavLinks onNavigate={beginNav} />
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-4">
            {/* Mobile: hamburger + brand (desktop shows brand in the sidebar) */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground md:hidden"
                aria-label="Open menu"
                data-testid="mobile-menu-trigger"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold text-foreground">Brimus Admin</span>
              </Link>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              <Link
                href="/dashboard/profile"
                title="Your profile"
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
              >
                {me!.name}
                <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium uppercase text-primary ring-1 ring-border">
                  {ROLE_LABELS[me!.role] ?? me!.role}
                </span>
              </Link>
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-muted-foreground",
                )}
              >
                <ExternalLink className="h-4 w-4" />{" "}
                <span className="hidden sm:inline">View site</span>
              </Link>
              <button
                type="button"
                onClick={onSignOut}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-muted-foreground hover:text-red-600",
                )}
              >
                <LogOut className="h-4 w-4" />{" "}
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile navigation drawer — slides in from the left */}
        <Sheet
          open={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
          label="Dashboard navigation"
          className="inset-y-0 left-0 w-72 animate-drawer-in border-r border-border bg-card shadow-xl"
        >
          <div className="flex h-full flex-col" data-testid="nav-drawer">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold text-foreground">
                  Brimus Admin
                </span>
              </Link>
              <SheetClose
                aria-label="Close menu"
                className="static text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </SheetClose>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              <NavLinks
                onNavigate={() => {
                  beginNav();
                  setMobileMenuOpen(false);
                }}
              />
            </nav>
          </div>
        </Sheet>

        {/* Page content — scrolls independently of the sidebar */}
        <main ref={mainRef} className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
