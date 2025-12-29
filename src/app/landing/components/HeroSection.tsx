"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
   <section id="inicio" className="relative z-0 flex flex-col justify-start items-center h-[100vh] text-center pt-[240px] scroll-mt-[100px]">

      {/* Imagen de fondo */}
      <Image
        src="/assets/Destinos/limaPanoramica.jpg"
        alt="Vista panorámica de Lima"
        fill
        priority
        className="object-cover z-0"
      />

      {/* Capa oscura del hero */}
      <div className="absolute inset-0 bg-black/25 z-10" />

      {/* Contenido */}
      <div className="relative z-20 flex flex-col items-center px-6 translate-y-[-180px]">
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[72px] md:text-[88px] font-bold mb-[6px] leading-[1.05] text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.90)]"
        >
          Descubre Lima
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-[24px] md:text-[26px] text-white max-w-3xl leading-[1.2] drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]"
        >
          La capital gastronómica de América, donde la historia colonial y la
          modernidad vibrante se encuentran.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="relative top-[590px] w-[132px] h-[41px] bg-[#FE6E3C] text-[#FFFFFF] text-[14px] font-semibold rounded-full shadow-md hover:opacity-90 transition"
        >
          Explora
        </motion.button>
      </div>
    </section>
  );
}
