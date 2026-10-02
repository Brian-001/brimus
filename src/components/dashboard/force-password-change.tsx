"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@/lib/convex";
import { hashPassword } from "@/lib/crypto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { KeyRound, LogOut, ShieldCheck } from "lucide-react";

type Me = {
  _id: Id<"users">;
  name: string;
  email: string;
};

/**
 * Blocking screen shown on first login with an issued password: the user must
 * choose a new password before any other dashboard action is allowed.
 */
export function ForcePasswordChange({
  token,
  user,
  onSignOut,
}: {
  token: string;
  user: Me;
  onSignOut: () => void;
}) {
  const updateMutation = useMutation(api.users.update);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setBusy(true);
    try {
      // Hash with the *stored* salt so the server can detect an unchanged password.
      const { passwordSalt } = await convex.query(api.users.getSalt, {
        email: user.email,
      });
      const passwordHash = await hashPassword(password, passwordSalt);
      await updateMutation({
        token,
        id: user._id,
        passwordHash,
        passwordSalt,
      });
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof Error && err.message ? err.message : "Failed to update password",
      );
    }
    setBusy(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-foreground">
            Set a new password
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome, {user.name}. For security you must choose your own password
            before continuing.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <Input
              label="New Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              autoFocus
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Repeat the new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />

            {error && (
              <p className="rounded-lg border border-red-300/40 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-300">
                {error}
              </p>
            )}

            <SubmitButton loading={busy} loadingText="Updating…">
              <KeyRound className="h-4 w-4" /> Update password
            </SubmitButton>
          </form>
        </div>

        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="text-muted-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    </main>
  );
}
