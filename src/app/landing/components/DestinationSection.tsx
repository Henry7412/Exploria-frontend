"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

type Destination = {
  title: string;
  subtitle: string;
  image: string;
  pillHeight: string;
  offsetX: string;
  offsetY: string;
};

const DESTINATIONS: Destination[] = [
  {
    title: "Puente de los Suspiros",
    subtitle: "Cruza y cumple tu deseo en el corazón de Barranco.",
    image: "/assets/Destinos/puenteDeLosSuspiros.jpg",
    pillHeight: "60px",
    offsetX: "16px",
    offsetY: "16px",
  },
  {
    title: "Centro Histórico de Lima",
    subtitle: "El corazón de la “Ciudad de los Reyes”, lleno de historia.",
    image: "/assets/Destinos/centroDelLima.jpg",
    pillHeight: "60px",
    offsetX: "16px",
    offsetY: "16px",
  },
  {
    title: "Museo de Sitio Huaca Pucllana",
    subtitle: "Impresionante pirámide de adobe de la cultura Lima.",
    image: "/assets/Destinos/Huaca.jpg",
    pillHeight: "60px",
    offsetX: "16px",
    offsetY: "16px",
  },
  {
    title: "Museo Larco",
    subtitle: "Magnífico museo en una casona virreinal del siglo XVIII.",
    image: "/assets/Destinos/museoLarco.jpg",
    pillHeight: "60px",
    offsetX: "16px",
    offsetY: "16px",
  },
];

function Card({ destination }: { destination: Destination }) {
  return (
    <article className="relative w-full h-full rounded-[24px] overflow-hidden shadow-[0_16px_35px_rgba(0,0,0,0.18)]">
      <Image src={destination.image} alt={destination.title} fill className="object-cover" />

      <div
        className="absolute z-20"
        style={{
          left: destination.offsetX,
          right: destination.offsetX,
          bottom: destination.offsetY,
          height: destination.pillHeight,
        }}
      >
        <div
          className="h-full w-full px-5 py-[6px] flex items-center justify-between rounded-full backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          style={{ backgroundColor: "rgba(255,255,255,0.55)" }}
        >
          <div className="flex flex-col justify-center space-y-[2px] pl-[8px] pr-4 min-w-0">
            <h4 className="font-semibold text-[16px] sm:text-[18px] leading-tight" style={{ color: "rgba(0,0,0,0.85)" }}>
              {destination.title}
            </h4>
            <p className="text-[13px] sm:text-[14px] leading-tight truncate" style={{ color: "rgba(0,0,0,0.75)" }} title={destination.subtitle}>
              {destination.subtitle}
            </p>
          </div>

          <button
            type="button"
            className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#FE6E3C] hover:scale-105 transition-transform shrink-0"
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function DestinationSection() {
  return (
    <>
      {/* INTRO */}
      <section id="destinos" className="w-full bg-white flex justify-center py-16 sm:py-20 scroll-mt-[100px]">
        <div className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="max-w-xl">
              <p className="text-[#FE6E3C] text-[20px] sm:text-[26px] font-semibold uppercase mb-2 tracking-wide">
                Destinos
              </p>
              <h2 className="text-[#151415] text-[26px] sm:text-[32px] font-bold leading-[1.25] mb-3">
                Descubre destinos maravillosos dentro de la{" "}
                <span className="block">Ciudad de los Reyes</span>
              </h2>
              <p className="text-[#555555] text-[14px] sm:text-[15px] leading-[1.7]">
                Explora una capital de destinos únicos...
              </p>
            </div>

            {/* imágenes: en mobile centradas y sin offsets extremos */}
            <div className="relative w-full max-w-[520px] mx-auto h-[260px] sm:h-[320px]">
              <div className="absolute top-0 right-0 rounded-[22px] overflow-hidden shadow-[0_5px_45px_rgba(0,0,0,0.15)] w-[85%] h-[78%]">
                <Image src="/assets/Destinos/parqueDelAmor.jpg" alt="Parque del Amor" fill className="object-cover" />
              </div>

              <div className="absolute bottom-0 left-0 bg-white rounded-[26px] shadow-[0_8px_25px_rgba(0,0,0,0.1)] p-[6px] w-[75%]">
                <div className="relative overflow-hidden rounded-[20px] h-[180px] sm:h-[220px]">
                  <Image src="/assets/Destinos/faro.jpg" alt="Faro de Miraflores" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID DESTINOS */}
      <section className="w-full bg-white flex justify-center pb-16 sm:pb-20">
        <div className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="text-[#FE6E3C] text-[18px] sm:text-[22px] font-semibold uppercase tracking-[0.16em] mb-2">
              Mejores destinos
            </p>
            <h3 className="text-[#151415] text-[24px] sm:text-[32px] font-bold mb-2">
              Centro Histórico de Lima
            </h3>
            <p className="text-[#555555] text-[14px] sm:text-[15px] max-w-[640px] mx-auto leading-[1.7]">
              Embárcate en un recorrido por la Ciudad de los Reyes...
            </p>
          </div>

          {/* ✅ responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="h-[240px] sm:h-[280px]">
              <Card destination={DESTINATIONS[0]} />
            </div>
            <div className="h-[240px] sm:h-[280px]">
              <Card destination={DESTINATIONS[1]} />
            </div>
            <div className="h-[240px] sm:h-[280px]">
              <Card destination={DESTINATIONS[2]} />
            </div>
            <div className="h-[240px] sm:h-[280px]">
              <Card destination={DESTINATIONS[3]} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
