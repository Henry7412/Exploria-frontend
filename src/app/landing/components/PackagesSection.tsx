// src/app/landing/components/PackagesSection.tsx
"use client";

type Package = {
  name: string;
  label: string;
  price: string;
  features: string[];
  bg: string;
  text: string;
  highlight?: boolean;
};

const PACKAGES: Package[] = [
  {
    name: "Basic",
    label: "BACKPACKER",
    price: "S/. 5",
    features: [
      "Ideal para probar el chatbot y planear tu primera ruta.",
      "50 créditos",
    ],
    bg: "bg-[#F6F6F6]",
    text: "text-[#151415]",
  },
  {
    name: "Standard",
    label: "EXPLORER",
    price: "S/. 10",
    features: [
      "Perfecto para una escapada corta o explorar distritos turísticos.",
      "125 créditos",
    ],
    bg: "bg-[#FFEFD8]",
    text: "text-[#151415]",
  },
  {
    name: "Plus",
    label: "ADVENTURER",
    price: "S/. 20",
    features: [
      "Ideal si planeas varios recorridos y consultas con imágenes.",
      "260 créditos",
    ],
    bg: "bg-[#FFE3B8]",
    text: "text-[#151415]",
  },
  {
    name: "Premium",
    label: "EXPEDITION",
    price: "S/. 50",
    features: [
      "Para turistas activos que quieren asistencia ilimitada.",
      "700 créditos",
    ],
    bg: "bg-[#FE6E3C]",
    text: "text-white",
    highlight: true,
  },
];

function PackageCard({ pack }: { pack: Package }) {
  const isHighlight = pack.highlight;

  const headerColor = isHighlight ? "text-white" : "text-[#151415]";
  const subTextColor = isHighlight
    ? "text-white/90"
    : "text-[14px] mt-[2px] opacity-80";
  const featuresColor = isHighlight
    ? "text-white opacity-95"
    : "text-[#555555]";

  return (
    <div
      className={`
        ${pack.bg} ${pack.text}
        w-[220px]
        h-[230px]
        rounded-[26px]
        px-7 py-6
        shadow-[0_18px_40px_rgba(0,0,0,0.08)]
        flex flex-col
      `}
      style={{ color: isHighlight ? "#FFFFFF" : undefined }}
    >
      {/* Encabezado */}
      <div className="text-center mb-3">
        <p
          className={`text-[15px] tracking-wide font-extrabold ${headerColor}`}
          style={{ fontWeight: 800 }}
        >
          {pack.label}
        </p>

        <p className={subTextColor}>Costo</p>

        <p
          className={`text-[16px] mt-[2px] font-extrabold ${
            isHighlight ? "text-white" : ""
          }`}
          style={{ fontWeight: 800 }}
        >
          {pack.price}
        </p>
      </div>

      {/* Lista de beneficios */}
      <ul
        className={`text-[14px] leading-[1.45] space-y-[4px] ${featuresColor} ${
          isHighlight ? "marker:text-white" : ""
        }`}
      >
        {pack.features.map((f) => (
          <li key={f} className="list-disc ml-4">
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PackagesSection() {
  return (
    <section id="paquetes" className="w-full bg-white flex justify-center py-[100px] scroll-mt-[100px]">

      <div className="max-w-[1100px] w-full px-[40px]">
        {/* título / subtítulo */}
        <div className="text-center mb-[40px]">
          <p className="text-[#FE6E3C] text-[25px] font-semibold uppercase tracking-[0.2em] mb-[8px]">
            Nuestros paquetes
          </p>
          <h2 className="text-[#151415] text-[30px] font-bold leading-[1.25]">
            Elige el paquete que necesites
          </h2>
        </div>

        {/* Cards */}
        <div className="flex justify-center">
          <div className="flex gap-[26px]">
            {PACKAGES.map((pack) => (
              <PackageCard key={pack.name} pack={pack} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
