"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerApi } from "../api/auth.register";
import type { RegisterPayload } from "../types/auth.types";
import InputField from "./InputFiled";

type Props = {
  redirectTo?: string;
  onOpenLogin?: () => void;
  onClose?: () => void;
};


function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Ocurrió un error.";
}

export default function RegisterForm({ onOpenLogin, onClose }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<RegisterPayload>({
    names: "",
    lastNames: "",
    emailOrPhone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onChange =
    (key: keyof RegisterPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const validate = () => {
    if (form.names.trim().length < 3) return "Nombres: mínimo 3 caracteres.";
    if (form.lastNames.trim().length < 3) return "Apellidos: mínimo 3 caracteres.";
    if (!form.emailOrPhone.trim()) return "Ingresa tu correo o teléfono.";
    if (form.password.trim().length < 6) return "Contraseña: mínimo 6 caracteres.";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const v = validate();
    if (v) return setError(v);

    try {
      setLoading(true);

      const resp = await registerApi({
        names: form.names.trim(),
        lastNames: form.lastNames.trim(),
        emailOrPhone: form.emailOrPhone.trim(),
        password: form.password,
      });

      setSuccess(resp?.message || "✅ Registro exitoso.");
      setForm({ names: "", lastNames: "", emailOrPhone: "", password: "" });

      onClose?.(); // ✅ cerrar modal si se pasó
      setTimeout(() => router.push("/"), 800); // ✅ redirige al landing
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fieldWrap = "bg-[#F8F8F8] p-[6px] rounded-[22px]";

  return (
    <div className="w-full">
      <div className="text-center mb-7">
        <h1 className="text-[26px] font-extrabold text-[#FE6E3C]">¡Únete a Push!</h1>
        <p className="text-sm text-black/70 mt-2 max-w-[90%] mx-auto">
          Regístrate para guardar preferencias y acceder al chatbot turístico.
        </p>
      </div>

      {error && (
        <p className="text-center text-[13px] text-red-600 font-medium -mt-2">
          {error}
        </p>
      )}
      {success && (
        <p className="text-center text-[13px] text-emerald-600 font-medium -mt-2">
          {success}
        </p>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-7">
          <div className={fieldWrap}>
            <InputField
              value={form.names}
              onChange={onChange("names")}
              placeholder="Nombres"
            />
          </div>
          <div className={fieldWrap}>
            <InputField
              value={form.lastNames}
              onChange={onChange("lastNames")}
              placeholder="Apellidos"
            />
          </div>
        </div>

        <div className={fieldWrap}>
          <InputField
            value={form.emailOrPhone}
            onChange={onChange("emailOrPhone")}
            placeholder="Teléfono o Correo electrónico"
          />
        </div>

        <div className={fieldWrap}>
          <InputField
            type="password"
            value={form.password}
            onChange={onChange("password")}
            placeholder="Contraseña (mínimo 6 caracteres)"
          />
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={loading}
            style={{
              width: 220,
              height: 44,
              borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.30)",
            }}
            className="bg-[#FE6E3C] text-white font-semibold text-[14px] hover:opacity-95 disabled:opacity-60 transition"
          >
            {loading ? "Registrando..." : "REGISTRARME"}
          </button>
        </div>

        <p className="text-sm text-black/60 text-center pt-1">
          ¿Ya tienes una cuenta?{" "}
          <button
            type="button"
            onClick={onOpenLogin}
            className="text-[#FE6E3C] font-semibold hover:underline transition bg-transparent border-none outline-none"
            style={{ padding: 0 }}
          >
            Inicia sesión aquí
          </button>
        </p>
      </form>
    </div>
  );
}
