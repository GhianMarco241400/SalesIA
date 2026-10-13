import { createFileRoute } from '@tanstack/react-router';
import { Storefront } from '@/components/storefront';
export const Route = createFileRoute('/personalizar')({
 head: () => ({ meta: [{ title: 'Personalizar y cotizar | Nexo Digital' }, { name: 'description', content: 'Configura tu combo digital y revisa tu cotización en soles.' }, { property: 'og:title', content: 'Personalizar y cotizar | Nexo Digital' }, { property: 'og:description', content: 'Configura tu combo digital y revisa tu cotización en soles.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
 validateSearch: (search: Record<string, unknown>) => ({ combo: typeof search['combo'] === "string" ? search['combo'] : "Negocio" }),
 component: Screen,
});
function Screen() { return <Storefront view="customize"/>; }
