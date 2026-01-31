import type {
  LandingPlansResponse,
  PlanUserRequestPayload,
  PlanUserRequestResponse,
} from "../types/plans.types";

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

function unwrapData<T>(x: unknown): T | null {
  if (typeof x !== "object" || x === null) return null;

  const d1 = (x as { data?: unknown }).data;
  if (d1 === undefined) return null;

  // data directo
  if (typeof d1 !== "object" || d1 === null) return d1 as T;

  // doble data
  const d2 = (d1 as { data?: unknown }).data;
  if (d2 !== undefined) return d2 as T;

  return d1 as T;
}

export async function getLandingPlans(): Promise<LandingPlansResponse> {
  ensureApiUrl();

  const res = await fetch(`${API_URL}/api/v1/landing/plans/available`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const json: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = extractBackendMessage(json) ?? "No se pudo obtener los planes";
    throw new Error(msg);
  }

  return json as LandingPlansResponse;
}

export async function requestUserPlan(
  payload: PlanUserRequestPayload
): Promise<PlanUserRequestResponse> {
  ensureApiUrl();

  const token = getAuthToken();

  const res = await fetch(`${API_URL}/api/v1/landing/plan/user/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const json: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = extractBackendMessage(json) ?? "No se pudo solicitar el plan";
    throw new Error(msg);
  }

  const unwrapped = unwrapData<PlanUserRequestResponse>(json);

  if (unwrapped && typeof unwrapped === "object") {
    const oc = (unwrapped as { orderCode?: unknown }).orderCode;
    if (typeof oc === "string" && oc.trim()) return { orderCode: oc };
  }

 
  if (typeof json === "object" && json !== null) {
    const oc = (json as { orderCode?: unknown }).orderCode;
    if (typeof oc === "string" && oc.trim()) return { orderCode: oc };
  }

  return { orderCode: "" };
}
