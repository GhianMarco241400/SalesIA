import { createFileRoute } from '@tanstack/react-router';
import { Insights } from '@/components/sales-screens';
export const Route = createFileRoute('/salesia/insights')({
 head: () => ({ meta: [{ title: 'Insights SalesIA | Nexo Digital' }, { name: 'description', content: 'Insights: información de ejemplo para la gestión empresarial.' }, { property: 'og:title', content: 'Insights SalesIA | Nexo Digital' }, { property: 'og:description', content: 'Insights: información de ejemplo para la gestión empresarial.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <Insights/>; }
