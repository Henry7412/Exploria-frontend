"use client";

import { useState } from "react";
import RegisterModal from "../features/auth/components/RegisterModal";
import LoginModal from "../features/auth/components/LoginModal";
import ForgotPasswordModal from "../features/auth/components/ForgotPasswordModal";

import ChatbotButton from "../landing/components/ChatbotButton";
import DestinationSection from "../landing/components/DestinationSection";
import Footer from "../landing/components/Footer";
import GastronomySection from "../landing/components/GastronomySection";
import HeroSection from "../landing/components/HeroSection";
import Navbar from "../landing/components/Navbar";
import PackagesSection from "../landing/components/PackagesSection";
import PlansSection from "../landing/components/PlansSection";
import WhatsappWidget from "../landing/components/WhatsappWidget";

export default function LandingPage() {
  const [openRegister, setOpenRegister] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);

  // ✅ NUEVO: estado del chatbot
  const [chatOpen, setChatOpen] = useState(false);

  const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
  const waText = process.env.NEXT_PUBLIC_WHATSAPP_TEXT;

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar setOpenRegister={setOpenRegister} setOpenLogin={setOpenLogin} />

      <HeroSection />
      <DestinationSection />
      <GastronomySection />
      <PlansSection />
      <PackagesSection />

      {/* ✅ PASAMOS CONTROL AL CHATBOT */}
      <ChatbotButton
        isOpen={chatOpen}
        onOpen={() => setChatOpen(true)}
        onClose={() => setChatOpen(false)}
      />

      <Footer />

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
        onOpenForgot={() => {
          setOpenLogin(false);
          setOpenForgot(true);
        }}
      />

      <ForgotPasswordModal
        open={openForgot}
        onClose={() => {
          setOpenForgot(false);
          setOpenLogin(true);
        }}
      />

      {/* ✅ WhatsApp SOLO SI EL CHAT NO ESTÁ ABIERTO */}
      {!chatOpen && waPhone && (
        <WhatsappWidget
          phoneE164={waPhone}
          message={waText}
          position="bottom-right"
        />
      )}
    </main>
  );
}
