import type { RegisterPayload, ApiEnvelope, RegisterUserResponse } from "../types/auth.types";
import { unwrap } from "./auth.helpers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerApi(payload: RegisterPayload) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL no está definido en .env.local");

  const res = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = (await res.json().catch(() => null)) as ApiEnvelope<RegisterUserResponse> | null;

  if (!res.ok) {
    // ✅ sin any
    const msg = json?.data?.message || "No se pudo registrar. Intenta nuevamente.";
    throw new Error(msg);
  }

  const { message, data } = unwrap<RegisterUserResponse>(json);
  return { message: message || "✅ Registro exitoso.", data };
}
