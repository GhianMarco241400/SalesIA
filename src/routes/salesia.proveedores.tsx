import { createFileRoute } from '@tanstack/react-router';
import { Maintenance } from '@/components/sales-screens';
export const Route = createFileRoute('/salesia/proveedores')({
 head: () => ({ meta: [{ title: 'Proveedores SalesIA | Nexo Digital' }, { name: 'description', content: 'Mantenimiento de proveedores y registros de ejemplo.' }, { property: 'og:title', content: 'Proveedores SalesIA | Nexo Digital' }, { property: 'og:description', content: 'Mantenimiento de proveedores y registros de ejemplo.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <Maintenance type="Proveedores"/>; }
