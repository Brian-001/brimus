"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuth } from "@/lib/use-auth";
import { convex } from "@/lib/convex";
import { hashPassword } from "@/lib/crypto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { ROLE_LABELS } from "@convex/roles";
import { CalendarDays, KeyRound, Mail, Save } from "lucide-react";

export default function ProfilePage() {
  const { token, ready } = useAuth();
  const authed = ready && token ? { token } : "skip";
  const me = useQuery(api.users.me, authed);
  const updateMutation = useMutation(api.users.update);

  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSaved, setNameSaved] = useState(false);
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSaved, setPwSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!me) {
    return <p className="text-sm text-muted-foreground">Loading profile…</p>;
  }

  const name = nameDraft ?? me.name;
  const nameChanged = name.trim() !== me.name;
  const initials = me.name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const onSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);
    setNameSaved(false);
    if (name.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return;
    }
    setSavingName(true);
    try {
      await updateMutation({ token: token!, id: me._id, name: name.trim() });
      setNameDraft(null);
      setNameSaved(true);
    } catch (err) {
      setNameError(
        err instanceof Error && err.message ? err.message : "Failed to update profile",
      );
    }
    setSavingName(false);
  };

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSaved(false);
    if (!currentPassword) return setPwError("Enter your current password");
    if (newPassword.length < 8) return setPwError("New password must be at least 8 characters");
    if (newPassword !== confirmPassword) return setPwError("Passwords do not match");
    if (newPassword === currentPassword) {
      return setPwError("New password must be different from the current one");
    }

    setBusy(true);
    try {
      // Hash both with the stored salt so the server can verify/comparison-check.
      const { passwordSalt } = await convex.query(api.users.getSalt, {
        email: me.email,
      });
      const currentPasswordHash = await hashPassword(currentPassword, passwordSalt);
      const passwordHash = await hashPassword(newPassword, passwordSalt);
      await updateMutation({
        token: token!,
        id: me._id,
        currentPasswordHash,
        passwordHash,
        passwordSalt,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPwSaved(true);
    } catch (err) {
      setPwError(
        err instanceof Error && err.message ? err.message : "Failed to update password",
      );
    }
    setBusy(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your account details, display name and password.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">{me.name}</p>
              <span className="mt-1 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium uppercase text-primary ring-1 ring-border">
                {ROLE_LABELS[me.role] ?? me.role}
              </span>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-background p-3">
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                <Mail className="h-3.5 w-3.5" /> Email
              </dt>
              <dd className="mt-1 truncate text-sm text-foreground">{me.email}</dd>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" /> Member since
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {new Date(me.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}
              </dd>
            </div>
          </dl>

          <form onSubmit={onSaveName} className="space-y-3" noValidate>
            <Input
              label="Display name"
              placeholder="Your name"
              value={name}
              onChange={(e) => {
                setNameDraft(e.target.value);
                setNameSaved(false);
                setNameError(null);
              }}
            />
            {nameError && (
              <p className="rounded-lg border border-red-300/40 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-300">
                {nameError}
              </p>
            )}
            {nameSaved && !nameError && (
              <p className="rounded-lg border border-green-300/40 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-950/50 dark:text-green-300">
                Profile updated.
              </p>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={!nameChanged || savingName}
              className="sm:w-auto"
            >
              <Save className="h-4 w-4" /> Save changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onChangePassword} className="space-y-4" noValidate>
            <Input
              label="Current Password"
              type="password"
              placeholder="Your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Input
              label="New Password"
              type="password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Repeat the new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />

            {pwError && (
              <p className="rounded-lg border border-red-300/40 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-300">
                {pwError}
              </p>
            )}
            {pwSaved && !pwError && (
              <p className="rounded-lg border border-green-300/40 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-950/50 dark:text-green-300">
                Password updated.
              </p>
            )}

            <SubmitButton loading={busy} loadingText="Updating…">
              <KeyRound className="h-4 w-4" /> Update password
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
