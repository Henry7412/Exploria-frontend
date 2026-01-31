import { FaInstagram, FaFacebookF } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#F8F8F8] text-[#151415] mt-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-10">
        {/* ✅ 4 columnas en desktop, stack en mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="max-w-[320px]">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/assets/LogoFooter/logo.svg"
                alt="Push Logo"
                width={160}
                height={60}
                className="h-auto w-auto"
              />
            </div>

            <p className="text-gray-600 leading-[1.55] text-[14px]">
              Tu guía turística inteligente para descubrir lo mejor de Lima, Perú.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#151415] mb-3 text-[14px]">Acceso Rápido</h4>
            <ul className="space-y-[8px] text-gray-600 text-[14px]">
              <li>Inicio</li>
              <li>Destinos</li>
              <li>Gastronomía</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#151415] mb-3 text-[14px]">Contáctanos</h4>
            <p className="text-gray-700 text-[14px]">+51 995496207</p>
            <p className="text-gray-700 text-[14px] mt-1">henryvillegas2000@gmail.com</p>
          </div>

          <div>
            <h4 className="font-semibold text-[#151415] mb-4 text-[14px]">Redes Sociales</h4>
            <div className="flex gap-4 text-[22px]">
              <FaInstagram className="text-gray-600 cursor-pointer hover:text-[#FE6E3C] transition-colors" />
              <FaFacebookF className="text-gray-600 cursor-pointer hover:text-[#1877F2] transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-[#E6E6E6]" />

      {/* ✅ bottom bar responsive */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-10 py-6 text-[12px] text-gray-500">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center justify-between">
          <p className="text-center sm:text-left">© 2025 ExplorIA. Todos los derechos reservados</p>
          <p className="text-center sm:text-right">Políticas y Privacidad | Términos y Condiciones</p>
        </div>
      </div>
    </footer>
  );
}
