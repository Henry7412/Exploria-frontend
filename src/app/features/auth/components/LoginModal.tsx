"use client";

import { X } from "lucide-react";
import LoginForm from "./LoginForm";

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
  onOpenForgot: () => void; // ✅ lo recibe del padre (LandingPage)
};

export default function LoginModal({
  open,
  onClose,
  onOpenRegister,
  onOpenForgot,
}: Props) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/90 z-[99998]" onClick={onClose} />

      <div
        className="
          fixed z-[99999]
          top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          w-full max-w-[520px]
          bg-[#F8F8F8]
          rounded-[28px]
          shadow-[0_30px_120px_rgba(0,0,0,0.45)]
        "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="
            absolute top-[18px] right-[18px]
            w-7 h-7 flex items-center justify-center
            rounded-full bg-transparent hover:bg-black/10 border-none
          "
        >
          <X className="w-[20px] h-[20px] text-[#FE6E3C]" />
        </button>

        <div className="px-12 py-12">
          <LoginForm
            onOpenRegister={onOpenRegister}
            onClose={onClose}
            onOpenForgot={onOpenForgot} // ✅
          />
        </div>
      </div>
    </>
  );
}
