"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useAuth } from "@/lib/use-auth";
import { hashPassword, randomSaltHex } from "@/lib/crypto";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  RoleBadge,
  UserStatusBadge,
  initialsOf,
} from "@/components/dashboard/status-badge";
import { UserDetailSkeleton } from "@/components/dashboard/skeletons";
import { ROLE_LABELS, SELECTABLE_ROLES, canManageUsers, type Role } from "@convex/roles";
import { ArrowLeft, KeyRound, ShieldAlert, Trash2 } from "lucide-react";

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { token, ready } = useAuth();
  const authed = ready && token ? { token } : "skip";
  const me = useQuery(api.users.me, authed);
  const user = useQuery(
    api.users.getById,
    ready && token ? { token, id: id as Id<"users"> } : "skip",
  );
  const updateMutation = useMutation(api.users.update);
  const removeMutation = useMutation(api.users.remove);

  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [roleDraft, setRoleDraft] = useState<Role | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [showReset, setShowReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!me || user === undefined) {
    return <UserDetailSkeleton />;
  }

  if (user === null) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <ShieldAlert className="h-10 w-10 text-muted-foreground opacity-50" />
        <div>
          <h1 className="text-xl font-bold text-foreground">User not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This account may have been deleted.
          </p>
        </div>
        <Link
          href="/dashboard/users"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ArrowLeft className="h-4 w-4" /> Back to users
        </Link>
      </div>
    );
  }

  const canManage = canManageUsers(me.role);
  const isSelf = user._id === me._id;
  const canEditName = canManage || isSelf;
  const canEditRole = canManage;

  const name = nameDraft ?? user.name;
  const role = roleDraft ?? user.role;
  const nameChanged = name.trim() !== user.name;
  const roleChanged = role !== user.role;
  const dirty = nameChanged || roleChanged;

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveMsg(null);
    if (name.trim().length < 2) {
      setSaveError("Name must be at least 2 characters");
      return;
    }
    setSaving(true);
    try {
      await updateMutation({
        token: token!,
        id: user._id,
        ...(nameChanged ? { name: name.trim() } : {}),
        ...(roleChanged && canEditRole ? { role } : {}),
      });
      setNameDraft(null);
      setRoleDraft(null);
      setSaveMsg("Profile updated.");
    } catch (err) {
      setSaveError(
        err instanceof Error && err.message ? err.message : "Failed to update profile",
      );
    }
    setSaving(false);
  };

  const onResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    if (newPassword.length < 8) {
      setResetError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }
    setResetBusy(true);
    try {
      const salt = randomSaltHex();
      const passwordHash = await hashPassword(newPassword, salt);
      await updateMutation({
        token: token!,
        id: user._id,
        passwordHash,
        passwordSalt: salt,
      });
      setNewPassword("");
      setConfirmPassword("");
      setResetDone(true);
    } catch (err) {
      setResetError(
        err instanceof Error && err.message ? err.message : "Failed to reset password",
      );
    }
    setResetBusy(false);
  };

  const onDelete = async () => {
    setDeleteError(null);
    try {
      await removeMutation({ token: token!, id: user._id });
      if (isSelf) {
        // Shell sees me === null and redirects to /login.
        return;
      }
      router.push("/dashboard/users");
    } catch (err) {
      setDeleteError(
        err instanceof Error && err.message ? err.message : "Failed to delete user",
      );
      setShowDelete(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/users"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to users
      </Link>

      <div className="flex flex-wrap items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
          {initialsOf(user.name)}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            {isSelf && (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-border">
                you
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <RoleBadge role={user.role} />
            <UserStatusBadge pending={!!user.mustChangePassword} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSave} className="space-y-4" noValidate>
                <Input
                  label="Display name"
                  placeholder="Full name"
                  value={name}
                  disabled={!canEditName}
                  onChange={(e) => {
                    setNameDraft(e.target.value);
                    setSaveMsg(null);
                    setSaveError(null);
                  }}
                  data-testid="detail-name"
                />

                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Role
                  </label>
                  {canEditRole ? (
                    <Select
                      value={role}
                      onValueChange={(v) => {
                        setRoleDraft(v as Role);
                        setSaveMsg(null);
                        setSaveError(null);
                      }}
                    >
                      <SelectTrigger className="h-10" data-testid="detail-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SELECTABLE_ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex h-10 items-center">
                      <RoleBadge role={user.role} />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {canEditName || canEditRole ? (
                    <SubmitButton
                      loading={saving}
                      loadingText="Saving…"
                      disabled={!dirty}
                      data-testid="save-profile"
                    >
                      Save changes
                    </SubmitButton>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Only founders and co-founders can edit this profile.
                    </p>
                  )}
                  {saveError && (
                    <p
                      data-testid="save-error"
                      className="text-sm text-destructive"
                    >
                      {saveError}
                    </p>
                  )}
                  {saveMsg && !saveError && (
                    <p
                      data-testid="save-msg"
                      className="text-sm text-emerald-600"
                    >
                      {saveMsg}
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isSelf ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Change your own password from the Profile page.
                  </p>
                  <Link
                    href="/dashboard/profile"
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    Go to Profile
                  </Link>
                </div>
              ) : canManage ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Send a new initial password. The user must choose their own
                    password at next sign-in.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setResetDone(false);
                      setResetError(null);
                      setShowReset(true);
                    }}
                    data-testid="reset-password"
                  >
                    <KeyRound className="h-4 w-4" /> Reset password
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No actions available for this account.
                </p>
              )}
            </CardContent>
          </Card>

          {canManage && (
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-lg text-destructive">
                  Danger zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Permanently delete this dashboard account.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setDeleteError(null);
                    setShowDelete(true);
                  }}
                  data-testid="delete-user"
                >
                  <Trash2 className="h-4 w-4" /> Delete account
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog
        open={showReset}
        onOpenChange={(open) => {
          setShowReset(open);
          if (!open) {
            setResetDone(false);
            setResetError(null);
            setNewPassword("");
            setConfirmPassword("");
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>
              Set a temporary password for {user.name}.
            </DialogDescription>
          </DialogHeader>
          {resetDone ? (
            <div className="space-y-4">
              <p
                data-testid="reset-done"
                className="rounded-lg border border-green-300/40 bg-green-50 px-3 py-2.5 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-950/50 dark:text-green-300"
              >
                Password updated. {user.name.split(" ")[0]} must choose a new
                password at their next sign-in.
              </p>
              <div className="flex justify-end">
                <Button size="sm" onClick={() => setShowReset(false)}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={onResetPassword} className="space-y-4" noValidate>
              <Input
                label="New password"
                type="password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                data-testid="reset-password-field"
              />
              <Input
                label="Confirm password"
                type="password"
                placeholder="Repeat the password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-destructive">Passwords do not match</p>
              )}
              {resetError && (
                <p data-testid="reset-error" className="text-sm text-destructive">
                  {resetError}
                </p>
              )}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReset(false)}
                >
                  Cancel
                </Button>
                <SubmitButton
                  loading={resetBusy}
                  loadingText="Updating…"
                  disabled={!!confirmPassword && newPassword !== confirmPassword}
                >
                  Reset password
                </SubmitButton>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {user.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes their dashboard account
              {isSelf ? ", including your own" : ""}. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p className="text-sm text-destructive">{deleteError}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={onDelete}
              data-testid="confirm-delete"
            >
              Delete account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
