import type { LandingPlan } from "../types/plans.types";

export function formatPricePEN(amount: number) {
  return `S/. ${amount}`;
}

export function planLabel(planName: string) {
  if (planName === "PLAN_FREE") return "PLAN FREE";
  if (planName === "PLAN_WEEKLY") return "PLAN WEEKLY";
  if (planName === "PLAN_MONTHLY") return "PLAN MONTHLY";
  return planName;
}

export function planStyle(planName: string) {
  if (planName === "PLAN_FREE") {
    return { bg: "bg-[#F6F6F6]", text: "text-[#151415]" };
  }
  if (planName === "PLAN_WEEKLY") {
    return { bg: "bg-[#FFE3B8]", text: "text-[#151415]" };
  }
  return { bg: "bg-[#FE6E3C]", text: "text-white", highlight: true };
}

export function planFeatures(plan: LandingPlan) {
  const period =
    plan.period === "WEEKLY"
      ? `Duración: ${plan.duration} semana(s)`
      : `Duración: ${plan.duration} mes(es)`;

  const channel =
    plan.name === "PLAN_FREE"
      ? "Solo texto"
      : plan.name === "PLAN_WEEKLY"
      ? "Texto + Audio"
      : "Texto + Audio + Imágenes";

  return [period, `Incluye ${plan.credits ?? 0} créditos`, channel];
}
