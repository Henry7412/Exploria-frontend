"use client";

type Plan = {
  name: string;
  label: string;
  price: string;
  features: string[];
  bg: string;
  text: string;
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Free",
    label: "PLAN FREE",
    price: "Gratis",
    features: ["Ideal para nuevos viajeros", "10 créditos", "Solo texto"],
    bg: "bg-[#F6F6F6]",
    text: "text-[#151415]",
  },
  {
    name: "Weekly",
    label: "PLAN WEEKLY",
    price: "S/. 15",
    features: ["Perfecto para un viaje corto", "50 créditos", "Texto + Audio"],
    // 🔥 Ahora toma el color del antiguo MONTHLY
    bg: "bg-[#FFE3B8]",
    text: "text-[#151415]",
  },
  {
    name: "Monthly",
    label: "PLAN MONTHLY",
    price: "S/. 45",
    features: [
      "Explora todo el mes",
      "200 créditos",
      "Texto + Audio + Imágenes",
    ],
    // 🔥 Ahora toma el color del antiguo ANNUAL
    bg: "bg-[#FE6E3C]",
    text: "text-white",
    highlight: true,
  },
];

// ...existing code...
// ...existing code...
function PlanCard({ plan }: { plan: Plan }) {
  const isHighlight = plan.highlight;

  const headerColor = isHighlight ? "text-white" : "text-[#151415]";
  const subTextColor = isHighlight ? "text-white/90" : "text-[14px] mt-[2px] opacity-80";
  const featuresColor = isHighlight ? "text-white opacity-95" : "text-[#555555]";

  return (
    <div
      className={`
        ${plan.bg} ${plan.text}
        w-[220px]
        h-[220px]
        rounded-[26px]
        px-7 py-6
        shadow-[0_18px_40px_rgba(0,0,0,0.08)]
        flex flex-col
      `}
      style={{ color: isHighlight ? "#FFFFFF" : undefined }} // FORZAR blanco cuando destaque
    >
      {/* Encabezado */}
      <div className="text-center mb-3">
        <p
          className={`text-[15px] tracking-wide font-extrabold ${headerColor}`}
          style={{ fontWeight: 800 }}
        >
          {plan.label}
        </p>

        <p className={subTextColor}>Costo</p>

        <p
          className={`text-[16px] mt-[2px] font-extrabold ${isHighlight ? "text-white" : ""}`}
          style={{ fontWeight: 800 }}
        >
          {plan.price}
        </p>
      </div>

      {/* Lista de beneficios */}
      <ul className={`text-[14px] leading-[1.45] space-y-[4px] ${featuresColor} ${isHighlight ? "marker:text-white" : ""}`}>
        {plan.features.map((f) => (
          <li key={f} className="list-disc ml-4">
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PlansSection() {
  return (
    <section id="planes" className="w-full bg-white flex justify-center py-[10px] scroll-mt-[100px]">

      <div className="max-w-[1100px] w-full px-[40px]">
        {/* título / subtítulo */}
        <div className="text-center mb-[40px]">
          <p className="text-[#FE6E3C] text-[25px] font-semibold uppercase tracking-[0.2em] mb-[8px]">
            Nuestros planes
          </p>
          <h2 className="text-[#151415] text-[30px] font-bold leading-[1.25]">
            Elige el plan que se adapte
            <br />
            a tus necesidades
          </h2>
        </div>

        {/* Cards */}
        <div className="flex justify-center">
          <div className="flex gap-[26px]">
            {PLANS.map((plan) => (
              <PlanCard key={plan.name} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
