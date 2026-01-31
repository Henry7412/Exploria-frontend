// ✅ src/app/features/chatbot/api/chat.helpers.ts
export function unwrap<T>(json: { message?: string; data?: unknown }) {
  // Caso 1: { data: { message, data } }
  if (json?.data && typeof json.data === "object" && json.data !== null) {
    const obj = json.data as Record<string, unknown>;
    if ("data" in obj) {
      const inner = obj as { message?: unknown; data?: unknown };
      return {
        message: typeof inner.message === "string" ? inner.message : undefined,
        data: inner.data as T,
      };
    }
  }

  // Caso 2: { message, data }
  return {
    message: typeof json?.message === "string" ? json.message : undefined,
    data: (json?.data as T) ?? (undefined as T),
  };
}

export function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
}

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "server";

  const key = "deviceId";
  let id = localStorage.getItem(key);

  if (!id || !id.trim()) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `dev_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    localStorage.setItem(key, id);
  }

  return id;
}
