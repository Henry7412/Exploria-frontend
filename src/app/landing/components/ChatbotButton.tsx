"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ImagePlus, Mic, ArrowUp } from "lucide-react";

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Abrir chatbot"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "56px",
            height: "56px",
            zIndex: 9999,
            border: "none",
            outline: "none",
          }}
          className="bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <Image
            src="/assets/LogoChat/logoChat.png"
            alt="Chatbot"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </button>
      )}

      {/* VENTANA DEL CHATBOT */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "88px",
            right: "24px",
            zIndex: 9999,

            // ✅ BORDE REDONDEADO REAL (externo) + recorte
            borderRadius: 24,
            overflow: "hidden",

            // ✅ tarjeta
            backgroundColor: "#FFFFFF",
            boxShadow: "0 18px 50px rgba(0,0,0,0.12)",
          }}
          className="w-[360px] h-[520px] flex flex-col"
        >
          {/* HEADER */}
          <div
            style={{
              height: 48,
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                aria-label="Adjuntar imagen"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                className="hover:bg-black/5 flex items-center justify-center"
              >
                <ImagePlus className="h-5 w-5 text-black/70" />
              </button>

              <button
                type="button"
                aria-label="Usar micrófono"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                className="hover:bg-black/5 flex items-center justify-center"
              >
                <Mic className="h-5 w-5 text-black/70" />
              </button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chatbot"
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              className="hover:bg-black/5 flex items-center justify-center"
            >
              <X className="h-5 w-5 text-black/70" />
            </button>
          </div>

          {/* ✅ LÍNEA SEPARADORA SOLO ENTRE ICONOS Y X (no a todo el ancho) */}
          <div
            style={{
              height: 1,
              backgroundColor: "#E5E7EB",
              marginLeft: 16,  // mismo padding del header
              marginRight: 16, // mismo padding del header
            }}
          />

          {/* BODY */}
          <div
            style={{
              flex: 1,
              padding: "12px 16px",
              overflowY: "auto",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div style={{ fontSize: 14, color: "rgba(0,0,0,0.65)" }}>
              👋 Hola, ¿en qué te puedo ayudar?
            </div>

           
          </div>

          {/* INPUT */}
          <div style={{ padding: "10px 16px 16px", backgroundColor: "#FFFFFF" }}>
            <div
              style={{
                height: 48,
                borderRadius: 999,
                backgroundColor: "#F3F4F6",
                padding: "0 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 13,
                  color: "#111",
                  appearance: "none",
                }}
              />

              <button
                type="button"
                aria-label="Enviar mensaje"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  border: "none",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.16)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowUp className="h-4 w-4 text-black" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
