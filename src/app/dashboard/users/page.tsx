"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useAuth } from "@/lib/use-auth";
import { hashPassword, randomSaltHex } from "@/lib/crypto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, type DataTableColumn } from "@/components/dashboard/data-table";
import {
  RoleBadge,
  UserStatusBadge,
  initialsOf,
} from "@/components/dashboard/status-badge";
import { UsersSkeleton } from "@/components/dashboard/skeletons";
import {
  ROLE_LABELS,
  SELECTABLE_ROLES,
  canManageUsers,
  type Role,
} from "@convex/roles";
import { Eye, MoreHorizontal, Plus, Search, Trash2, UserPlus } from "lucide-react";

export default function UsersPage() {
  const router = useRouter();
  const { token, ready } = useAuth();
  const authed = ready && token ? { token } : "skip";

  const me = useQuery(api.users.me, authed);
  const users = useQuery(api.users.list, authed);
  const createMutation = useMutation(api.users.create);
  const removeMutation = useMutation(api.users.remove);

  const [q, setQ] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: Id<"users">;
    name: string;
  } | null>(null);

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
  const needle = q.trim().toLowerCase();
  const filtered = needle
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(needle) ||
          u.email.toLowerCase().includes(needle),
      )
    : users;

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (name.trim().length < 2)
      return setFormError("Name must be at least 2 characters");
    if (!email.trim()) return setFormError("Email is required");
    if (password.length < 8)
      return setFormError("Password must be at least 8 characters");
    if (password !== confirmPassword)
      return setFormError("Passwords do not match");

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
      setShowCreate(false);
    } catch (err) {
      setFormError(
        err instanceof Error && err.message
          ? err.message
          : "Failed to create user",
      );
    }
    setBusy(false);
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeMutation({ token: token!, id: deleteTarget.id });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete user");
    }
    setDeleteTarget(null);
  };

  const columns: DataTableColumn<(typeof users)[number]>[] = [
    {
      key: "name",
      header: "User",
      sortValue: (u) => u.name.toLowerCase(),
      cell: (u) => (
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {initialsOf(u.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {u.name}
              {u._id === me._id && (
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  (you)
                </span>
              )}
            </p>
            <p className="truncate text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortValue: (u) => u.role,
      cell: (u) => <RoleBadge role={u.role} />,
    },
    {
      key: "status",
      header: "Status",
      sortValue: (u) => (u.mustChangePassword ? "pending" : "active"),
      cell: (u) => <UserStatusBadge pending={!!u.mustChangePassword} />,
    },
    {
      key: "joined",
      header: "Joined",
      sortValue: (u) => u.createdAt,
      headClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
      cell: (u) => (
        <span className="text-sm text-muted-foreground">
          {new Date(u.createdAt).toLocaleDateString(undefined, {
            dateStyle: "medium",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dashboard accounts. Only founders and co-founders can add users and
            assign roles.
          </p>
        </div>
        {canManage && (
          <Button size="sm" onClick={() => setShowCreate(true)} data-testid="create-user">
            <UserPlus className="h-4 w-4" /> Add User
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search users…"
            aria-label="Search users"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            data-testid="search-input"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {filtered.length} of {users.length} {users.length === 1 ? "user" : "users"}
        </span>
      </div>

      <DataTable
        label="Users"
        columns={columns}
        rows={filtered}
        getRowId={(u) => u._id}
        onRowClick={(u) => router.push(`/dashboard/users/${u._id}`)}
        empty={
          needle ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Search className="h-8 w-8 opacity-50" />
              <p className="text-sm">No users match “{q.trim()}”.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <UserPlus className="h-8 w-8 opacity-50" />
              <p className="text-sm">No users yet.</p>
            </div>
          )
        }
        rowActions={(u) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                aria-label={`Actions for ${u.name}`}
                data-testid="row-actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${u._id}`)}>
                <Eye /> View details
              </DropdownMenuItem>
              {canManage && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() =>
                      setDeleteTarget({ id: u._id, name: u.name })
                    }
                  >
                    <Trash2 /> Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add user</DialogTitle>
            <DialogDescription>
              Create a dashboard account. The new user must choose their own
              password at first sign-in.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onCreate} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="new-name"
              />
              <Input
                label="Email"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="new-email"
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
              <div className="hidden sm:block" />
              <Input
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                data-testid="new-password"
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat the password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                data-testid="new-confirm"
              />
            </div>

            {formError && (
              <p
                data-testid="form-error"
                className="rounded-lg border border-red-300/40 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-300"
              >
                {formError}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </Button>
              <SubmitButton loading={busy} loadingText="Creating…">
                <Plus className="h-4 w-4" /> Create Account
              </SubmitButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes their dashboard account. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
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
