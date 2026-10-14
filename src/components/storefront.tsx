import { Link, getRouteApi, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, Check, Globe, ShoppingBag, Smartphone, Settings2, ShieldCheck, ReceiptText, Headphones, ChevronRight, CheckCircle2, LockKeyhole, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo, DemoNotice } from '@/components/demo-ui';
import { combos, money } from '@/lib/demo-data';
import { useExtras, usePlans } from '@/hooks/use-catalog';
import { ApiError, createOrder } from '@/services/api';
import { FIELD_MESSAGES, validateOrderForm, type OrderFormValues } from '@/lib/validation';
import type { FieldErrors, OrderPayload, OrderResponse, Plan } from '@/types/api';
import hero from '@/assets/storefront.jpg';

export const ORDER_STORAGE_KEY = 'nexo:last-order';
const BASE_COMBO_NAMES: string[] = ['Arranque', 'Negocio', 'Crece'];
const COMBO_CODES: Record<string, string> = {
  Arranque: 'arranque',
  Negocio: 'negocio',
  Crece: 'crece',
  'A medida': 'a-medida',
};

function planForCombo(plans: Plan[] | undefined, comboName: string): Plan | undefined {
  const code = COMBO_CODES[comboName];
  if (!code || !plans) return undefined;
  return plans.find((plan) => plan.code === code);
}

