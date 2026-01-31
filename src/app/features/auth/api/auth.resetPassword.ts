import type { ApiEnvelope, ResetPasswordPayload } from "../types/auth.types";
import { unwrap } from "./auth.helpers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function resetPasswordApi(payload: ResetPasswordPayload) {
  if (!API_URL) throw new Error("Falta NEXT_PUBLIC_API_URL");

  const res = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = (await res.json().catch(() => null)) as ApiEnvelope<{ ok: boolean }> | null;

  if (!res.ok) {
    const msg = json?.data?.message || "Token inválido o expirado.";
    throw new Error(msg);
  }

  return unwrap<{ ok: boolean }>(json);
}
