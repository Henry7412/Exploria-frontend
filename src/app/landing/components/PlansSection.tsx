"use client";

import { useEffect, useMemo, useState } from "react";

import { isLoggedIn } from "@/src/app/features/chatbot/api/chat.helpers";
import {
  getLandingPlans,
  requestUserPlan,
} from "@/src/app/features/plans/api/plans.api";
import type { LandingPlan } from "@/src/app/features/plans/types/plans.types";
import {
  formatPricePEN,
  planFeatures,
  planLabel,
  planStyle,
} from "@/src/app/features/plans/helpers/plans.helpers";

import { getErrorMessage } from "@/src/app/shared/helpers/error.helpers";

type UiPlan = {
  id: string;
  label: string;
  price: string;
  features: string[];
  bg: string;
  text: string;
  highlight?: boolean;
  raw: LandingPlan;
};

function PlanCard({
  plan,
  onChoose,
  loading,
}: {
  plan: UiPlan;
  onChoose: (p: UiPlan) => void;
  loading?: boolean;
}) {
  const isHighlight = !!plan.highlight;

  // ✅ Igual que Packages
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
        ${plan.bg} ${plan.text}
        w-[240px]
        min-h-[260px]
        rounded-[26px]
        px-7 pt-6 pb-10
        shadow-[0_18px_40px_rgba(0,0,0,0.08)]
        flex flex-col
      `}
      style={{ color: isHighlight ? "#FFFFFF" : undefined }}
    >
      {/* ✅ Encabezado (IGUAL QUE PAQUETES) */}
      <div className="text-center mb-3">
        <p
          className={`text-[15px] tracking-wide font-extrabold ${headerColor}`}
          style={{ fontWeight: 800 }}
        >
          {plan.label}
        </p>

        <p className={subTextColor}>Costo</p>

        <p
          className={`text-[16px] mt-[2px] font-extrabold ${
            isHighlight ? "text-white" : ""
          }`}
          style={{ fontWeight: 800 }}
        >
          {plan.price}
        </p>
      </div>

      {/* Features */}
      <ul
        className={`text-[14px] leading-[1.45] space-y-[4px] ${featuresColor} ${
          isHighlight ? "marker:text-white" : ""
        }`}
      >
        {plan.features.map((f) => (
          <li key={f} className="list-disc ml-4">
            {f}
          </li>
        ))}
      </ul>

      {/* Button */}
      <div className="mt-3 flex justify-center">
        <button
          onClick={() => onChoose(plan)}
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
          {loading ? "Procesando..." : "Elegir plan"}
        </button>
      </div>
    </div>
  );
}


export default function PlansSection() {
  const [plans, setPlans] = useState<LandingPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await getLandingPlans();
        if (!mounted) return;

        setPlans(res?.data?.user ?? []);
      } catch (e: unknown) {
        setError(getErrorMessage(e, "Error cargando planes"));
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const uiPlans: UiPlan[] = useMemo(() => {
    return plans.map((p) => {
      const style = planStyle(p.name);

      // ✅ Free sin amount => Gratis
      const price =
        !p.amount || p.amount === 0 ? "Gratis" : formatPricePEN(p.amount);

      return {
        id: p._id,
        label: planLabel(p.name),
        price,
        features: planFeatures(p),
        bg: style.bg,
        text: style.text,
        highlight: style.highlight,
        raw: p,
      };
    });
  }, [plans]);

  const onChoose = async (plan: UiPlan) => {
    setError(null);
    setSuccess(null);

    if (!isLoggedIn()) {
      setError("Primero inicia sesión para solicitar un plan.");
      return;
    }

    try {
      setRequestingId(plan.id);

      const res = await requestUserPlan({
        plan: plan.id,
        annual: false,
      });

      setSuccess(`Solicitud enviada ✅ Código de orden: ${res.orderCode}`);
    } catch (e: unknown) {
      setError(getErrorMessage(e, "No se pudo solicitar el plan"));
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <section
      id="planes"
      className="w-full bg-white flex justify-center py-[10px] scroll-mt-[100px]"
    >
      <div className="max-w-[1100px] w-full px-[40px]">
        <div className="text-center mb-[40px]">
          <p className="text-[#FE6E3C] text-[25px] font-semibold uppercase tracking-[0.2em] mb-[8px]">
            Nuestros planes
          </p>
          <h2 className="text-[#151415] text-[30px] font-bold leading-[1.25]">
            Elige el plan que se adapte
            <br />
            a tus necesidades
          </h2>

          {loading && (
            <p className="mt-3 text-sm opacity-70">Cargando planes...</p>
          )}

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          {success && <p className="mt-3 text-sm text-green-600">{success}</p>}
        </div>

        <div className="flex justify-center">
          <div className="flex gap-[26px] flex-wrap justify-center">
            {!loading &&
              uiPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onChoose={onChoose}
                  loading={requestingId === plan.id}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
