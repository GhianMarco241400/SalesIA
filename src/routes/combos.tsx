import { createFileRoute } from '@tanstack/react-router';
import { Storefront } from '@/components/storefront';
export const Route = createFileRoute('/combos')({
 head: () => ({ meta: [{ title: 'Nuestros combos | Nexo Digital' }, { name: 'description', content: 'Arranque, Negocio, Crece y A medida: soluciones digitales para cada etapa.' }, { property: 'og:title', content: 'Nuestros combos | Nexo Digital' }, { property: 'og:description', content: 'Arranque, Negocio, Crece y A medida: soluciones digitales para cada etapa.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <Storefront view="combos"/>; }
