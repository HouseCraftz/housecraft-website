export const ACCESS_PROGRESS_KEY = "housecraft-access-progress";
export const COMPLETED_HOME_KEY = "housecraft-completed-home";

// Best-effort persistence: storage restrictions must never break registration.
const memory = new Map<string, string | null>();
export const progressStorage = {
  getItem(key: string): string | null {
    if (memory.has(key)) return memory.get(key) ?? null;
    try {
      const value = window.localStorage.getItem(key);
      if (value !== null) return value;
    } catch {}
    try { return window.sessionStorage.getItem(key); } catch { return null; }
  },
  setItem(key: string, value: string) {
    memory.set(key, value);
    try { window.localStorage.setItem(key, value); } catch {}
    try { window.sessionStorage.setItem(key, value); } catch {}
  },
  removeItem(key: string) {
    memory.set(key, null);
    try { window.localStorage.removeItem(key); } catch {}
    try { window.sessionStorage.removeItem(key); } catch {}
  },
};
