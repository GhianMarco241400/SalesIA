import { createFileRoute } from '@tanstack/react-router';
import { Storefront } from '@/components/storefront';
export const Route = createFileRoute('/')({
 head: () => ({ meta: [{ title: 'Tu página web y tu app, listas para usar | Nexo Digital' }, { name: 'description', content: 'Combos digitales para pequeñas empresas peruanas. Precios claros en soles.' }, { property: 'og:title', content: 'Tu página web y tu app, listas para usar | Nexo Digital' }, { property: 'og:description', content: 'Combos digitales para pequeñas empresas peruanas. Precios claros en soles.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 
 component: Screen,
});
function Screen() { return <Storefront/>; }
