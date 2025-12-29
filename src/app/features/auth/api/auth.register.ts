import type {
  RegisterPayload,
  SuccessResponse,
  RegisterUserResponse,
} from "../types/auth.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function assertApiUrl() {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL no está definido en .env.local");
}

function getMessageFromUnknown(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;

  // { message: "..." }
  if ("message" in value && typeof (value as { message?: unknown }).message === "string") {
    return (value as { message: string }).message;
  }

  // { error: { message: "..." } }
  if ("error" in value && value.error && typeof value.error === "object") {
    const errObj = value.error as { message?: unknown };
    if (typeof errObj.message === "string") return errObj.message;
  }

  return null;
}

export async function registerApi(payload: RegisterPayload) {
  assertApiUrl();

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json =
    (await res.json().catch(() => null)) as SuccessResponse<RegisterUserResponse> | null;

  if (!res.ok) {
    const msg = getMessageFromUnknown(json) || "No se pudo registrar. Intenta nuevamente.";
    throw new Error(msg);
  }

  return json;
}
