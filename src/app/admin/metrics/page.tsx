"use client";

import { useEffect, useMemo, useState } from "react";

type Channel = "web" | "whatsapp";

type MetricsSummaryDTO = {
  count: number;
  resolvedCount: number;
  avgResponseTimeMs: number;
  fcrPercent: number;
};

// Tu backend responde con successResponse(this.i18n, ..., result)
// y por tu captura: { data: { message: string, data: MetricsSummaryDTO } }
type SuccessResponse<T> = {
  data: {
    message?: string;
    data: T;
  };
  success?: boolean;
  message?: string;
};

function msToSeconds(ms: number): string {
  const s = ms / 1000;
  if (!Number.isFinite(s)) return "0.00";
  return s.toFixed(2);
}

function toIsoStartOfDay(dateStr: string) {
  // dateStr = "YYYY-MM-DD"
  return new Date(`${dateStr}T00:00:00`).toISOString(); // toma hora local y la convierte a UTC
}

function toIsoEndOfDay(dateStr: string) {
  return new Date(`${dateStr}T23:59:59.999`).toISOString();
}

function buildQuery(params: { from?: string; to?: string; channel?: Channel }) {
  const qs = new URLSearchParams();

  if (params.from) qs.set("from", toIsoStartOfDay(params.from));
  if (params.to) qs.set("to", toIsoEndOfDay(params.to));
  if (params.channel) qs.set("channel", params.channel);

  const str = qs.toString();
  return str ? `?${str}` : "";
}


export default function AdminMetricsPage() {
  const [channel, setChannel] = useState<Channel>("web");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [summary, setSummary] = useState<MetricsSummaryDTO | null>(null);

  // ✅ URL backend
  const API_URL = useMemo(() => {
    const v = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    return v && v.length > 0 ? v : "http://localhost:3000";
  }, []);

  // ✅ Ajusta el key si tu token se guarda con otro nombre
  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") ?? "";
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    setError("");

    try {
      const q = buildQuery({
        from: from || undefined,
        to: to || undefined,
        channel,
      });

      const res = await fetch(
        `${API_URL}/api/v1/landing/chat/metrics/summary${q}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        }
      );

      const json = (await res.json().catch(() => null)) as
        | SuccessResponse<MetricsSummaryDTO>
        | null;

      if (!res.ok) {
        const msg =
          json?.data?.message ??
          json?.message ??
          "No se pudo obtener el resumen de métricas";
        throw new Error(msg);
      }

      const payload = json?.data?.data;
      if (!payload) throw new Error("Respuesta inválida del servidor");

      // ✅ Normaliza a número por si backend manda string (por seguridad)
      setSummary({
        count: Number(payload.count ?? 0),
        resolvedCount: Number(payload.resolvedCount ?? 0),
        avgResponseTimeMs: Number(payload.avgResponseTimeMs ?? 0),
        fcrPercent: Number(payload.fcrPercent ?? 0),
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      setError(msg);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tmrSeconds = summary ? msToSeconds(summary.avgResponseTimeMs) : "0.00";

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-[#151415]">
            Dashboard de Métricas
          </h1>
          <p className="text-sm text-neutral-600">
            Indicadores operativos del chatbot (TMR / FCR) en tiempo real.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-neutral-200 bg-[#F8F8F8] p-4 md:grid-cols-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-700">
              Canal
            </label>
            <select
              className="h-10 rounded-xl border border-neutral-300 bg-white px-3 text-sm"
              value={channel}
              onChange={(e) => setChannel(e.target.value as Channel)}
            >
              <option value="web">Web</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-700">
              Desde
            </label>
            <input
              type="date"
              className="h-10 rounded-xl border border-neutral-300 bg-white px-3 text-sm"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-700">
              Hasta
            </label>
            <input
              type="date"
              className="h-10 rounded-xl border border-neutral-300 bg-white px-3 text-sm"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => void fetchSummary()}
              disabled={loading}
              className="h-10 w-full rounded-xl bg-[#FE6E3C] px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Cargando..." : "Actualizar"}
            </button>
          </div>

          {error ? (
            <div className="md:col-span-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        {/* Cards KPI */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <KpiCard
            title="Interacciones"
            value={summary?.count ?? 0}
            subtitle="Total registrado"
          />
          <KpiCard
            title="TMR promedio"
            value={`${tmrSeconds}s`}
            subtitle={`${summary?.avgResponseTimeMs ?? 0} ms`}
          />
          <KpiCard
            title="Resueltas"
            value={summary?.resolvedCount ?? 0}
            subtitle="resolved = true"
          />
          <KpiCard
            title="FCR"
            value={`${summary?.fcrPercent ?? 0}%`}
            subtitle="First Contact Resolution"
          />
        </div>

        {/* Panel visual (dashboard) */}
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-base font-semibold text-[#151415]">
                Resumen
              </div>
              <div className="text-xs text-neutral-600">
                Canal: <span className="font-semibold">{channel}</span>
                {from ? ` · Desde: ${from}` : ""}
                {to ? ` · Hasta: ${to}` : ""}
              </div>
            </div>

            <div className="rounded-xl bg-[#F8F8F8] px-3 py-2 text-xs text-neutral-700">
              Datos desde /metrics/summary
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Gauge
              label="FCR"
              percent={Number(summary?.fcrPercent ?? 0)}
              hint="Porcentaje de consultas resueltas en el primer contacto."
            />
            <Gauge
              label="TMR"
              percent={Math.min(
                100,
                Math.round(((summary?.avgResponseTimeMs ?? 0) / 15000) * 100)
              )}
              hint="Indicador visual del tiempo medio (escala 0–15s)."
              valueRight={`${tmrSeconds}s`}
            />
          </div>

          <div className="mt-5 text-xs text-neutral-500">
            * Esta vista cumple HU26 (dashboard). Los KPIs provienen del backend y
            se pueden auditar en MongoDB.
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard(props: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold text-neutral-600">{props.title}</div>
      <div className="mt-2 text-3xl font-bold text-[#151415]">{props.value}</div>
      {props.subtitle ? <div className="mt-2 text-xs text-neutral-500">{props.subtitle}</div> : null}
    </div>
  );
}

function Gauge(props: { label: string; percent: number; hint: string; valueRight?: string }) {
  const p = Math.max(0, Math.min(100, Number.isFinite(props.percent) ? props.percent : 0));

  return (
    <div className="rounded-2xl border border-neutral-200 bg-[#F8F8F8] p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold text-[#151415]">{props.label}</div>
        <div className="text-xs font-semibold text-neutral-700">
          {props.valueRight ? props.valueRight : `${p}%`}
        </div>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-[#FE6E3C]" style={{ width: `${p}%` }} />
      </div>

      <div className="mt-2 text-xs text-neutral-600">{props.hint}</div>
    </div>

  );
  
}
