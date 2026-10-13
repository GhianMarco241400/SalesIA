import { createFileRoute } from '@tanstack/react-router';
import { Bayes } from '@/components/sales-screens';
export const Route = createFileRoute('/salesia/bayes')({
 head: () => ({ meta: [{ title: 'Probabilidad y Bayes SalesIA | Nexo Digital' }, { name: 'description', content: 'Probabilidad y Bayes: información de ejemplo para la gestión empresarial.' }, { property: 'og:title', content: 'Probabilidad y Bayes SalesIA | Nexo Digital' }, { property: 'og:description', content: 'Probabilidad y Bayes: información de ejemplo para la gestión empresarial.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <Bayes/>; }
