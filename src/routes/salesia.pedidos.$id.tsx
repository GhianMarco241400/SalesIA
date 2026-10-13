import { createFileRoute } from '@tanstack/react-router';
import { OrderDetail } from '@/components/sales-orders';
export const Route = createFileRoute('/salesia/pedidos/$id')({
 head: () => ({ meta: [{ title: 'Detalle del pedido SalesIA | Nexo Digital' }, { name: 'description', content: 'Revisa datos del cliente, precios y alertas de un pedido.' }, { property: 'og:title', content: 'Detalle del pedido SalesIA | Nexo Digital' }, { property: 'og:description', content: 'Revisa datos del cliente, precios y alertas de un pedido.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { const { id } = Route.useParams(); return <OrderDetail id={id}/>; }
