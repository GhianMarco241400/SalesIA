import { createFileRoute } from '@tanstack/react-router';
import { Reports } from '@/components/sales-screens';
export const Route = createFileRoute('/salesia/reportes')({
 head: () => ({ meta: [{ title: 'Reportes SalesIA | Nexo Digital' }, { name: 'description', content: 'Reportes: información de ejemplo para la gestión empresarial.' }, { property: 'og:title', content: 'Reportes SalesIA | Nexo Digital' }, { property: 'og:description', content: 'Reportes: información de ejemplo para la gestión empresarial.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <Reports/>; }
