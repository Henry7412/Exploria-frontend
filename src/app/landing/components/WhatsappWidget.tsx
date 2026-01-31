"use client";

import React from "react";

type Props = {
  phoneE164: string; 
  message?: string; 
  position?: "bottom-right" | "bottom-left";
};

function buildWaLink(phoneE164: string, message?: string) {
  const base = `https://wa.me/${phoneE164}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export default function WhatsappWidget({
  phoneE164,
  message = "Hola, ¿puedes ayudarme?",
  position = "bottom-right",
}: Props) {
  const href = buildWaLink(phoneE164, message);

  const pos =
    position === "bottom-left"
      ? "left-4 sm:left-6"
      : "right-4 sm:right-6";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Abrir WhatsApp"
      className={[
        "fixed z-[9999]",
        "bottom-24", // deja espacio por si tienes otro botón flotante
        pos,
        "w-[56px] h-[56px]",
        "rounded-full",
        "shadow-lg",
        "flex items-center justify-center",
        "bg-[#25D366]",
        "hover:scale-105 transition-transform",
      ].join(" ")}
    >
      {/* Icono simple en SVG (sin librerías) */}
      <svg
        width="26"
        height="26"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          fill="white"
          d="M19.11 17.73c-.28-.14-1.63-.8-1.88-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.21-.6.07-.28-.14-1.17-.43-2.23-1.36-.82-.72-1.38-1.6-1.54-1.88-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.04-.35-.02-.5-.07-.14-.61-1.46-.83-2-.22-.53-.44-.46-.61-.47h-.52c-.18 0-.46.07-.7.35-.25.28-.93.91-.93 2.2 0 1.29.95 2.54 1.08 2.72.14.18 1.87 2.85 4.54 4 2.67 1.15 2.67.77 3.15.72.48-.05 1.54-.63 1.76-1.24.22-.61.22-1.14.16-1.24-.07-.11-.25-.18-.53-.32z"
        />
        <path
          fill="white"
          d="M16.03 3.2c-7.05 0-12.78 5.63-12.78 12.55 0 2.2.58 4.26 1.6 6.06L3.2 28.8l7.2-1.88c1.74.94 3.73 1.48 5.63 1.48 7.05 0 12.78-5.63 12.78-12.55 0-6.92-5.73-12.65-12.78-12.65zm0 22.58c-1.72 0-3.34-.5-4.71-1.37l-.34-.21-4.27 1.12 1.14-4.09-.22-.33c-.96-1.37-1.52-3.03-1.52-4.8 0-4.73 3.96-8.57 8.92-8.57 4.96 0 8.92 3.84 8.92 8.57 0 4.73-3.96 8.68-8.92 8.68z"
        />
      </svg>
    </a>
  );
}
