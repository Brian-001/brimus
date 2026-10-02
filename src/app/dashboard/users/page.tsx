"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useAuth } from "@/lib/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UsersSkeleton } from "@/components/dashboard/skeletons";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { hashPassword, randomSaltHex } from "@/lib/crypto";
import {
  ROLE_LABELS,
  SELECTABLE_ROLES,
  canManageUsers,
  type Role,
} from "@convex/roles";
import { KeyRound, Plus, Trash2, UserPlus, X } from "lucide-react";

export default function UsersPage() {
  const { token, ready } = useAuth();
  const authed = ready && token ? { token } : "skip";

  const me = useQuery(api.users.me, authed);
  const users = useQuery(api.users.list, authed);
  const createMutation = useMutation(api.users.create);
  const updateMutation = useMutation(api.users.update);
  const removeMutation = useMutation(api.users.remove);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("engineer");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!users || !me) {
    return <UsersSkeleton />;
  }

  const canManage = canManageUsers(me.role);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (name.trim().length < 2) return setFormError("Name must be at least 2 characters");
    if (!email.trim()) return setFormError("Email is required");
    if (password.length < 8) return setFormError("Password must be at least 8 characters");
    if (password !== confirmPassword) return setFormError("Passwords do not match");

    setBusy(true);
    try {
      const salt = randomSaltHex();
      const passwordHash = await hashPassword(password, salt);
      await createMutation({
        token: token!,
        name,
        email,
        role,
        passwordHash,
        passwordSalt: salt,
      });
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("engineer");
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error && err.message ? err.message : "Failed to create user");
    }
    setBusy(false);
  };

  const onRoleChange = async (id: Id<"users">, nextRole: Role) => {
    try {
      await updateMutation({ token: token!, id, role: nextRole });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const onResetPassword = async (id: Id<"users">) => {
    const next = prompt("Enter a new password (at least 8 characters):");
    if (next === null) return;
    if (next.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    try {
      const salt = randomSaltHex();
      const passwordHash = await hashPassword(next, salt);
      await updateMutation({ token: token!, id, passwordHash, passwordSalt: salt });
      alert("Password updated. That user must choose a new password at their next sign-in.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reset password");
    }
  };

  const onDelete = async (id: Id<"users">, label: string) => {
    if (!confirm(`Delete ${label}? This cannot be undone.`)) return;
    try {
      await removeMutation({ token: token!, id });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dashboard accounts. Only founders and co-founders can add users and
            assign roles.
          </p>
        </div>
        {canManage && (
          <Button size="sm" onClick={() => setShowForm((v) => !v)}>
            {showForm ? <X className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Add User"}
          </Button>
        )}
      </div>

      {showForm && canManage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onCreate} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Role
                  </label>
                  <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                    <SelectTrigger className="h-10">
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
                </div>
                <div />
                <Input
                  label="Password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat the password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                The new user must choose their own password at first sign-in.
              </p>

              {formError && (
                <p className="rounded-lg border border-red-300/40 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-300">
                  {formError}
                </p>
              )}

              <SubmitButton loading={busy} loadingText="Creating…">
                <Plus className="h-4 w-4" /> Create Account
              </SubmitButton>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {users.map((user) => (
          <Card key={user._id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {user.name}
                  {user._id === me._id && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      (you)
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.email} · joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {user.mustChangePassword && (
                  <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-500/30 dark:text-amber-400">
                    Password pending
                  </span>
                )}

                {canManage ? (
                  <Select
                    value={user.role}
                    onValueChange={(v) => onRoleChange(user._id, v as Role)}
                  >
                    <SelectTrigger className="h-8 w-40 text-xs">
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
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium uppercase text-primary ring-1 ring-border">
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                )}

                {canManage && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResetPassword(user._id)}
                      className="text-muted-foreground"
                    >
                      <KeyRound className="h-4 w-4" /> Reset password
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(user._id, user.name)}
                      className="text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
