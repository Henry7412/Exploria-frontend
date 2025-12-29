"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

type Dish = {
  title: string;
  subtitle: string;
  image: string;
  pillWidth: string;
  pillHeight: string;
  offsetX: string;
  offsetY: string;
};

const DISHES: Dish[] = [
  {
    title: "Pisco Sour",
    subtitle: "El cóctel nacional del Perú.",
    image: "/assets/Gastronomia/pisco.jpg",
    pillWidth: "395px",
    pillHeight: "60px",
    offsetX: "20px",
    offsetY: "20px",
  },
  {
    title: "Lomo Saltado",
    subtitle:
      "Obra maestra de la fusión Chifa, símbolo del encuentro entre Perú y Asia.",
    image: "/assets/Gastronomia/lomoSaltado.jpg",
    pillWidth: "695px",
    pillHeight: "60px",
    offsetX: "20px",
    offsetY: "20px",
  },
  {
    title: "Ceviche",
    subtitle:
      "Plato bandera de Lima, el sabor fresco del Pacífico servido en un plato.",
    image: "/assets/Gastronomia/ceviche.jpg",
    pillWidth: "695px",
    pillHeight: "60px",
    offsetX: "20px  ",
    offsetY: "20px",
  },
  {
    title: "Chicha Morada",
    subtitle: "La bebida tradicional más popular.",
    image: "/assets/Gastronomia/chichaMorada.png",
    pillWidth: "395px",
    pillHeight: "60px",
    offsetX: "20px",
    offsetY: "20px",
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
      <Image
        src={dish.image}
        alt={dish.title}
        fill
        className="object-cover"
      />

      {/* PASTILLA INFERIOR */}
      <div
        className="absolute z-20 flex items-center"
        style={{
          left: dish.offsetX,
          bottom: dish.offsetY,
          width: dish.pillWidth,
          height: dish.pillHeight,
        }}
      >
        <div
          className="
            h-full w-full
            px-6 py-[6px]
            flex items-center justify-between
            rounded-full
            backdrop-blur-2xl
            shadow-[0_8px_30px_rgba(0,0,0,0.35)]
          "
          style={{
            backgroundColor: "rgba(255,255,255,0.55)",
          }}
        >
           <div className="flex flex-col justify-center space-y-[2px] pl-[12px]">

            <h4 className="font-semibold text-[18px] leading-tight" style={{ color: "rgba(0,0,0,0.85)" }}>
              {dish.title}
            </h4>
            <p className="text-white/90 text-[14px] leading-tight mt-[-1px] " style={{ color: "rgba(0,0,0,1.99)" }}>
              {dish.subtitle}
            </p>
          </div>

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

export default function GastronomySection() {
  const [pisco, lomo, ceviche, chicha] = DISHES;

  return (
    <>
      {/* BLOQUE SUPERIOR: INTRO GASTRONOMÍA */}
      <section id="gastronomia" className="w-full bg-white flex justify-center items-center py-[120px] scroll-mt-[100px]">

        <div className="flex items-center justify-between max-w-[1200px] w-full px-[80px] gap-[60px]">
          {/* Texto izquierda */}
          <div className="flex flex-col w-[460px] justify-center">
            <p className="text-[#FE6E3C] text-[30px] font-semibold uppercase mb-[12px] tracking-[0.18em]">
              Gastronomía
            </p>

            <h2 className="text-[#151415] text-[34px] font-bold leading-[1.25] mb-[16px]">
              Un viaje de sabores
              <span className="block">que conquistó al mundo</span>
            </h2>

            <p className="text-[#555555] text-[15px] leading-[1.7]">
              Cada plato es un destino en sí mismo. Sumérgete en un mundo de
              sabores donde ingredientes milenarios del mar y los Andes se
              encuentran con técnicas globales, creando una cocina innovadora
              que deleita a locales y viajeros por igual.
            </p>
          </div>

          {/* Imágenes derecha superpuestas */}
          <div className="relative w-[520px] h-[320px]">
            {/* Foto superior (causa + fondo verde) */}
            <div className="absolute top-[-40px] right-[-40px] rounded-[22px] overflow-hidden shadow-[0_5px_45px_rgba(0,0,0,0.15)]">
              <Image
                src="/assets/Gastronomia/causa.jpg"
                alt="Causa limeña gourmet"
                width={420}
                height={260}
                className="object-cover rounded-[22px]"
              />
            </div>

            {/* Foto frontal (anticuchos / papas) */}
            <div className="absolute bottom-[-35px] left-[-70px] bg-white rounded-[26px] shadow-[0_8px_25px_rgba(0,0,0,0.1)] p-[6px]">
              <div className="overflow-hidden rounded-[20px]">
                <Image
                  src="/assets/Gastronomia/anticucho.jpg"
                  alt="Plato tradicional peruano"
                  width={360}
                  height={230}
                  className="object-cover rounded-[20px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE INFERIOR: SABORES IMPERDIBLES */}
      <section className="w-full bg-white flex justify-center pb-[120px]">
        <div className="max-w-[1200px] w-full px-[80px]">
          {/* Encabezado centrado */}
          <div className="text-center mb-[40px]">
            <p className="text-[#FE6E3C] text-[25px] font-semibold uppercase tracking-[0.2em] mb-[8px]">
              Sabores imperdibles
            </p>
            <h3 className="text-[#151415] text-[32px] md:text-[36px] font-bold mb-[10px]">
              El alma de Lima servida en un plato
            </h3>
            <p className="text-[#555555] text-[15px] max-w-[640px] mx-auto leading-[1.7]">
              Descubre por qué nuestra cocina conquistó al mundo. Desde la
              frescura vibrante del ceviche hasta el equilibrio perfecto del
              Pisco Sour, estos son los íconos que definen nuestro sabor.
            </p>
          </div>

          {/* Cards layout como Figma */}
          <div className="flex flex-col gap-[22px]">
            {/* Fila 1: Pisco pequeño + Lomo grande */}
            <div className="flex gap-[22px]">
              <div className="w-[37%] h-[240px]">
                <DishCard dish={pisco} />
              </div>
              <div className="w-[63%] h-[240px]">
                <DishCard dish={lomo} />
              </div>
            </div>

            {/* Fila 2: Ceviche grande + Chicha pequeña */}
            <div className="flex gap-[22px]">
              <div className="w-[63%] h-[260px]">
                <DishCard dish={ceviche} />
              </div>
              <div className="w-[37%] h-[260px]">
                <DishCard dish={chicha} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
