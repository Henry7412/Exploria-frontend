"use client";

import RegisterForm from "@/src/app/features/auth/components/RegisterForm";

export default function RegisterPage() {
  const handleClose = () => {
    console.log("Modal cerrado (Register)");
    // No hace nada porque no es modal
  };

  return (
    <main className="min-h-screen bg-[#F8F8F8] flex items-center justify-center px-4">
      <RegisterForm
        redirectTo="/auth/login"
        onClose={handleClose} // ✅ PASAR onClose dummy
      />
    </main>
  );
}
