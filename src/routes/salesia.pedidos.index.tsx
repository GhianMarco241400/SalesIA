import { createFileRoute } from '@tanstack/react-router';
import { OrdersScreen } from '@/components/sales-orders';
export const Route = createFileRoute('/salesia/pedidos/')({
 head: () => ({ meta: [{ title: 'Pedidos SalesIA | Nexo Digital' }, { name: 'description', content: 'Revisión y seguimiento de pedidos empresariales.' }, { property: 'og:title', content: 'Pedidos SalesIA | Nexo Digital' }, { property: 'og:description', content: 'Revisión y seguimiento de pedidos empresariales.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <OrdersScreen/>; }
