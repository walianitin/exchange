export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  try {
    const current = (globalThis as { localStorage?: Storage }).localStorage;
    if (typeof current?.getItem === "function") return;

    const store = new Map<string, string>();
    const polyfill: Storage = {
      get length() {
        return store.size;
      },
      clear() {
        store.clear();
      },
      getItem(key: string) {
        return store.has(key) ? (store.get(key) ?? null) : null;
      },
      key(index: number) {
        return [...store.keys()][index] ?? null;
      },
      removeItem(key: string) {
        store.delete(key);
      },
      setItem(key: string, value: string) {
        store.set(key, String(value));
      },
    };

    Object.defineProperty(globalThis, "localStorage", {
      value: polyfill,
      configurable: true,
      writable: true,
    });
  } catch {
    /* Node 25 experimental localStorage can be non-configurable during build */
  }
}
