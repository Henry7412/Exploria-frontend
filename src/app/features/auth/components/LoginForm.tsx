"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LoginPayload } from "../types/auth.types";
import { loginApi } from "../api/auth.singIn";
import InputField from "./InputFiled";

type Props = {
  onOpenRegister: () => void;
  onClose: () => void;
  onOpenForgot: () => void;
};

export default function LoginForm({ onOpenRegister, onClose, onOpenForgot }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<LoginPayload>({
    emailOrPhone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange =
    (key: keyof LoginPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const validate = () => {
    if (!form.emailOrPhone.trim()) return "Ingresa tu correo o teléfono.";
    if (form.password.trim().length < 6) return "Contraseña mínima: 6 caracteres.";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const v = validate();
    if (v) return setError(v);

    try {
      setLoading(true);
      const resp = await loginApi({
        emailOrPhone: form.emailOrPhone.trim(),
        password: form.password,
      });

      localStorage.setItem("accessToken", resp.accessToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          names: resp.user.names,
          lastNames: resp.user.lastNames,
        })
      );
      window.dispatchEvent(new Event("storage"));
      onClose(); // ✅ cierra modal
      router.push("/"); // ✅ redirige al landing

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  const fieldWrap = "bg-[#F8F8F8] p-[6px] rounded-[22px]";

  return (
    <div className="w-full">
      {/* TITULO */}
      <div className="text-center mb-7">
        <h1 className="text-[26px] font-extrabold text-[#FE6E3C]">¡Bienvenido de vuelta!</h1>
        <p className="text-sm text-black/70 mt-2 max-w-[90%] mx-auto">
          Inicia sesión para acceder a tu asistente turístico.
        </p>
      </div>

      {/* MENSAJE DE ERROR */}
      {error && (
        <p className="text-center text-[13px] text-red-600 font-medium -mt-2">
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className={fieldWrap}>
          <InputField
            value={form.emailOrPhone}
            onChange={onChange("emailOrPhone")}
            placeholder="Correo electrónico o teléfono"
          />
        </div>

        <div className={fieldWrap}>
          <InputField
            type="password"
            value={form.password}
            onChange={onChange("password")}
            placeholder="Contraseña"
          />
        </div>

        {/* ¿Olvidaste tu contraseña? */}
        <div className="flex justify-center mt-1 mb-3">
          <button
            type="button"
            className="text-sm text-[#FE6E3C] font-medium hover:underline transition bg-transparent border-none outline-none"
            style={{ padding: 0 }}
            onClick={onOpenForgot}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div className="flex justify-center pt-1">
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
            {loading ? "Ingresando..." : "INICIAR SESIÓN"}
          </button>
        </div>

        {/* Enlace a registro */}
        <p className="text-sm text-black/60 text-center pt-1">
          ¿No tienes una cuenta?{" "}
          <button
            type="button"
            onClick={onOpenRegister}
            className="text-[#FE6E3C] font-semibold hover:underline transition bg-transparent border-none outline-none"
            style={{ padding: 0 }}
          >
            Regístrate ahora
          </button>
        </p>
      </form>
    </div>
  );
}
