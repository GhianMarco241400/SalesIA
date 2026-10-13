import { createFileRoute } from '@tanstack/react-router';
import { Dashboard } from '@/components/sales-dashboard';
export const Route = createFileRoute('/salesia/')({
 head: () => ({ meta: [{ title: 'Dashboard SalesIA | Nexo Digital' }, { name: 'description', content: 'Resumen de ventas, pedidos y clientes del equipo.' }, { property: 'og:title', content: 'Dashboard SalesIA | Nexo Digital' }, { property: 'og:description', content: 'Resumen de ventas, pedidos y clientes del equipo.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <Dashboard/>; }
