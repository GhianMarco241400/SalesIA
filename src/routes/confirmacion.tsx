import { createFileRoute } from '@tanstack/react-router';
import { Storefront } from '@/components/storefront';
export const Route = createFileRoute('/confirmacion')({
 head: () => ({ meta: [{ title: 'Recibimos tu pedido | Nexo Digital' }, { name: 'description', content: 'Confirmación visual de tu pedido de solución digital.' }, { property: 'og:title', content: 'Recibimos tu pedido | Nexo Digital' }, { property: 'og:description', content: 'Confirmación visual de tu pedido de solución digital.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <Storefront view="confirmation"/>; }
