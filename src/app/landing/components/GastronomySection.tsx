"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

type Dish = {
  title: string;
  subtitle: string;
  image: string;
  pillHeight: string;
  offsetX: string;
  offsetY: string;
};

const DISHES: Dish[] = [
  {
    title: "Pisco Sour",
    subtitle: "El cóctel nacional del Perú.",
    image: "/assets/Gastronomia/pisco.jpg",
    pillHeight: "60px",
    offsetX: "16px",
    offsetY: "16px",
  },
  {
    title: "Lomo Saltado",
    subtitle: "Obra maestra de la fusión Chifa, símbolo del encuentro entre Perú y Asia.",
    image: "/assets/Gastronomia/lomoSaltado.jpg",
    pillHeight: "60px",
    offsetX: "16px",
    offsetY: "16px",
  },
  {
    title: "Ceviche",
    subtitle: "Plato bandera de Lima, el sabor fresco del Pacífico servido en un plato.",
    image: "/assets/Gastronomia/ceviche.jpg",
    pillHeight: "60px",
    offsetX: "16px",
    offsetY: "16px",
  },
  {
    title: "Chicha Morada",
    subtitle: "La bebida tradicional más popular.",
    image: "/assets/Gastronomia/chichaMorada.png",
    pillHeight: "60px",
    offsetX: "16px",
    offsetY: "16px",
  },
];

function DishCard({ dish }: { dish: Dish }) {
  return (
    <article
      className="
        relative w-full h-full
        rounded-[24px] overflow-hidden
        shadow-[0_16px_35px_rgba(0,0,0,0.18)]
      "
    >
      <Image src={dish.image} alt={dish.title} fill className="object-cover" />

      {/* Pastilla adaptativa: left + right */}
      <div
        className="absolute z-20"
        style={{
          left: dish.offsetX,
          right: dish.offsetX,
          bottom: dish.offsetY,
          height: dish.pillHeight,
        }}
      >
        <div
          className="
            h-full w-full
            px-5 py-[6px]
            flex items-center justify-between
            rounded-full
            backdrop-blur-2xl
            shadow-[0_8px_30px_rgba(0,0,0,0.35)]
          "
          style={{ backgroundColor: "rgba(255,255,255,0.55)" }}
        >
          <div className="flex flex-col justify-center space-y-[2px] pl-[8px] pr-4 min-w-0">
            <h4
              className="font-semibold text-[16px] sm:text-[18px] leading-tight"
              style={{ color: "rgba(0,0,0,0.85)" }}
            >
              {dish.title}
            </h4>

            <p
              className="text-[13px] sm:text-[14px] leading-tight truncate"
              style={{ color: "rgba(0,0,0,0.75)" }}
              title={dish.subtitle}
            >
              {dish.subtitle}
            </p>
          </div>

          <button
            type="button"
            className="
              w-[40px] h-[40px]
              flex items-center justify-center
              rounded-full bg-[#FE6E3C]
              hover:scale-105 transition-transform
              shrink-0
            "
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function GastronomySection() {
  return (
    <>
      {/* INTRO GASTRONOMÍA */}
      <section
        id="gastronomia"
        className="w-full bg-white flex justify-center py-16 sm:py-20 scroll-mt-[100px]"
      >
        <div className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Texto */}
            <div className="max-w-xl">
              <p className="text-[#FE6E3C] text-[20px] sm:text-[26px] font-semibold uppercase mb-2 tracking-[0.18em]">
                Gastronomía
              </p>

              <h2 className="text-[#151415] text-[26px] sm:text-[32px] font-bold leading-[1.25] mb-3">
                Un viaje de sabores
                <span className="block">que conquistó al mundo</span>
              </h2>

              <p className="text-[#555555] text-[14px] sm:text-[15px] leading-[1.7]">
                Cada plato es un destino en sí mismo. Sumérgete en un mundo de
                sabores donde ingredientes milenarios del mar y los Andes se
                encuentran con técnicas globales, creando una cocina innovadora
                que deleita a locales y viajeros por igual.
              </p>
            </div>

            {/* Imágenes superpuestas responsive */}
            <div className="relative w-full max-w-[520px] mx-auto h-[260px] sm:h-[320px]">
              {/* Fondo (CAUSA) */}
              <div className="absolute top-0 right-0 w-[88%] h-[78%] rounded-[22px] overflow-hiddens shadow-[0_5px_45px_rgba(0,0,0,0.15)] overflow-hidden">
                <Image
                  src="/assets/Gastronomia/causa.jpg"
                  alt="Causa limeña gourmet"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Frontal (ANTICUCHO) */}
              <div className="absolute bottom-0 left-0 bg-white rounded-[26px] shadow-[0_8px_25px_rgba(0,0,0,0.1)] p-[6px] w-[78%]">
                <div className="relative w-full h-[180px] sm:h-[220px] overflow-hidden rounded-[20px]">
                  <Image
                    src="/assets/Gastronomia/anticucho.jpg"
                    alt="Anticucho peruano"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SABORES IMPERDIBLES */}
      <section className="w-full bg-white flex justify-center pb-16 sm:pb-20">
        <div className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="text-[#FE6E3C] text-[18px] sm:text-[22px] font-semibold uppercase tracking-[0.2em] mb-2">
              Sabores imperdibles
            </p>

            <h3 className="text-[#151415] text-[24px] sm:text-[32px] font-bold mb-2">
              El alma de Lima servida en un plato
            </h3>

            <p className="text-[#555555] text-[14px] sm:text-[15px] max-w-[640px] mx-auto leading-[1.7]">
              Descubre por qué nuestra cocina conquistó al mundo. Desde la frescura
              vibrante del ceviche hasta el equilibrio perfecto del Pisco Sour,
              estos son los íconos que definen nuestro sabor.
            </p>
          </div>

          {/* ✅ Grid responsive (sin porcentajes raros) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="h-[240px] sm:h-[260px]">
              <DishCard dish={DISHES[0]} />
            </div>
            <div className="h-[240px] sm:h-[260px]">
              <DishCard dish={DISHES[1]} />
            </div>
            <div className="h-[240px] sm:h-[260px]">
              <DishCard dish={DISHES[2]} />
            </div>
            <div className="h-[240px] sm:h-[260px]">
              <DishCard dish={DISHES[3]} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
