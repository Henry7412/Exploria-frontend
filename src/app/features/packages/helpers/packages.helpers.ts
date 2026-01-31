import type { LandingPackage } from "../types/packages.types";

export function formatPricePEN(amount: number): string {
  return `S/. ${amount}`;
}

export function packageStyle(name: string | null): {
  bg: string;
  text: string;
  highlight?: boolean;
} {
  const key = String(name ?? "").toUpperCase();

  if (key.includes("BACKPACK")) return { bg: "bg-[#F6F6F6]", text: "text-[#151415]" };
  if (key.includes("EXPLOR")) return { bg: "bg-[#FFEFD8]", text: "text-[#151415]" };
  if (key.includes("ADVENT")) return { bg: "bg-[#FFE3B8]", text: "text-[#151415]" };
  if (key.includes("EXPED")) return { bg: "bg-[#FE6E3C]", text: "text-white", highlight: true };

  return { bg: "bg-[#F6F6F6]", text: "text-[#151415]" };
}

export function packageLabel(name: string | null): string {
  return String(name ?? "PACKAGE").toUpperCase();
}

export function packageFeatures(p: LandingPackage): string[] {
  const key = String(p.name ?? "").toUpperCase();
  const creditsLine = `${p.credits ?? 0} créditos`;

  if (key.includes("BACKPACK")) {
    return ["Ideal para probar el chatbot y planear tu primera ruta.", creditsLine];
  }
  if (key.includes("EXPLOR")) {
    return ["Perfecto para una escapada corta o explorar distritos turísticos.", creditsLine];
  }
  if (key.includes("ADVENT")) {
    return ["Ideal si planeas varios recorridos y consultas con imágenes.", creditsLine];
  }
  if (key.includes("EXPED")) {
    return ["Para turistas activos que quieren asistencia ilimitada.", creditsLine];
  }

  return [creditsLine];
}
