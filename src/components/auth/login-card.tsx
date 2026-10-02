"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { api } from "@convex/_generated/api";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { hashPassword, randomSaltHex } from "@/lib/crypto";
import { convex } from "@/lib/convex";
import { useAuth } from "@/lib/use-auth";

export function LoginCard() {
  const router = useRouter();
  const { token, ready, setToken } = useAuth();

  const count = useQuery(api.users.count);
  const me = useQuery(api.users.me, ready && token ? { token } : "skip");
  const setupMutation = useMutation(api.users.setup);
  const loginMutation = useMutation(api.users.login);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const setupMode = count === 0;

  // Already signed in → go to the dashboard.
  useEffect(() => {
    if (me) router.replace("/dashboard");
  }, [me, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (count === undefined) return;

    if (!email.trim()) return setError("Email is required");
    if (password.length < 8) return setError("Password must be at least 8 characters");

    setBusy(true);
    try {
      const normalizedEmail = email.trim();
      let salt: string;
      if (setupMode) {
        if (name.trim().length < 2) throw new Error("Name must be at least 2 characters");
        if (password !== confirm) throw new Error("Passwords do not match");
        salt = randomSaltHex();
      } else {
        // Login must hash with the salt stored on the account, fetched first.
        const res = await convex.query(api.users.getSalt, { email: normalizedEmail });
        salt = res.passwordSalt;
      }
      const passwordHash = await hashPassword(password, salt);

      let nextToken: string;
      if (setupMode) {
        const res = await setupMutation({
          name,
          email: normalizedEmail,
          passwordHash,
          passwordSalt: salt,
        });
        nextToken = res.token;
      } else {
        const res = await loginMutation({ email: normalizedEmail, passwordHash });
        nextToken = res.token;
      }

      setToken(nextToken);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Something went wrong");
      setBusy(false);
    }
  };

  const loading =
    !ready || count === undefined || (!!token && me === undefined);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-900 via-cyan-800 to-slate-900 px-4">
        <p className="text-sm text-cyan-100/80">Loading…</p>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-900 via-cyan-800 to-slate-900 px-4 py-12">
      <div className="bg-grid-cyan absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <p className="text-lg font-bold text-foreground">Brimus Admin</p>
            <p className="text-xs text-muted-foreground">
              {setupMode ? "First-time setup" : "Dashboard access"}
            </p>
          </div>
        </div>

        <h1 className="mb-1 text-2xl font-bold text-foreground">
          {setupMode ? "Create your admin account" : "Welcome back"}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {setupMode
            ? "No accounts exist yet. Set up the first administrator to continue."
            : "Sign in to manage insights, inquiries and users."}
        </p>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {setupMode && (
            <Input
              label="Full Name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          )}
          <Input
            label="Email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={setupMode ? "new-password" : "current-password"}
          />
          {setupMode && (
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat the password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          )}

          {error && (
            <p className="rounded-lg border border-red-300/40 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-300">
              {error}
            </p>
          )}

          <SubmitButton loading={busy} loadingText={setupMode ? "Creating account…" : "Signing in…"} className="w-full">
            {setupMode ? "Create Admin Account" : "Sign In"}
          </SubmitButton>
        </form>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to website
        </Link>
      </div>
    </main>
  );
}
