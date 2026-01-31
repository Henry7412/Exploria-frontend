"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const sections = [
  { label: "Inicio", href: "#inicio" },
  { label: "Destinos", href: "#destinos" },
  { label: "Gastronomía", href: "#gastronomia" },
  { label: "Planes", href: "#planes" },
  { label: "Paquetes", href: "#paquetes" },
];

type Props = {
  setOpenRegister: (open: boolean) => void;
  setOpenLogin: (open: boolean) => void;
};

type StoredUser = {
  names: string;
  lastNames?: string;
};

export default function Navbar({ setOpenRegister, setOpenLogin }: Props) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem("user");
        setUser(raw ? (JSON.parse(raw) as StoredUser) : null);
      } catch {
        setUser(null);
      }
    };

    load();
    const onStorage = () => load();
    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    setMobileOpen(false);
  };

  const onNavClick = (href: string) => {
    setMobileOpen(false);
    // scroll suave ya lo tienes en layout con scroll-smooth
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-[89px] bg-[#F8F8F8] shadow-[0_2px_6px_rgba(0,0,0,0.1)] z-[100] flex items-center">
        <div className="w-full max-w-[1440px] mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-10">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-2"
            onClick={() => onNavClick("#inicio")}
            aria-label="Ir al inicio"
          >
            <Image
              src="/assets/LogoFooter/logo.svg"
              alt="ExplorIA"
              width={110}
              height={40}
              className="object-contain"
              priority
            />
          </button>

          {/* Links desktop */}
          <ul className="hidden lg:flex items-center gap-10 text-[15px] font-medium text-[#151415] list-none">
            {sections.map((item) => (
              <li key={item.href}>
                <button
                  type="button"
                  onClick={() => onNavClick(item.href)}
                  className="text-[#151415] hover:text-[#FE6E3C] transition-colors duration-200"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-[15px] font-medium text-[#151415]">
                  Hola, <span className="font-semibold">{user.names} {user.lastNames ?? ""}</span>
                </span>

                <button
                  type="button"
                  onClick={logout}
                  className="text-[14px] font-semibold text-[#FE6E3C] hover:underline bg-transparent border-none outline-none"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setOpenRegister(true)}
                  className="w-[132px] h-[41px] flex items-center justify-center bg-[#FE6E3C] text-white text-[14px] font-semibold rounded-full hover:opacity-90 transition"
                >
                  Regístrate
                </button>

                <button
                  type="button"
                  onClick={() => setOpenLogin(true)}
                  className="w-[132px] h-[41px] flex items-center justify-center bg-[#FE6E3C] text-white text-[14px] font-semibold rounded-full hover:opacity-90 transition"
                >
                  Iniciar Sesión
                </button>
              </>
            )}
          </div>

          {/* Burger móvil */}
          <button
            type="button"
            className="lg:hidden w-10 h-10 rounded-xl hover:bg-black/5 flex items-center justify-center"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Drawer móvil */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[99] lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-[89px] left-0 right-0 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
            <div className="px-4 py-4 flex flex-col gap-3">
              {sections.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => onNavClick(item.href)}
                  className="text-left py-3 px-3 rounded-xl hover:bg-black/5 text-[15px] font-medium text-[#151415]"
                >
                  {item.label}
                </button>
              ))}

              <div className="h-[1px] bg-[#E5E7EB] my-2" />

              {user ? (
                <div className="px-3 pb-4">
                  <div className="text-[14px] text-[#151415] mb-3">
                    Hola, <span className="font-semibold">{user.names} {user.lastNames ?? ""}</span>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full h-[42px] rounded-full border border-black/10 text-[#FE6E3C] font-semibold"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="px-3 pb-5 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setOpenRegister(true);
                    }}
                    className="w-full h-[42px] rounded-full bg-[#FE6E3C] text-white font-semibold"
                  >
                    Regístrate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setOpenLogin(true);
                    }}
                    className="w-full h-[42px] rounded-full bg-[#FE6E3C] text-white font-semibold"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
