"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { resetPasswordApi } from "@/src/app/features/auth/api/auth.resetPassword";

export default function ResetPasswordClient() {
  const params = useSearchParams();
  const router = useRouter();

  const token = useMemo(() => params.get("token"), [params]);

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (!token) {
      setErr("Token inválido o ausente.");
      return;
    }

    if (password.trim().length < 6) {
      setErr("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordApi({ token, newPassword: password.trim() });
      setMsg("Contraseña actualizada correctamente.");
      setTimeout(() => router.push("/"), 1500);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error al cambiar contraseña.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <p className="text-center mt-20">Token inválido o ausente.</p>;
  }

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
          disabled={loading}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-[#FE6E3C] text-white py-3 rounded-lg font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
}
