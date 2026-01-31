"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { resetPasswordApi } from "@/src/app/features/auth/api/auth.resetPassword";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (!token) {
    return <p className="text-center mt-20">Token inválido o ausente.</p>;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (password.length < 6) {
      return setErr("La contraseña debe tener al menos 6 caracteres.");
    }

    try {
      setLoading(true);
      await resetPasswordApi({ token, newPassword: password });
      setMsg("Contraseña actualizada correctamente.");
      setTimeout(() => router.push("/"), 2000);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error al cambiar contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]">
      <form
        onSubmit={submit}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-xl font-bold text-center text-[#FE6E3C]">
          Restablecer contraseña
        </h1>

        {err && <p className="text-red-600 text-sm mt-3">{err}</p>}
        {msg && <p className="text-green-600 text-sm mt-3">{msg}</p>}

        <input
          type="password"
          placeholder="Nueva contraseña"
          className="w-full mt-6 px-4 py-3 rounded-lg border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-[#FE6E3C] text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
}
