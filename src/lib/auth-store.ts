const KEY = "brimus_admin_token";

let listeners: Array<() => void> = [];

function read(): string | null {
  return localStorage.getItem(KEY);
}

function emit() {
  for (const listener of listeners) listener();
}

/** External-store subscription for useSyncExternalStore. */
function subscribe(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

/** Stable no-op subscription for derived client-only flags. */
export function emptySubscribe(): () => void {
  return () => {};
}

export const authStore = {
  subscribe,
  getSnapshot: read,
  getServerSnapshot: (): string | null => null,
};

export function setStoredToken(token: string) {
  localStorage.setItem(KEY, token);
  emit();
}

export function clearStoredToken() {
  localStorage.removeItem(KEY);
  emit();
}
