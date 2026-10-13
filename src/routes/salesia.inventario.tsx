import { createFileRoute } from '@tanstack/react-router';
import { Inventory } from '@/components/sales-screens';
export const Route = createFileRoute('/salesia/inventario')({
 head: () => ({ meta: [{ title: 'Inventario SalesIA | Nexo Digital' }, { name: 'description', content: 'Inventario: información de ejemplo para la gestión empresarial.' }, { property: 'og:title', content: 'Inventario SalesIA | Nexo Digital' }, { property: 'og:description', content: 'Inventario: información de ejemplo para la gestión empresarial.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <Inventory/>; }
