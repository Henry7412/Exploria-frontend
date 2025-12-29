"use client";

import { useState } from "react";
import LoginForm from "@/src/app/features/auth/components/LoginForm";

export default function LoginPage() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleOpenRegister = () => setIsRegisterOpen(true);

  const handleClose = () => {
    console.log("Modal cerrado (Login)");
    // Aquí no hay modal, así que no necesitas hacer nada más.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] px-4">
      <div className="w-full max-w-[480px] bg-white rounded-[28px] p-12 shadow-[0_18px_80px_rgba(0,0,0,0.2)]">
        <LoginForm
          onOpenRegister={handleOpenRegister}
          onClose={handleClose} // ✅ PASAR onClose dummy
        />
      </div>
    </div>
  );
}