export function PublicHeader() { return <header className="border-b bg-background"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10"><Link to="/"><Logo/></Link><nav className="flex items-center gap-7 text-sm"><Link to="/" activeOptions={{ exact: true }} activeProps={{ className: 'text-primary font-semibold' }} className="hidden sm:block">Inicio</Link><Link to="/combos" activeProps={{ className: 'text-primary font-semibold' }}>Nuestros combos</Link><Button asChild className="hidden sm:inline-flex"><Link to="/personalizar" search={{combo: "Negocio"}}>Cotiza tu proyecto <ArrowRight/></Link></Button></nav></div></header>; }
function PublicFooter() { return <footer className="mt-16 border-t"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-8 py-7"><Logo/><span className="text-xs text-muted-foreground">© 2026 Nexo Digital · Hecho para negocios peruanos</span><DemoNotice/></div></footer>; }
export function Storefront({ view = 'home' }: { view?: string }) { return <><PublicHeader/><main>{view === 'home' ? <Home/> : view === 'combos' ? <ComboScreen/> : view === 'confirmation' ? <Confirmation/> : <Customize/>}</main><PublicFooter/></>; }
function Home() { return <><section className="public-hero relative overflow-hidden bg-muted"><img src={hero} width={1536} height={1024} className="hero-photo" alt="Página web y aplicación de una tienda en una computadora y un teléfono"/><div className="relative mx-auto flex h-full max-w-7xl items-center px-6 lg:px-10"><div className="max-w-lg"><div className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary"><span className="h-px w-7 bg-primary"/>Tu negocio, en digital</div><h1 className="font-display text-[44px] font-bold leading-[1.2] md:text-[48px]">Tu página web y tu app,<br/><span className="text-primary">listas para usar.</span></h1><p className="mt-6 max-w-sm text-base leading-7 text-muted-foreground">El siguiente paso de tu negocio no tiene que ser complicado. Elige un combo, hazlo tuyo y empieza a crecer.</p><Button asChild size="lg" className="mt-7 h-12 px-6"><Link to="/combos">Ver combos <ArrowRight/></Link></Button><p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Check size={14}/>Sin sorpresas. Sin complicaciones.</p></div></div></section><section className="border-y"><div className="mx-auto grid max-w-7xl gap-7 px-8 py-7 md:grid-cols-3">{[[ReceiptText,'Precio fijo en soles','Sabes cuánto pagas, todos los meses.'],[ShieldCheck,'Boleta y pago local','Paga con Yape, tarjeta o transferencia.'],[Headphones,'Soporte en español','Un equipo que entiende tu negocio.']].map(([Icon,title,desc]) => { const I = Icon as typeof ReceiptText; return <div key={String(title)} className="flex items-center gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-secondary text-primary"><I size={22}/></span><div><h3 className="text-sm font-semibold">{String(title)}</h3><p className="mt-1 text-xs text-muted-foreground">{String(desc)}</p></div></div>; })}</div></section><section className="mx-auto max-w-7xl px-6 pt-14 lg:px-10"><div className="mb-8 flex flex-wrap items-end justify-between gap-3"><div><div className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Una solución para cada etapa</div><h2 className="font-display text-3xl font-semibold">Un combo que crece contigo</h2><p className="mt-3 text-sm text-muted-foreground">Lo que necesitas para empezar. Y lo que viene después.</p></div><Link to="/combos" className="flex items-center gap-2 text-sm font-medium text-primary">Comparar combos <ArrowRight size={16}/></Link></div><ComboCards/></section></>; }
function ComboCards() {
  const { data: plans, isLoading, isError, refetch } = usePlans();
  const icons = [Globe, ShoppingBag, Smartphone, Settings2];

  if (isLoading) {
    return <div className="flex items-center justify-center gap-2 rounded-md border border-border bg-background p-10 text-sm text-muted-foreground"><Loader2 size={18} className="animate-spin text-primary"/>Cargando combos…</div>;
  }

  if (isError) {
    return <div className="rounded-md border border-border bg-background p-8 text-center"><p className="text-sm text-muted-foreground">No pudimos cargar los combos.</p><Button variant="outline" className="mt-4" onClick={() => void refetch()}>Reintentar</Button></div>;
  }

  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{combos.map((c,i) => {const Icon=icons[i]; const plan=planForCombo(plans, c.name); return <article key={c.name} className={`relative flex flex-col rounded-md border bg-background p-6 ${i===1?'border-primary':'border-border'}`}>{i===1 && <span className="absolute -top-3 right-4 rounded bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground">EL MÁS ELEGIDO</span>}<span className="mb-5 flex size-10 items-center justify-center rounded bg-secondary text-primary">{Icon && <Icon size={22}/>}</span><h3 className="font-display text-xl font-semibold">{c.name}</h3><p className="mt-2 min-h-9 text-xs text-muted-foreground">{c.description}</p>{plan ? <><div className="mb-2 mt-5"><span className="font-display text-3xl font-bold">{money(plan.monthly_price)}</span><span className="ml-1 text-xs text-muted-foreground">/ mes</span></div><p className="text-xs text-muted-foreground">Armado único: {money(plan.setup_price)}</p></> : <><div className="mb-2 mt-5"><span className="font-display text-3xl font-bold">—</span><span className="ml-1 text-xs text-muted-foreground">/ mes</span></div><p className="text-xs text-muted-foreground">Precio no disponible</p></>}{c.name === 'A medida' && <p className="mt-2 text-[11px] font-medium text-primary">Por ahora se arma sobre un combo base.</p>}<div className="my-6 h-px bg-border"/><ul className="mb-7 space-y-3">{c.features.map(f=><li key={f} className="flex items-center gap-2 text-xs"><Check size={14} className="text-primary"/>{f}</li>)}</ul><Button asChild variant={i===1?'default':'outline'} className="mt-auto w-full"><Link to="/personalizar" search={{ combo: c.name }}>Elegir {c.name}<ArrowRight/></Link></Button></article>;})}</div>;
}
function ComboScreen() { const [server,setServer]=useState(false); return <section className="mx-auto max-w-7xl px-6 pt-12 lg:px-10"><div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><p className="mb-3 text-xs uppercase tracking-widest text-primary">Nuestros combos</p><h1 className="font-display text-4xl font-bold">Tu próxima etapa empieza aquí.</h1><p className="mt-4 text-muted-foreground">Precios claros, herramientas listas y acompañamiento real.</p></div><div className="flex rounded-md border bg-muted p-1">{['Sin servidor','Con servidor'].map((s,i)=><Button key={s} variant={server===Boolean(i)?'default':'ghost'} size="sm" onClick={()=>setServer(Boolean(i))}>{s}</Button>)}</div></div>{server && <p className="mb-5 rounded border border-border bg-secondary p-4 text-sm text-primary">Infraestructura dedicada desde S/ 45 al mes. El estimado se muestra en tu cotización.</p>}<ComboCards/><p className="mt-8 text-center text-xs text-muted-foreground">Precios de ejemplo en soles. Incluyen IGV. Todos los combos incluyen soporte en español.</p></section>; }

export function FormField({ label, value, onChange, error, placeholder, type = 'text', inputMode, maxLength }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  placeholder?: string | undefined;
  type?: string | undefined;
  inputMode?: 'numeric' | 'text' | 'tel' | 'email' | undefined;
  maxLength?: number | undefined;
}) {
  return <label className="text-xs text-muted-foreground">{label}<input className="field mt-2" placeholder={placeholder} type={type} inputMode={inputMode} maxLength={maxLength} value={value} onChange={(event)=>onChange(event.target.value)}/>{error && <span className="mt-1 block text-[11px] text-destructive">{error}</span>}</label>;
}

function Customize() {
  const search = getRouteApi('/personalizar').useSearch();
  const navigate = useNavigate();
  const plansQuery = usePlans();
  const extrasQuery = useExtras();

  const requestedCombo = search.combo && BASE_COMBO_NAMES.includes(search.combo) ? search.combo : 'Negocio';
  const [name, setName] = useState(requestedCombo);
  const [storage, setStorage] = useState('10 GB');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [form, setForm] = useState<OrderFormValues>({ company_name: '', ruc: '', contact_name: '', email: '', phone: '', region: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const c = combos.find((combo) => combo.name === name) ?? combos[1];
  const plan = planForCombo(plansQuery.data, name);
  const extrasAvailable = extrasQuery.data ?? [];
  const selectedExtraObjects = extrasAvailable.filter((extra) => selectedExtras.includes(extra.code));
  const comboMonthly = plan?.monthly_price ?? 0;
  const comboSetup = plan?.setup_price ?? 0;
  const extrasMonthly = selectedExtraObjects.reduce((sum, extra) => sum + extra.monthly_price, 0);
  const extrasSetup = selectedExtraObjects.reduce((sum, extra) => sum + extra.setup_price, 0);
  const monthly = comboMonthly + extrasMonthly;
  const setupTotal = comboSetup + extrasSetup;

  if (!c) return null;

  const updateField = (field: keyof OrderFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleExtra = (code: string) => {
    setSelectedExtras((prev) => {
      if (prev.includes(code)) return prev.filter((item) => item !== code);
      if (prev.length >= 10) return prev;
      return [...prev, code];
    });
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setFormError('');
    const validation = validateOrderForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    if (!plan) {
      setErrors({ plan_code: FIELD_MESSAGES['plan_code'] ?? 'Selecciona un combo disponible.' });
      return;
    }
    setErrors({});
    const payload: OrderPayload = {
      company_name: form.company_name.trim(),
      ruc: form.ruc.trim(),
      contact_name: form.contact_name.trim(),
      email: form.email.trim(),
      plan_code: plan.code,
    };
    const phone = form.phone.trim();
    if (phone) payload.phone = phone;
    const region = form.region.trim();
    if (region) payload.region = region;
    if (selectedExtras.length > 0) payload.extra_codes = selectedExtras;

    setSubmitting(true);
    try {
      const order = await createOrder(payload);
      try {
        sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
      } catch {
        // almacenamiento no disponible: la confirmación redirigirá al inicio
      }
      await navigate({ to: '/confirmacion' });
    } catch (error) {
      if (error instanceof ApiError) {
        if (Object.keys(error.fieldErrors).length > 0) setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
        setFormError(error.message);
      } else {
        setFormError('Ocurrió un error inesperado. Inténtalo de nuevo.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return <section className="mx-auto max-w-6xl px-6 pt-10"><div className="mb-8 flex items-center gap-2 text-xs text-muted-foreground"><Link to="/combos">Combos</Link><ChevronRight size={13}/>Personalizar y cotizar</div><h1 className="font-display text-3xl font-bold">Hagámoslo a tu medida</h1><p className="mb-8 mt-3 text-sm text-muted-foreground">Elige los detalles de tu solución digital.</p>{search.combo && !BASE_COMBO_NAMES.includes(search.combo) && <p className="mb-8 rounded border border-border bg-secondary p-4 text-sm text-primary">El combo «{search.combo}» todavía no se contrata directo. Por ahora se arma sobre un combo base: elige Arranque, Negocio o Crece.</p>}<form onSubmit={handleSubmit} noValidate><div className="grid gap-10 lg:grid-cols-[1fr_360px]"><div><section className="border-b py-5"><label className="font-semibold">01 · Tu combo</label>{plansQuery.isLoading ? <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={16} className="animate-spin text-primary"/>Cargando combos…</p> : plansQuery.isError ? <div className="mt-4 rounded border border-border bg-secondary/50 p-4 text-sm"><p className="text-muted-foreground">No pudimos cargar los combos.</p><Button type="button" variant="outline" size="sm" className="mt-3" onClick={()=>void plansQuery.refetch()}>Reintentar</Button></div> : <div className="mt-4 grid grid-cols-2 gap-3">{combos.filter((combo)=>BASE_COMBO_NAMES.includes(combo.name)).map((combo)=>{const comboPlan=planForCombo(plansQuery.data, combo.name); return <Button type="button" variant={name===combo.name?'default':'outline'} key={combo.name} onClick={()=>setName(combo.name)}>{combo.name} · {comboPlan ? money(comboPlan.monthly_price) : '—'}</Button>;})}</div>}{errors['plan_code'] && <span className="mt-2 block text-[11px] text-destructive">{errors['plan_code']}</span>}</section><section className="border-b py-6"><label className="text-sm font-semibold" htmlFor="storage">02 · Almacenamiento</label><p className="my-2 text-xs text-muted-foreground">Espacio para tus fotos, productos y documentos.</p><select id="storage" className="field" value={storage} onChange={e=>setStorage(e.target.value)}><option>10 GB</option><option>50 GB</option><option>100 GB</option></select></section><section className="space-y-6 py-6">{extrasQuery.isLoading ? <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={16} className="animate-spin text-primary"/>Cargando extras…</p> : extrasQuery.isError ? <div className="rounded border border-border bg-secondary/50 p-4 text-sm"><p className="text-muted-foreground">No pudimos cargar los extras.</p><Button type="button" variant="outline" size="sm" className="mt-3" onClick={()=>void extrasQuery.refetch()}>Reintentar</Button></div> : extrasAvailable.length === 0 ? <p className="text-sm text-muted-foreground">No hay extras disponibles por ahora.</p> : extrasAvailable.map((extra)=><label key={extra.code} className="flex items-center justify-between gap-5"><span><span className="text-sm font-semibold">{extra.name}</span><span className="mt-2 block text-xs text-muted-foreground">{extra.description ? `${extra.description} · ` : ''}{money(extra.monthly_price)} / mes{extra.setup_price > 0 ? ` · Armado ${money(extra.setup_price)}` : ''}</span></span><input aria-label={extra.name} type="checkbox" className="size-5 accent-primary" checked={selectedExtras.includes(extra.code)} onChange={()=>toggleExtra(extra.code)}/></label>)}{errors['extra_codes'] && <span className="block text-[11px] text-destructive">{errors['extra_codes']}</span>}</section><section className="border-t pt-6"><h2 className="mb-4 font-semibold">03 · Datos de tu empresa</h2><div className="grid gap-4 sm:grid-cols-2"><FormField label="Razón social" value={form.company_name} onChange={(v)=>updateField('company_name', v)} error={errors['company_name']} placeholder="Nombre de la empresa"/><FormField label="RUC" value={form.ruc} onChange={(v)=>updateField('ruc', v)} error={errors['ruc']} placeholder="11 dígitos" inputMode="numeric" maxLength={11}/><FormField label="Nombre de contacto" value={form.contact_name} onChange={(v)=>updateField('contact_name', v)} error={errors['contact_name']} placeholder="Nombre de contacto"/><FormField label="Correo electrónico" value={form.email} onChange={(v)=>updateField('email', v)} error={errors['email']} placeholder="correo@empresa.com" type="email"/><FormField label="Teléfono (opcional)" value={form.phone} onChange={(v)=>updateField('phone', v)} error={errors['phone']} placeholder="+51 900 000 000" type="tel" maxLength={20}/><FormField label="Región (opcional)" value={form.region} onChange={(v)=>updateField('region', v)} error={errors['region']} placeholder="Lima" maxLength={100}/></div></section><section className="rounded-md border bg-secondary/50 p-6"><h2 className="font-display text-lg font-semibold">¿Necesitas algo más específico?</h2><p className="mt-2 text-xs text-muted-foreground">Para elegir servidores y regiones al detalle, con precios de AWS. Se abre dentro de esta misma página.</p><Button asChild variant="outline" className="mt-4"><Link to="/cotizar">Cotizador avanzado <ArrowRight/></Link></Button></section></div><aside className="h-fit rounded-md border bg-muted p-6 lg:sticky lg:top-6"><h2 className="font-display text-lg font-semibold">Tu cotización</h2><div className="my-5 space-y-4 border-y py-5 text-sm"><div className="flex justify-between"><span>Combo {c.name}</span><span>{money(comboMonthly)}</span></div><div className="flex justify-between"><span>Extras</span><span>{money(extrasMonthly)}</span></div></div><div className="flex justify-between text-sm font-semibold"><span>Mensualidad</span><span>{money(monthly)}</span></div><div className="mt-4 flex justify-between text-xs text-muted-foreground"><span>Pago único de armado</span><span>{money(setupTotal)}</span></div><div className="my-6 flex justify-between border-t pt-5"><span className="font-semibold">Total inicial</span><span className="text-2xl font-bold text-primary">{money(monthly+setupTotal)}</span></div>{formError && <div role="alert" className="mb-4 flex items-start gap-2 rounded border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive"><AlertCircle size={15} className="mt-0.5 shrink-0"/><span>{formError}</span></div>}<Button type="submit" className="w-full" disabled={submitting || plansQuery.isLoading}>{submitting ? <><Loader2 size={16} className="animate-spin"/>Enviando…</> : <>Contratar <ArrowRight/></>}</Button><p className="mt-4 flex items-center justify-center gap-1 text-[10px] text-muted-foreground"><LockKeyhole size={12}/>Sin cobros en esta demostración</p></aside></div></form></section>;
}

function Confirmation() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let stored: OrderResponse | null = null;
    try {
      const raw = sessionStorage.getItem(ORDER_STORAGE_KEY);
      stored = raw ? (JSON.parse(raw) as OrderResponse) : null;
    } catch {
      stored = null;
    }
    setOrder(stored);
    setChecked(true);
    if (!stored) void navigate({ to: '/' });
  }, [navigate]);

  if (!checked || !order) return null;

  return <section className="mx-auto max-w-xl px-6 py-24 text-center"><CheckCircle2 size={58} className="mx-auto text-success"/><h1 className="mt-7 font-display text-3xl font-bold">Recibimos tu pedido</h1><p className="mt-4 leading-7 text-muted-foreground">Nuestro equipo revisará tu cotización y se pondrá en contacto contigo para dar el siguiente paso.</p><p className="my-8 rounded border bg-muted p-4 text-sm">Pedido <strong>{order.code}</strong> · {order.status}</p><div className="mx-auto mb-8 max-w-sm space-y-3 rounded border bg-muted p-4 text-left text-sm"><div className="flex justify-between gap-4"><span className="text-muted-foreground">Combo</span><span className="font-medium">{order.plan.name}</span></div><div className="flex justify-between gap-4"><span className="text-muted-foreground">Extras</span><span className="text-right font-medium">{order.extras.length > 0 ? order.extras.map((extra)=>extra.name).join(', ') : 'Sin extras'}</span></div><div className="flex justify-between gap-4"><span className="text-muted-foreground">Mensualidad</span><span className="font-medium">{money(order.monthly_total)}</span></div><div className="flex justify-between gap-4"><span className="text-muted-foreground">Pago único de armado</span><span className="font-medium">{money(order.setup_total)}</span></div></div><Button asChild><Link to="/">Volver al inicio <ArrowRight/></Link></Button></section>;
}
