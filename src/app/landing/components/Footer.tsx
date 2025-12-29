import { FaInstagram, FaFacebookF } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#F8F8F8] text-textDark mt-10 min-h-[150px] flex flex-col">
      {/* BLOQUE SUPERIOR: ocupa el alto flexible */}
      <div className="flex-1">
        {/* CONTENIDO PRINCIPAL */}
        <div className="max-w-[1100px] mx-auto px-10 pt-16 pb-12 flex flex-col gap-8">
          {/* FILA SUPERIOR */}
          <div className="flex flex-row items-start justify-between gap-10">
            {/* LOGO + DESCRIPCIÓN */}
            <div className="max-w-[260px] flex flex-col">
              {/* LOGO alineado con los títulos */}
              <div className="flex items-center gap-3 mb-3 mt-[10px]">
                <Image
                  src="/assets/LogoFooter/logo.svg"
                  alt="Push Logo"
                  width={160}
                  height={60}
                  className="h-auto w-auto"
                />
              </div>

              {/* Texto descriptivo */}
              <p className="text-gray-600 leading-[1.4] text-[14px] mt-6">
                Tu guía turística inteligente para descubrir lo mejor de Lima,
                Perú.
              </p>
            </div>

            {/* ACCESO RÁPIDO */}
            <div>
              <h4 className="font-semibold text-[#151415] mb-3 text-[14px]">
                Acceso Rápido
              </h4>
              <ul className="space-y-[6px] text-gray-600 text-[14px]">
                <li>Inicio</li>
                <li>Destinos</li>
                <li>Gastronomía</li>
              </ul>
            </div>

            {/* CONTACTO */}
            <div>
              <h4 className="font-semibold text-[#151415] mb-3 text-[14px]">
                Contáctanos
              </h4>
              <p className="text-gray-700 text-[14px]">+51 995496207</p>
              <p className="text-gray-700 text-[14px] mt-1">
                henryvillegas2000@gmail.com
              </p>
            </div>

            {/* REDES SOCIALES */}
            <div>
              <h4 className="font-semibold text-[#151415] mb-4 text-[14px]">
                Redes Sociales
              </h4>
              <div className="flex flex-col text-[22px]">
                <div className="mb-6">
                  <FaInstagram className="text-gray-600 cursor-pointer hover:text-[#FE6E3C] transition-colors" />
                </div>
                <div>
                  <FaFacebookF className="text-gray-600 cursor-pointer hover:text-[#1877F2] transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LÍNEA FULL-WIDTH */}
        <div className="w-full border-t border-[#E6E6E6]" />
      </div>

      {/* COPYRIGHT ABAJO */}
     {/* COPYRIGHT ABAJO */}
{/* COPYRIGHT ABAJO */}
{/* COPYRIGHT ABAJO */}
<div className="w-full px-10 py-6 flex flex-row items-center justify-center gap-20 text-[12px] text-gray-500">
  <p>© 2025 ExplorIA. Todos los derechos reservados</p>
  <span className="w-[600px] h-6 bg-gray-300"></span>
  <p>Políticas y Privacidad | Términos y Condiciones</p>
</div>



    </footer>
  );
}
