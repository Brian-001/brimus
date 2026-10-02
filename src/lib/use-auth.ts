"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  authStore,
  clearStoredToken,
  emptySubscribe,
  setStoredToken,
} from "@/lib/auth-store";

/**
 * Session token state backed by localStorage via useSyncExternalStore, so it
 * stays consistent with SSR/hydration. `ready` is false during SSR and the
 * first hydration render, then flips to true — callers should wait for it
 * before deciding whether the visitor is signed in.
 */
export function useAuth() {
  const router = useRouter();
  const token = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getServerSnapshot,
  );
  const ready = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const setToken = useCallback((next: string) => setStoredToken(next), []);
  const clearToken = useCallback(() => clearStoredToken(), []);
  const logout = useCallback(() => {
    clearStoredToken();
    router.replace("/login");
  }, [router]);

  return { token, ready, setToken, clearToken, logout };
}
