import { createFileRoute } from '@tanstack/react-router';
import { Analytics } from '@/components/sales-screens';
export const Route = createFileRoute('/salesia/analytics')({
 head: () => ({ meta: [{ title: 'Analytics SalesIA | Nexo Digital' }, { name: 'description', content: 'Analytics: información de ejemplo para la gestión empresarial.' }, { property: 'og:title', content: 'Analytics SalesIA | Nexo Digital' }, { property: 'og:description', content: 'Analytics: información de ejemplo para la gestión empresarial.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <Analytics/>; }
