export const money = (n: number) => `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const combos = [
  { name: 'Arranque', price: 89, setup: 290, description: 'Para dar el primer paso digital', features: ['Página web informativa', 'Dominio propio incluido', 'Correo empresarial', 'Copias de seguridad'], icon: 'web' },
  { name: 'Negocio', price: 189, setup: 490, description: 'Para vender y recibir pedidos', features: ['Tienda o catálogo digital', 'Gestión de pedidos', 'Panel de administración', 'Todo lo de Arranque'], icon: 'shop' },
  { name: 'Crece', price: 349, setup: 790, description: 'Para llevar tu negocio más lejos', features: ['Página web + app móvil', 'App para Android y iOS', 'Soporte prioritario', 'Todo lo de Negocio'], icon: 'app' },
  { name: 'A medida', price: 599, setup: 1290, description: 'Para necesidades más específicas', features: ['Solución personalizada', 'Integraciones a medida', 'Acompañamiento dedicado', 'Infraestructura escalable'], icon: 'custom' },
];
export const orders = [
  { id: 'PED-0248', client: 'Café Tierra Andina', contact: 'Lucía Quispe', combo: 'Crece', total: 1239, status: 'Pendiente de revisión', risk: 'Medio', date: '13 oct 2026', initials: 'CT' },
  { id: 'PED-0247', client: 'Textiles Kantu', contact: 'Diego Salazar', combo: 'Negocio', total: 679, status: 'En revisión', risk: 'Bajo', date: '13 oct 2026', initials: 'TK' },
  { id: 'PED-0246', client: 'Mercado La Huerta', contact: 'Ana Flores', combo: 'Negocio', total: 679, status: 'Confirmado', risk: 'Bajo', date: '12 oct 2026', initials: 'MH' },
  { id: 'PED-0245', client: 'Estudio Prisma Sur', contact: 'Carlos Ríos', combo: 'A medida', total: 1889, status: 'Confirmado', risk: 'Bajo', date: '12 oct 2026', initials: 'EP' },
  { id: 'PED-0244', client: 'Panadería Miga Dorada', contact: 'Rosa Mendoza', combo: 'Arranque', total: 379, status: 'Confirmado', risk: 'Bajo', date: '11 oct 2026', initials: 'PM' },
  { id: 'PED-0243', client: 'Distribuidora Inti Norte', contact: 'Jorge Paredes', combo: 'Crece', total: 899, status: 'Rechazado', risk: 'Alto', date: '11 oct 2026', initials: 'DI' },
  { id: 'PED-0242', client: 'Florería Brisa Limeña', contact: 'Elena Torres', combo: 'Arranque', total: 379, status: 'Pendiente de revisión', risk: 'Bajo', date: '10 oct 2026', initials: 'FB' },
];
export const salesTrend = [{ name: '01 oct', actual: 2200, previous: 1700 }, { name: '03 oct', actual: 3800, previous: 2500 }, { name: '05 oct', actual: 3100, previous: 2800 }, { name: '07 oct', actual: 5800, previous: 3900 }, { name: '09 oct', actual: 5200, previous: 3200 }, { name: '11 oct', actual: 7400, previous: 4800 }, { name: '13 oct', actual: 9100, previous: 5500 }];
export const comboSales = [{ name: 'Arranque', value: 24 }, { name: 'Negocio', value: 42 }, { name: 'Crece', value: 31 }, { name: 'A medida', value: 12 }];