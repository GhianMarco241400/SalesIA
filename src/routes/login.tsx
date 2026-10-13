import { createFileRoute } from '@tanstack/react-router';
import { LoginScreen } from '@/components/sales-screens';
export const Route = createFileRoute('/login')({
 head: () => ({ meta: [{ title: 'Ingresar a SalesIA | Nexo Digital' }, { name: 'description', content: 'Acceso visual para el equipo de Nexo Digital.' }, { property: 'og:title', content: 'Ingresar a SalesIA | Nexo Digital' }, { property: 'og:description', content: 'Acceso visual para el equipo de Nexo Digital.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <LoginScreen/>; }
