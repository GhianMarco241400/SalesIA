import { createFileRoute } from '@tanstack/react-router';
import { Maintenance } from '@/components/sales-screens';
export const Route = createFileRoute('/salesia/productos')({
 head: () => ({ meta: [{ title: 'Productos SalesIA | Nexo Digital' }, { name: 'description', content: 'Mantenimiento de productos y registros de ejemplo.' }, { property: 'og:title', content: 'Productos SalesIA | Nexo Digital' }, { property: 'og:description', content: 'Mantenimiento de productos y registros de ejemplo.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <Maintenance type="Productos"/>; }
