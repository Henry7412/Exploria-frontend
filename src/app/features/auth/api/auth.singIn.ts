import type { LoginPayload } from "../types/auth.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginApi(payload: LoginPayload) {
  if (!API_URL) throw new Error("Falta NEXT_PUBLIC_API_URL");

  const res = await fetch(`${API_URL}/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Credenciales incorrectas o usuario no encontrado");

  const data = await res.json();
  return data;
}
