import type { ApiEnvelope } from "../types/auth.types";

export function unwrap<T>(
  json: ApiEnvelope<T> | null
): { message?: string; data?: T } {
  if (!json || !json.data) {
    return {};
  }

  return {
    message: json.data.message,
    data: json.data.data,
  };
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  // Ajusta la key si usas otra
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken")
  );
}
