import { createFileRoute } from '@tanstack/react-router';
import { Maintenance } from '@/components/sales-screens';
export const Route = createFileRoute('/salesia/clientes')({
 head: () => ({ meta: [{ title: 'Clientes SalesIA | Nexo Digital' }, { name: 'description', content: 'Mantenimiento de clientes y registros de ejemplo.' }, { property: 'og:title', content: 'Clientes SalesIA | Nexo Digital' }, { property: 'og:description', content: 'Mantenimiento de clientes y registros de ejemplo.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <Maintenance type="Clientes"/>; }
