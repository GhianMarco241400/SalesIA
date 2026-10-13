import { createFileRoute } from '@tanstack/react-router';
import { SalesScreen } from '@/components/sales-screens';
export const Route = createFileRoute('/salesia/ventas')({
 head: () => ({ meta: [{ title: 'Ventas SalesIA | Nexo Digital' }, { name: 'description', content: 'Ventas: información de ejemplo para la gestión empresarial.' }, { property: 'og:title', content: 'Ventas SalesIA | Nexo Digital' }, { property: 'og:description', content: 'Ventas: información de ejemplo para la gestión empresarial.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <SalesScreen/>; }
