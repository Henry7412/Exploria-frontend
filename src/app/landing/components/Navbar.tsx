"use client";

import Image from "next/image";

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

export default function Navbar({ setOpenRegister, setOpenLogin }: Props) {
  return (
    <nav className="fixed top-0 left-0 w-full h-[89px] bg-[#F8F8F8] shadow-[0_2px_6px_rgba(0,0,0,0.1)] z-[100] flex items-center">
      <div className="w-full max-w-[1440px] mx-auto flex justify-between items-center px-[160px]">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/assets/LogoFooter/logo.svg"
            alt="ExplorIA"
            width={100}
            height={100}
            className="object-contain"
            priority
          />
        </div>

        {/* Enlaces */}
        <ul className="flex items-center gap-[66px] text-[15px] font-medium text-[#151415] list-none">
          {sections.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className="no-underline text-[#151415] hover:text-[#FE6E3C] transition-colors duration-200"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Botones */}
        <div className="flex items-center gap-[10px]">
          <button
            type="button"
            onClick={() => setOpenRegister(true)}
            className="w-[132px] h-[41px] flex items-center justify-center bg-[#FE6E3C] text-[#FFFFFF] text-[14px] font-semibold rounded-full hover:opacity-90 transition"
          >
            Regístrate
          </button>

          <button
            type="button"
            onClick={() => setOpenLogin(true)}
            className="w-[132px] h-[41px] flex items-center justify-center bg-[#FE6E3C] text-[#FFFFFF] text-[14px] font-semibold rounded-full hover:opacity-90 transition"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
