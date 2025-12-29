"use client";

import { useState } from "react";
import RegisterModal from "../features/auth/components/RegisterModal";
import LoginModal from "../features/auth/components/LoginModal";
import ChatbotButton from "../landing/components/ChatbotButton";
import DestinationSection from "../landing/components/DestinationSection";
import Footer from "../landing/components/Footer";
import GastronomySection from "../landing/components/GastronomySection";
import HeroSection from "../landing/components/HeroSection";
import Navbar from "../landing/components/Navbar";
import PackagesSection from "../landing/components/PackagesSection";
import PlansSection from "../landing/components/PlansSection";

export default function LandingPage() {
  const [openRegister, setOpenRegister] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* ✅ PASAMOS LOS HANDLERS AL NAVBAR */}
      <Navbar
        setOpenRegister={setOpenRegister}
        setOpenLogin={setOpenLogin}
      />

      <HeroSection />
      <DestinationSection />
      <GastronomySection />
      <PlansSection />
      <PackagesSection />
      <ChatbotButton />
      <Footer />

      {/* 🔥 MODALES CONTROLADOS DESDE AQUI */}
      <RegisterModal
        open={openRegister}
        onClose={() => setOpenRegister(false)}
        onOpenLogin={() => {
          setOpenRegister(false);
          setOpenLogin(true);
        }}
      />

      <LoginModal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onOpenRegister={() => {
          setOpenLogin(false);
          setOpenRegister(true);
        }}
      />
    </main>
  );
}
