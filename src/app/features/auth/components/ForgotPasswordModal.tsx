"use client";

import { X } from "lucide-react";
import { useState } from "react";
import InputField from "./InputFiled";
import { forgotPasswordApi } from "../api/auth.forgotPassword";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ForgotPasswordModal({ open, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    const value = email.trim().toLowerCase();
    if (!value.includes("@")) return setErr("Ingresa un correo válido.");

    try {
      setLoading(true);
      const res = await forgotPasswordApi({ email: value });
      setMsg(res.message || "Si el correo existe, te enviamos un enlace de recuperación.");
      setEmail("");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "No se pudo enviar el correo.");
    } finally {
      setLoading(false);
    }
  };

  const fieldWrap = "bg-[#F8F8F8] p-[6px] rounded-[22px]";

  return (
    <>
      <div className="fixed inset-0 bg-black/90 z-[99998]" onClick={onClose} />

      <div
        className="fixed z-[99999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[520px]
        bg-[#F8F8F8] rounded-[28px] shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-[18px] right-[18px] w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/10 border-none"
        >
          <X className="w-[20px] h-[20px] text-[#FE6E3C]" />
        </button>

        <div className="px-12 py-12">
          <div className="text-center mb-7">
            <h1 className="text-[24px] font-extrabold text-[#FE6E3C]">Recuperar contraseña</h1>
            <p className="text-sm text-black/70 mt-2 max-w-[90%] mx-auto">
              Te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          {err && <p className="text-center text-[13px] text-red-600 font-medium -mt-2">{err}</p>}
          {msg && <p className="text-center text-[13px] text-emerald-600 font-medium -mt-2">{msg}</p>}

          <form onSubmit={submit} className="flex flex-col gap-6 mt-6">
            <div className={fieldWrap}>
              <InputField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
              />
            </div>

            <div className="flex justify-center pt-1">
              <button
                type="submit"
                disabled={loading}
                style={{ width: 220, height: 44, borderRadius: 16, border: "1px solid rgba(0,0,0,0.30)" }}
                className="bg-[#FE6E3C] text-white font-semibold text-[14px] hover:opacity-95 disabled:opacity-60 transition"
              >
                {loading ? "Enviando..." : "ENVIAR ENLACE"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
