import type { ApiEnvelope, LoginPayload, LoginResponse } from "../types/auth.types";
import { unwrap } from "./auth.helpers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginApi(payload: LoginPayload) {
  if (!API_URL) throw new Error("Falta NEXT_PUBLIC_API_URL");

  const res = await fetch(`${API_URL}/api/v1/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = (await res.json().catch(() => null)) as ApiEnvelope<LoginResponse> | null;

  if (!res.ok) {
    const msg =
      json?.data?.message || "Credenciales incorrectas o usuario no encontrado";
    throw new Error(msg);
  }

  const { data } = unwrap<LoginResponse>(json);
  if (!data?.accessToken) throw new Error("Respuesta inválida del servidor (sin token).");

  return data;
}
