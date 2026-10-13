import { createFileRoute } from '@tanstack/react-router';
import { Security } from '@/components/sales-screens';
export const Route = createFileRoute('/salesia/revision-ia')({
 head: () => ({ meta: [{ title: 'Revisión con IA SalesIA | Nexo Digital' }, { name: 'description', content: 'Revisión con IA: información de ejemplo para la gestión empresarial.' }, { property: 'og:title', content: 'Revisión con IA SalesIA | Nexo Digital' }, { property: 'og:description', content: 'Revisión con IA: información de ejemplo para la gestión empresarial.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <Security/>; }
