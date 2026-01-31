"use client";

import { useEffect, useMemo, useState } from "react";

import { isLoggedIn } from "@/src/app/features/chatbot/api/chat.helpers";
import { getErrorMessage } from "@/src/app/shared/helpers/error.helpers";

import {
  getLandingPackages,
  requestCreditsByPackage,
} from "@/src/app/features/packages/api/packages.api";

import type { LandingPackage } from "@/src/app/features/packages/types/packages.types";

import {
  formatPricePEN,
  packageFeatures,
  packageLabel,
  packageStyle,
} from "@/src/app/features/packages/helpers/packages.helpers";

type UiPackage = {
  id: string;
  label: string;
  price: string;
  features: string[];
  bg: string;
  text: string;
  highlight?: boolean;
  raw: LandingPackage;
};

function PackageCard({
  pack,
  onChoose,
  loading,
}: {
  pack: UiPackage;
  onChoose: (p: UiPackage) => void;
  loading?: boolean;
}) {
  const isHighlight = !!pack.highlight;

  const headerColor = isHighlight ? "text-white" : "text-[#151415]";
  const subTextColor = isHighlight
    ? "text-white/90"
    : "text-[14px] mt-[2px] opacity-80";
  const featuresColor = isHighlight
    ? "text-white opacity-95"
    : "text-[#555555]";

  return (
    <div
      className={`
        ${pack.bg} ${pack.text}
        w-[220px]
        min-h-[250px]
        rounded-[26px]
        px-7 pt-6 pb-10
        shadow-[0_18px_40px_rgba(0,0,0,0.08)]
        flex flex-col
      `}
      style={{ color: isHighlight ? "#FFFFFF" : undefined }}
    >
      {/* Encabezado */}
      <div className="text-center mb-3">
        <p
          className={`text-[15px] tracking-wide font-extrabold ${headerColor}`}
          style={{ fontWeight: 800 }}
        >
          {pack.label}
        </p>

        <p className={subTextColor}>Costo</p>

        <p
          className={`text-[16px] mt-[2px] font-extrabold ${
            isHighlight ? "text-white" : ""
          }`}
          style={{ fontWeight: 800 }}
        >
          {pack.price}
        </p>
      </div>

      {/* Beneficios */}
      <ul
        className={`text-[14px] leading-[1.45] space-y-[4px] ${featuresColor} ${
          isHighlight ? "marker:text-white" : ""
        }`}
      >
        {pack.features.map((f) => (
          <li key={f} className="list-disc ml-4">
            {f}
          </li>
        ))}
      </ul>

      {/* Botón */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => onChoose(pack)}
          disabled={loading}
          className={`
            w-[150px]
            h-[36px]
            rounded-full
            text-[13px]
            font-medium
            transition
            bg-[#F5F5F5]
            text-[#111111]
            border border-[#DADADA]
            ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#EDEDED]"}
          `}
        >
          {loading ? "Procesando..." : "Elegir paquete"}
        </button>
      </div>
    </div>
  );
}

export default function PackagesSection() {
  const [packages, setPackages] = useState<LandingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
  try {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const res = await getLandingPackages();
    if (!mounted) return;

    setPackages(res?.items ?? []);
  } catch (e: unknown) {
    setError(getErrorMessage(e, "Error cargando paquetes"));
  } finally {
    setLoading(false);
  }
})();


    return () => {
      mounted = false;
    };
  }, []);

  const uiPackages: UiPackage[] = useMemo(() => {
    return packages.map((p) => {
      const style = packageStyle(p.name);
      const price = !p.amount || p.amount === 0 ? "Gratis" : formatPricePEN(p.amount);

      return {
        id: p._id,
        label: packageLabel(p.name),
        price,
        features: packageFeatures(p),
        bg: style.bg,
        text: style.text,
        highlight: style.highlight,
        raw: p,
      };
    });
  }, [packages]);

  const onChoose = async (pack: UiPackage) => {
    setError(null);
    setSuccess(null);

    if (!isLoggedIn()) {
      setError("Primero inicia sesión para solicitar un paquete.");
      return;
    }

    try {
      setRequestingId(pack.id);

      // ✅ Backend espera { package: "<id>" }
      const res = await requestCreditsByPackage({ package: pack.id });

      setSuccess(
        res?.orderCode
          ? `Solicitud enviada ✅ Código de orden: ${res.orderCode}`
          : "Solicitud enviada ✅"
      );
    } catch (e: unknown) {
      setError(getErrorMessage(e, "No se pudo solicitar el paquete"));
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <section
      id="paquetes"
      className="w-full bg-white flex justify-center py-[100px] scroll-mt-[100px]"
    >
      <div className="max-w-[1100px] w-full px-[40px]">
        <div className="text-center mb-[40px]">
          <p className="text-[#FE6E3C] text-[25px] font-semibold uppercase tracking-[0.2em] mb-[8px]">
            Nuestros paquetes
          </p>
          <h2 className="text-[#151415] text-[30px] font-bold leading-[1.25]">
            Elige el paquete que necesites
          </h2>

          {loading && <p className="mt-3 text-sm opacity-70">Cargando paquetes...</p>}
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-3 text-sm text-green-600">{success}</p>}
        </div>

        <div className="flex justify-center">
          <div className="flex gap-[26px] flex-wrap justify-center">
            {!loading &&
              uiPackages.map((pack) => (
                <PackageCard
                  key={pack.id}
                  pack={pack}
                  onChoose={onChoose}
                  loading={requestingId === pack.id}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
