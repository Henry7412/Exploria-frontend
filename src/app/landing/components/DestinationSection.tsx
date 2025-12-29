"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

type Destination = {
  title: string;
  subtitle: string;
  image: string;
  pillWidth: string;
  pillHeight: string;
  offsetX: string;
  offsetY: string;
};

/* ===== DATOS CON CONFIG INDEPENDIENTE DE PASTILLA ===== */
const DESTINATIONS: Destination[] = [
  {
    title: "Puente de los Suspiros",
    subtitle: "Cruza y cumple tu deseo en el corazón de Barranco.",
    image: "/assets/Destinos/puenteDeLosSuspiros.jpg",
    pillWidth: "430px",
    pillHeight: "60px",
    offsetX: "20px",
    offsetY: "20px",
  },
  {
    title: "Centro Histórico de Lima",
    subtitle: "El corazón de la “Ciudad de los Reyes”, lleno de historia.",
    image: "/assets/Destinos/centroDelLima.jpg",
    pillWidth: "670px",
    pillHeight: "60px",
    offsetX: "20px",
    offsetY: "20px",
  },
  {
    title: "Museo de Sitio Huaca Pucllana",
    subtitle: "Impresionante pirámide de adobe de la cultura Lima.",
    image: "/assets/Destinos/Huaca.jpg",
    pillWidth: "670px",
    pillHeight: "60px",
    offsetX: "20px",
    offsetY: "20px",
  },
  {
    title: "Museo Larco",
    subtitle: "Magnífico museo en una casona virreinal del siglo XVIII.",
    image: "/assets/Destinos/museoLarco.jpg",
    pillWidth: "430px",
    pillHeight: "60px",
    offsetX: "20px",
    offsetY: "20px",
  },
];

/* =================== CARD COMPONENTE ==================== */

function Card({ destination }: { destination: Destination }) {
  return (
    <article
      className="
        relative w-full h-full
        rounded-[24px] overflow-hidden 
        shadow-[0_16px_35px_rgba(0,0,0,0.18)]
      "
    >
      {/* Imagen */}
      <Image
        src={destination.image}
        alt={destination.title}
        fill
        className="object-cover"
      />

    {/* PASTILLA INDEPENDIENTE */}
    <div
      className="absolute z-20 flex items-center"
      style={{
        left: destination.offsetX,
        bottom: destination.offsetY,
        width: destination.pillWidth,
        height: destination.pillHeight,
      }}
    >
    <div
        className="
            h-full w-full
            px-6 py-[6px]
            flex items-center justify-between
            rounded-full
            backdrop-blur-2xl
            bg-white/25
            shadow-[0_8px_30px_rgba(0,0,0,0.35)]
            
          "
          style={{
            backgroundColor: "rgba(255,255,255,0.55)",
          }}
        >
            {/* TEXTOS */}
            <div className="flex flex-col justify-center space-y-[2px] pl-[12px]">

            <h4 className="font-semibold text-[18px] leading-tight" style={{ color: "rgba(0,0,0,0.85)" }}>
                  {destination.title}
              </h4>

            <p className="text-white/90 text-[14px] leading-tight mt-[-1px] " style={{ color: "rgba(0,0,0,1.99)" }}>
              {destination.subtitle}
            </p>
          </div>


            {/* BOTÓN */}
              <button
                className="
                  w-[40px] h-[40px]
                  flex items-center justify-center
                  rounded-full bg-[#FE6E3C]
                  hover:scale-105 transition-transform
                  shrink-0
                  mr-[9px] 
                "
                >
                <ArrowRight className="w-4 h-4 text-white" style={{ color: "#FFFFFF" }}   />
              </button>
          </div>
      </div>

    </article>
  );
}


export default function DestinationSection() {
  const [puente, centro, huaca, larco] = DESTINATIONS;

  return (
    <>
      {/* INTRO DESTINOS */}
      <section id="destinos" className="w-full bg-white flex justify-center items-center py-[120px] scroll-mt-[100px]">
        <div className="flex items-center justify-between max-w-[1200px] w-full px-[80px] gap-[60px]">
          <div className="flex flex-col w-[460px] justify-center">
            <p className="text-[#FE6E3C] text-[30px] font-semibold uppercase mb-[10px] tracking-wide">
              Destinos
            </p>

            <h2 className="text-[#151415] text-[34px] font-bold leading-[1.25] mb-[16px]">
              Descubre destinos maravillosos dentro de la{" "}
              <span className="block">Ciudad de los Reyes</span>
            </h2>

            <p className="text-[#555555] text-[15px] leading-[1.7]">
              Explora una capital de destinos únicos...
            </p>
          </div>

          <div className="relative w-[520px] h-[320px]">
            <div className="absolute top-[-80px] right-[-60px] rounded-[22px] overflow-hidden shadow-[0_5px_45px_rgba(0,0,0,0.15)]">
              <Image
                src="/assets/Destinos/parqueDelAmor.jpg"
                alt="Parque del Amor"
                width={500}
                height={300}
                className="object-cover rounded-[22px]"
              />
            </div>

            <div className="absolute bottom-[-35px] left-[-90px] bg-white rounded-[26px] shadow-[0_8px_25px_rgba(0,0,0,0.1)] p-[6px]">
              <div className="overflow-hidden rounded-[20px]">
                <Image
                  src="/assets/Destinos/faro.jpg"
                  alt="Faro de Miraflores"
                  width={370}
                  height={240}
                  className="object-cover rounded-[20px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEJORES DESTINOS */}
      <section className="w-full bg-white flex justify-center pb-[120px]">
        <div className="max-w-[1200px] w-full px-[80px]">
          <div className="text-center mb-[40px]">
            <p className="text-[#FE6E3C] text-[25px] font-semibold uppercase tracking-[0.16em] mb-[8px]">
              Mejores destinos
            </p>
            <h3 className="text-[#151415] text-[32px] md:text-[36px] font-bold mb-[10px]">
              Centro Histórico de Lima
            </h3>
            <p className="text-[#555555] text-[15px] max-w-[600px] mx-auto leading-[1.7]">
              Embárcate en un recorrido por la Ciudad de los Reyes...
            </p>
          </div>

          {/* LAYOUT */}
          <div className="flex flex-col gap-[22px]">
            <div className="flex gap-[22px]">
              <div className="w-[45%] h-[280px]">
                <Card destination={puente} />
              </div>
              <div className="w-[68%] h-[280px]">
                <Card destination={centro} />
              </div>
            </div>

            <div className="flex gap-[22px]">
              <div className="w-[68%] h-[280px]">
                <Card destination={huaca} />
              </div>
              <div className="w-[45%] h-[280px]">
                <Card destination={larco} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
