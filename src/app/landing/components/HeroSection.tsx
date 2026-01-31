"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const NAV_HEIGHT = 89;

export default function HeroSection() {
  return (
    <section id="inicio" className="relative w-full scroll-mt-[100px]" style={{ paddingTop: NAV_HEIGHT }}>
      <div className="relative min-h-[calc(100vh-89px)] w-full overflow-hidden">
        <Image
          src="/assets/Destinos/limaPanoramica.jpg"
          alt="Vista panorámica de Lima"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 min-h-[calc(100vh-89px)] flex items-center">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-14">
            <div className="flex flex-col items-center text-center gap-5">
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-[40px] sm:text-[56px] md:text-[78px] font-bold leading-[1.05] text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.90)]"
              >
                Descubre Lima
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8 }}
                className="text-[15px] sm:text-[18px] md:text-[24px] text-white/95 max-w-3xl leading-[1.35] drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]"
              >
                La capital gastronómica de América, donde la historia colonial y la modernidad vibrante se encuentran.
              </motion.p>

              <motion.button
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.7 }}
                className="mt-6 w-[150px] h-[44px] bg-[#FE6E3C] text-white text-[14px] font-semibold rounded-full shadow-md hover:opacity-90 transition"
                onClick={() => document.querySelector("#destinos")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explora
              </motion.button>

              {/* Espaciador responsive: en mobile no exagera, en desktop se siente “hero” */}
              <div className="h-10 sm:h-16 md:h-24" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
