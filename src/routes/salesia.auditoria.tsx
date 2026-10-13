import { createFileRoute } from '@tanstack/react-router';
import { Audit } from '@/components/sales-screens';
export const Route = createFileRoute('/salesia/auditoria')({
 head: () => ({ meta: [{ title: 'Auditoría SalesIA | Nexo Digital' }, { name: 'description', content: 'Auditoría: información de ejemplo para la gestión empresarial.' }, { property: 'og:title', content: 'Auditoría SalesIA | Nexo Digital' }, { property: 'og:description', content: 'Auditoría: información de ejemplo para la gestión empresarial.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <Audit/>; }
