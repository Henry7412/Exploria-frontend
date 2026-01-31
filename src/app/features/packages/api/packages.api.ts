import type {
  LandingPackagesResponse,
  CreditsRequestPayload,
  CreditsRequestResponse,
} from "../types/packages.types";

import { getAuthToken } from "@/src/app/features/auth/api/auth.helpers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function ensureApiUrl() {
  if (!API_URL) throw new Error("Falta NEXT_PUBLIC_API_URL en .env.local");
}


function extractBackendMessage(x: unknown): string | null {
  if (typeof x !== "object" || x === null) return null;
  const msg = (x as { message?: unknown }).message;
  return typeof msg === "string" ? msg : null;
}

// ✅ unwrap para { data: T } y { data: { data: T } }
function unwrapData<T>(x: unknown): T | null {
  if (typeof x !== "object" || x === null) return null;

  const d1 = (x as { data?: unknown }).data;
  if (d1 === undefined) return null;

  if (typeof d1 !== "object" || d1 === null) return d1 as T;

  const d2 = (d1 as { data?: unknown }).data;
  if (d2 !== undefined) return d2 as T;

  return d1 as T;
}

export async function getLandingPackages(): Promise<LandingPackagesResponse> {
  ensureApiUrl();

  const res = await fetch(`${API_URL}/api/v1/landing/packages/list`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const json: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = extractBackendMessage(json) ?? "No se pudo obtener los paquetes";
    throw new Error(msg);
  }

  // type guard
  const isLandingPackagesResponse = (x: unknown): x is LandingPackagesResponse => {
    if (typeof x !== "object" || x === null) return false;

    const items = (x as Record<string, unknown>).items;
    return Array.isArray(items);
  };

  // ✅ soporta { items } o { data: { items } } o { data: { data: { items } } }
  const unwrapped = unwrapData<unknown>(json);

  if (isLandingPackagesResponse(unwrapped)) return unwrapped;

  // fallback si viene directo { items }
  if (isLandingPackagesResponse(json)) return json;

  return { items: [] };
}


export async function requestCreditsByPackage(
  payload: CreditsRequestPayload
): Promise<CreditsRequestResponse> {
  ensureApiUrl();

  const token = getAuthToken();

  const res = await fetch(`${API_URL}/api/v1/landing/credits/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const json: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = extractBackendMessage(json) ?? "No se pudo solicitar el paquete";
    throw new Error(msg);
  }

  // successResponse => { data: { orderCode } }
  const data = unwrapData<CreditsRequestResponse>(json);

  if (data && typeof data.orderCode === "string") return data;

  // fallback por si el backend devuelve directo { orderCode }
  if (typeof json === "object" && json !== null) {
    const oc = (json as { orderCode?: unknown }).orderCode;
    if (typeof oc === "string") return { orderCode: oc };
  }

  return { orderCode: "" };
}
