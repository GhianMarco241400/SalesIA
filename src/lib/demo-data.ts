const penFormatter = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });
export const money = (n: number) => penFormatter.format(n);
export const combos = [
  {
    name: "Arranque",
    price: 89,
    setup: 290,
    description: "Para dar el primer paso digital",
    features: [
      "Página web informativa",
      "Dominio propio incluido",
      "Correo empresarial",
      "Copias de seguridad",
    ],
    icon: "web",
  },
  {
    name: "Negocio",
    price: 189,
    setup: 490,
    description: "Para vender y recibir pedidos",
    features: [
      "Tienda o catálogo digital",
      "Gestión de pedidos",
      "Panel de administración",
      "Todo lo de Arranque",
    ],
    icon: "shop",
  },
  {
    name: "Crece",
    price: 349,
    setup: 790,
    description: "Para llevar tu negocio más lejos",
    features: [
      "Página web + app móvil",
      "App para Android y iOS",
      "Soporte prioritario",
      "Todo lo de Negocio",
    ],
    icon: "app",
  },
  {
    name: "A medida",
    price: 599,
    setup: 1290,
    description: "Para necesidades más específicas",
    features: [
      "Solución personalizada",
      "Integraciones a medida",
      "Acompañamiento dedicado",
      "Infraestructura escalable",
    ],
    icon: "custom",
  },
];
