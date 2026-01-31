"use client";

import { useRouter } from "next/navigation";
import LoginForm from "@/src/app/features/auth/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] px-4">
      <div className="w-full max-w-[480px] bg-white rounded-[28px] p-12 shadow-[0_18px_80px_rgba(0,0,0,0.2)]">
        <LoginForm
          onOpenRegister={() => router.push("/auth/register")} // ✅ ir a register page
          onOpenForgot={() => router.push("/auth/forgot-password")} // ✅ ir a forgot page (o modal)
          onClose={() => {}} // ✅ dummy
        />
      </div>
    </div>
  );
}
