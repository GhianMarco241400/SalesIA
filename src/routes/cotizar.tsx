import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ChangeEvent } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Bell,
  ChevronRight,
  Cloud,
  Database,
  Globe,
  HardDrive,
  Loader2,
  Network,
  RefreshCw,
  Server,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { PublicHeader, FormField, ORDER_STORAGE_KEY } from "@/components/storefront";
import { Button } from "@/components/ui/button";
import { useAwsRegions, useAwsServices } from "@/hooks/use-catalog";
import { createOrder, ApiError, postAwsQuote } from "@/services/api";
import { validateOrderForm, type OrderFormValues } from "@/lib/validation";
import type {
  AwsService,
  FieldErrors,
  OrderPayload,
  QuoteComponent,
  QuoteRequest,
  QuoteResponse,
  QuoteServiceSpec,
} from "@/types/api";

const AWS_STALE_TIME = 30 * 60 * 1000;

const usdFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

type ParamValue = string | number | boolean;

interface FieldDef {
  key: string;
  label: string;
  type: "number" | "select" | "checkbox";
  options?: { value: string; label: string }[];
  min?: number;
  step?: number;
  suffix?: string;
}

interface ServiceDef {
  code: string;
  icon: LucideIcon;
  blurb: string;
  fields: FieldDef[];
  defaults: Record<string, ParamValue>;
}

const SERVICE_DEFS: ServiceDef[] = [
  {
    code: "ec2",
    icon: Server,
    blurb: "Servidores virtuales para tus aplicaciones.",
    fields: [
      {
        key: "instanceType",
        label: "Tipo de instancia",
        type: "select",
        options: ["t3.micro", "t3.small", "t3.medium", "t3.large", "m5.large", "m5.xlarge"].map(
          (value) => ({ value, label: value }),
        ),
      },
      {
        key: "os",
        label: "Sistema operativo",
        type: "select",
        options: [
          { value: "linux", label: "Linux" },
          { value: "windows", label: "Windows" },
        ],
      },
      { key: "instanceCount", label: "Instancias", type: "number", min: 1, step: 1 },
      { key: "hoursPerMonth", label: "Horas al mes", type: "number", min: 1, step: 1, suffix: "h" },
    ],
    defaults: { instanceType: "t3.small", os: "linux", instanceCount: 1, hoursPerMonth: 730 },
  },
  {
    code: "rds",
    icon: Database,
    blurb: "Base de datos administrada y respaldos.",
    fields: [
      {
        key: "instanceType",
        label: "Tipo de instancia",
        type: "select",
        options: ["db.t3.micro", "db.t3.small", "db.t3.medium", "db.m5.large"].map((value) => ({
          value,
          label: value,
        })),
      },
      {
        key: "engine",
        label: "Motor",
        type: "select",
        options: [
          { value: "postgresql", label: "PostgreSQL" },
          { value: "mysql", label: "MySQL" },
        ],
      },
      { key: "multiAz", label: "Alta disponibilidad (Multi-AZ)", type: "checkbox" },
      { key: "storageGb", label: "Almacenamiento", type: "number", min: 20, step: 1, suffix: "GB" },
    ],
    defaults: { instanceType: "db.t3.small", engine: "postgresql", multiAz: false, storageGb: 20 },
  },
  {
    code: "s3",
    icon: HardDrive,
    blurb: "Almacenamiento de archivos e imágenes.",
    fields: [
      {
        key: "storageClass",
        label: "Clase de almacenamiento",
        type: "select",
        options: [
          { value: "standard", label: "Standard" },
          { value: "standard-ia", label: "Standard-IA" },
          { value: "glacier", label: "Glacier" },
        ],
      },
      { key: "storageGb", label: "Almacenamiento", type: "number", min: 1, step: 1, suffix: "GB" },
    ],
    defaults: { storageClass: "standard", storageGb: 20 },
  },
  {
    code: "cloudfront",
    icon: Network,
    blurb: "Red de entrega de contenido global (CDN).",
    fields: [
      {
        key: "dataOutGb",
        label: "Transferencia mensual",
        type: "number",
        min: 1,
        step: 1,
        suffix: "GB",
      },
    ],
    defaults: { dataOutGb: 50 },
  },
  {
    code: "route53",
    icon: Globe,
    blurb: "DNS y dominios con consultas gestionadas.",
    fields: [
      { key: "zones", label: "Zonas alojadas", type: "number", min: 1, step: 1 },
      {
        key: "queriesMillions",
        label: "Consultas",
        type: "number",
        min: 0,
        step: 1,
        suffix: "millones",
      },
    ],
    defaults: { zones: 1, queriesMillions: 1 },
  },
  {
    code: "lambda",
    icon: Zap,
    blurb: "Funciones serverless por ejecución.",
    fields: [
      {
        key: "requestsMillions",
        label: "Invocaciones",
        type: "number",
        min: 0,
        step: 1,
        suffix: "millones",
      },
      { key: "gbSeconds", label: "Cómputo", type: "number", min: 0, step: 1000, suffix: "GB-s" },
    ],
    defaults: { requestsMillions: 1, gbSeconds: 100000 },
  },
  {
    code: "dynamodb",
    icon: Database,
    blurb: "Base de datos NoSQL para alta demanda.",
    fields: [
      { key: "storageGb", label: "Almacenamiento", type: "number", min: 1, step: 1, suffix: "GB" },
      {
        key: "readCapacityUnits",
        label: "Lectura",
        type: "number",
        min: 1,
        step: 1,
        suffix: "RCU",
      },
      {
        key: "writeCapacityUnits",
        label: "Escritura",
        type: "number",
        min: 1,
        step: 1,
        suffix: "WCU",
      },
    ],
    defaults: { storageGb: 5, readCapacityUnits: 5, writeCapacityUnits: 5 },
  },
  {
    code: "sns",
    icon: Bell,
    blurb: "Notificaciones y mensajería.",
    fields: [
      {
        key: "requestsMillions",
        label: "Notificaciones",
        type: "number",
        min: 0,
        step: 1,
        suffix: "millones",
      },
    ],
    defaults: { requestsMillions: 1 },
  },
];

const SERVICE_BY_CODE = new Map(SERVICE_DEFS.map((def) => [def.code, def]));

const COMBO_OPTIONS = [
  { code: "arranque", name: "Arranque", blurb: "Tu primer paso digital." },
  { code: "negocio", name: "Negocio", blurb: "Vende y recibe pedidos." },
  { code: "crece", name: "Crece", blurb: "Web + app móvil." },
];

type CustomState = Record<string, { enabled: boolean; params: Record<string, ParamValue> }>;

function buildInitialCustomState(): CustomState {
  const state: CustomState = {};
  for (const def of SERVICE_DEFS) state[def.code] = { enabled: false, params: { ...def.defaults } };
  return state;
}

export const Route = createFileRoute("/cotizar")({
  head: () => ({
    meta: [
      { title: "Cotizador avanzado | Nexo Digital" },
      {
        name: "description",
        content: "Cotizador avanzado con precios en vivo de AWS para tu proyecto.",
      },
      { property: "og:title", content: "Cotizador avanzado | Nexo Digital" },
      {
        property: "og:description",
        content: "Cotizador avanzado con precios en vivo de AWS para tu proyecto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),

  component: Screen,
});

function Screen() {
  const navigate = useNavigate();
  const regionsQuery = useAwsRegions();
  const servicesQuery = useAwsServices();

  const [regionCode, setRegionCode] = useState("us-east-1");
  const [mode, setMode] = useState<"combo" | "custom">("combo");
  const [comboCode, setComboCode] = useState("negocio");
  const [custom, setCustom] = useState<CustomState>(buildInitialCustomState);

  const availableServices: AwsService[] = useMemo(() => {
    const known = (servicesQuery.data ?? []).filter((service) => SERVICE_BY_CODE.has(service.code));
    return known.length > 0
      ? known
      : SERVICE_DEFS.map((def) => ({
          code: def.code,
          name: def.code,
          category: "",
          description: null,
        }));
  }, [servicesQuery.data]);

  const enabledServices = useMemo<QuoteServiceSpec[]>(
    () =>
      availableServices
        .filter((service) => custom[service.code]?.enabled)
        .map((service) => ({
          service_code: service.code,
          params: custom[service.code]?.params ?? {},
        })),
    [availableServices, custom],
  );

  const request = useMemo<QuoteRequest>(
    () =>
      mode === "combo"
        ? { plan_code: comboCode, region_code: regionCode }
        : { services: enabledServices, region_code: regionCode },
    [mode, comboCode, enabledServices, regionCode],
  );

  const quoteEnabled = mode === "combo" || enabledServices.length > 0;

  const quoteQuery = useQuery({
    queryKey: ["aws-quote", request],
    queryFn: () => postAwsQuote(request),
    staleTime: AWS_STALE_TIME,
    enabled: quoteEnabled,
    placeholderData: keepPreviousData,
  });

  const updateParam = (serviceCode: string, key: string, value: ParamValue) => {
    setCustom((prev) => {
      const current = prev[serviceCode] ?? { enabled: false, params: {} };
      return {
        ...prev,
        [serviceCode]: { ...current, params: { ...current.params, [key]: value } },
      };
    });
  };

  const toggleService = (serviceCode: string) => {
    setCustom((prev) => {
      const current = prev[serviceCode] ?? { enabled: false, params: {} };
      return { ...prev, [serviceCode]: { ...current, enabled: !current.enabled } };
    });
  };

  const quote = quoteQuery.data;

  const [form, setForm] = useState<OrderFormValues>({
    company_name: "",
    ruc: "",
    contact_name: "",
    email: "",
    phone: "",
    region: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const updateField = (key: keyof OrderFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleContract = async () => {
    setFormError("");
    const validation = validateOrderForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});

    const regionName = (regionsQuery.data ?? []).find((region) => region.code === regionCode)?.name;
    const payload: OrderPayload = {
      company_name: form.company_name.trim(),
      ruc: form.ruc.trim(),
      contact_name: form.contact_name.trim(),
      email: form.email.trim(),
      plan_code: comboCode,
      region_code: regionCode,
    };
    const phone = form.phone.trim();
    if (phone) payload.phone = phone;
    if (regionName) payload.region = regionName;

    setSubmitting(true);
    try {
      const order = await createOrder(payload);
      try {
        sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
      } catch {
        // almacenamiento no disponible: la confirmación redirigirá al inicio
      }
      await navigate({ to: "/confirmacion" });
    } catch (error) {
      if (error instanceof ApiError) {
        if (Object.keys(error.fieldErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
        }
        setFormError(error.message);
      } else {
        setFormError("Ocurrió un error inesperado. Inténtalo de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="border-b">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-6 py-3 text-xs text-muted-foreground lg:px-10">
          <Link to="/personalizar" search={{ combo: "Negocio" }} className="hover:text-foreground">
            Mi cotización
          </Link>
          <ChevronRight size={13} />
          <span className="text-foreground">Cotizador avanzado</span>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:px-10">
        <div className="mb-8 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded border border-border bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
            <Cloud size={12} />
            PRECIOS EN VIVO DE AWS
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold">Cotizador avanzado</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Arma tu solución escogiendo un combo o combinando servicios de AWS. Calculamos el costo
            mensual de infraestructura con precios reales por región.
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <section className="border-b pb-6">
              <label className="text-sm font-semibold" htmlFor="region">
                01 · Región de AWS
              </label>
              <p className="mt-1 text-xs text-muted-foreground">
                Los precios varían según la ubicación de los servidores.
              </p>
              {regionsQuery.isLoading ? (
                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 size={16} className="animate-spin text-primary" />
                  Cargando regiones…
                </p>
              ) : regionsQuery.isError ? (
                <p className="mt-3 text-sm text-destructive">No pudimos cargar las regiones.</p>
              ) : (
                <select
                  id="region"
                  className="field mt-3"
                  value={regionCode}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setRegionCode(e.target.value)}
                >
                  {(regionsQuery.data ?? []).map((region) => (
                    <option key={region.code} value={region.code}>
                      {region.name ? `${region.name} (${region.code})` : region.code}
                    </option>
                  ))}
                </select>
              )}
            </section>

            <section className="border-b pb-6">
              <label className="text-sm font-semibold">02 · Cómo quieres cotizar</label>
              <div className="mt-3 flex gap-3">
                <Button
                  type="button"
                  variant={mode === "combo" ? "default" : "outline"}
                  onClick={() => setMode("combo")}
                >
                  Por combo
                </Button>
                <Button
                  type="button"
                  variant={mode === "custom" ? "default" : "outline"}
                  onClick={() => setMode("custom")}
                >
                  A medida
                </Button>
              </div>
            </section>

            {mode === "combo" ? (
              <section>
                <label className="text-sm font-semibold">03 · Elige tu combo</label>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {COMBO_OPTIONS.map((combo) => (
                    <button
                      key={combo.code}
                      type="button"
                      onClick={() => setComboCode(combo.code)}
                      className={`rounded-md border p-4 text-left transition ${
                        comboCode === combo.code
                          ? "border-primary bg-secondary"
                          : "border-border hover:border-primary/60"
                      }`}
                    >
                      <span className="block font-display text-base font-semibold">
                        {combo.name}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {combo.blurb}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              <section>
                <label className="text-sm font-semibold">03 · Servicios de AWS</label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Activa los servicios que necesitas y ajusta sus parámetros.
                </p>
                <div className="mt-4 space-y-3">
                  {availableServices.map((service) => {
                    const def = SERVICE_BY_CODE.get(service.code);
                    if (!def) return null;
                    const state = custom[service.code];
                    const Icon = def.icon;
                    return (
                      <div
                        key={service.code}
                        className={`rounded-md border p-4 transition ${state?.enabled ? "border-primary" : "border-border"}`}
                      >
                        <label className="flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            className="mt-1 accent-primary"
                            checked={state?.enabled ?? false}
                            onChange={() => toggleService(service.code)}
                          />
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                            <Icon size={18} />
                          </span>
                          <span className="flex-1">
                            <span className="block text-sm font-semibold capitalize">
                              {service.name || def.code}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {def.blurb}
                            </span>
                          </span>
                        </label>
                        {state?.enabled && (
                          <div className="mt-4 grid gap-4 border-t pt-4 sm:grid-cols-2">
                            {def.fields.map((field) => (
                              <label key={field.key} className="block text-xs font-medium">
                                {field.label}
                                {field.suffix ? ` (${field.suffix})` : ""}
                                {field.type === "checkbox" ? (
                                  <input
                                    type="checkbox"
                                    className="mt-2 block accent-primary"
                                    checked={Boolean(state.params[field.key])}
                                    onChange={(e) =>
                                      updateParam(service.code, field.key, e.target.checked)
                                    }
                                  />
                                ) : field.type === "select" ? (
                                  <select
                                    className="field mt-2"
                                    value={String(state.params[field.key] ?? "")}
                                    onChange={(e) =>
                                      updateParam(service.code, field.key, e.target.value)
                                    }
                                  >
                                    {(field.options ?? []).map((option) => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type="number"
                                    className="field mt-2"
                                    min={field.min}
                                    step={field.step}
                                    value={String(state.params[field.key] ?? "")}
                                    onChange={(e) =>
                                      updateParam(service.code, field.key, Number(e.target.value))
                                    }
                                  />
                                )}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <QuotePanel
              quote={quote}
              isLoading={quoteQuery.isLoading}
              isFetching={quoteQuery.isFetching}
              isError={quoteQuery.isError}
              disabled={!quoteEnabled}
              onRetry={() => void quoteQuery.refetch()}
            />
            {mode === "combo" ? (
              <ContractCard
                comboName={COMBO_OPTIONS.find((combo) => combo.code === comboCode)?.name ?? "Combo"}
                disabled={quoteQuery.isLoading || quoteQuery.isError}
                form={form}
                errors={errors}
                formError={formError}
                submitting={submitting}
                showForm={showForm}
                onToggleForm={() => setShowForm((value) => !value)}
                onFieldChange={updateField}
                onSubmit={handleContract}
              />
            ) : (
              <CustomCard
                disabled={!quoteEnabled}
                onGoToPersonalizar={() =>
                  void navigate({ to: "/personalizar", search: { combo: "Negocio" } })
                }
              />
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

function QuotePanel({
  quote,
  isLoading,
  isFetching,
  isError,
  disabled,
  onRetry,
}: {
  quote: QuoteResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  disabled: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-md border bg-background p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Tu cotización</h2>
        {isFetching && !isLoading && (
          <RefreshCw size={14} className="animate-spin text-muted-foreground" />
        )}
      </div>

      {disabled ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Activa al menos un servicio para ver el costo.
        </p>
      ) : isLoading ? (
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={16} className="animate-spin text-primary" />
          Calculando precios de AWS…
        </p>
      ) : isError ? (
        <div className="mt-6 rounded border border-border bg-secondary/50 p-4 text-sm">
          <p className="flex items-center gap-2 text-destructive">
            <AlertCircle size={16} />
            No pudimos calcular la cotización.
          </p>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onRetry}>
            Reintentar
          </Button>
        </div>
      ) : quote ? (
        <>
          <div className="mt-5">
            <p className="font-display text-3xl font-bold">
              {usdFormatter.format(quote.monthly_usd)}
            </p>
            {quote.monthly_pen != null && (
              <p className="mt-1 text-xs text-muted-foreground">
                ≈ {quote.monthly_pen.toFixed(2)} PEN al mes
              </p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              {quote.region_name ? `${quote.region_name} · ` : ""}
              Referencia: {quote.reference_date}
            </p>
          </div>

          <div className="mt-5 space-y-3 border-t pt-5">
            {quote.components.map((component) => (
              <ComponentRow key={component.service_code} component={component} />
            ))}
          </div>

          <p className="mt-5 flex items-start gap-2 border-t pt-4 text-[11px] leading-5 text-muted-foreground">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-cyan" />
            {quote.notice}
          </p>
        </>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Completa tu configuración para ver el costo.
        </p>
      )}
    </div>
  );
}

function ComponentRow({ component }: { component: QuoteComponent }) {
  const isLive = component.source === "live";
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 font-medium capitalize">
          {component.name || component.service_code}
          <span
            className={`rounded px-1.5 py-0.5 text-[9px] font-medium uppercase ${
              isLive ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            {isLive ? "En vivo" : "Referencia"}
          </span>
        </span>
        <span className="font-medium">{usdFormatter.format(component.monthly_usd)}</span>
      </div>
      {component.breakdown.length > 0 && (
        <ul className="mt-2 space-y-1">
          {component.breakdown.map((line, index) => (
            <li
              key={`${component.service_code}-${index}`}
              className="flex justify-between text-[11px] text-muted-foreground"
            >
              <span>{line.label}</span>
              <span>{usdFormatter.format(line.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ContractCard({
  comboName,
  disabled,
  form,
  errors,
  formError,
  submitting,
  showForm,
  onToggleForm,
  onFieldChange,
  onSubmit,
}: {
  comboName: string;
  disabled: boolean;
  form: OrderFormValues;
  errors: FieldErrors;
  formError: string;
  submitting: boolean;
  showForm: boolean;
  onToggleForm: () => void;
  onFieldChange: (key: keyof OrderFormValues, value: string) => void;
  onSubmit: () => void | Promise<void>;
}) {
  if (!showForm) {
    return (
      <div className="rounded-md border bg-background p-6">
        <p className="text-sm text-muted-foreground">
          ¿Listo para avanzar con el combo {comboName}?
        </p>
        <Button type="button" className="mt-4 w-full" disabled={disabled} onClick={onToggleForm}>
          Contratar {comboName}
        </Button>
      </div>
    );
  }

  return (
    <form
      className="rounded-md border bg-background p-6"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit();
      }}
      noValidate
    >
      <h3 className="text-sm font-semibold">Datos para contratar</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Completá tus datos y enviaremos el pedido «{comboName}» con la región seleccionada.
      </p>
      <div className="mt-4 space-y-3">
        <FormField
          label="Razón social"
          value={form.company_name}
          onChange={(value) => onFieldChange("company_name", value)}
          error={errors["company_name"]}
          placeholder="Mi Empresa S.A.C."
        />
        <FormField
          label="RUC"
          value={form.ruc}
          onChange={(value) => onFieldChange("ruc", value)}
          error={errors["ruc"]}
          inputMode="numeric"
          maxLength={11}
          placeholder="20123456789"
        />
        <FormField
          label="Nombre de contacto"
          value={form.contact_name}
          onChange={(value) => onFieldChange("contact_name", value)}
          error={errors["contact_name"]}
          placeholder="María Pérez"
        />
        <FormField
          label="Correo electrónico"
          value={form.email}
          onChange={(value) => onFieldChange("email", value)}
          error={errors["email"]}
          type="email"
          inputMode="email"
          placeholder="contacto@miempresa.pe"
        />
        <FormField
          label="Teléfono (opcional)"
          value={form.phone}
          onChange={(value) => onFieldChange("phone", value)}
          error={errors["phone"]}
          type="tel"
          inputMode="tel"
          maxLength={20}
          placeholder="999 999 999"
        />
      </div>
      {formError && <p className="mt-3 text-[11px] text-destructive">{formError}</p>}
      <div className="mt-4 flex gap-2">
        <Button type="submit" className="flex-1" disabled={submitting}>
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Enviando…
            </span>
          ) : (
            "Confirmar pedido"
          )}
        </Button>
        <Button type="button" variant="outline" disabled={submitting} onClick={onToggleForm}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function CustomCard({
  disabled,
  onGoToPersonalizar,
}: {
  disabled: boolean;
  onGoToPersonalizar: () => void;
}) {
  return (
    <div className="rounded-md border bg-background p-6">
      <h3 className="text-sm font-semibold">Armado a medida</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        El armado a medida se confirma con un asesor y se construye sobre un combo base. Continúa en
        Personalizar para elegir tu combo y contratar.
      </p>
      <Button
        type="button"
        className="mt-4 w-full"
        disabled={disabled}
        onClick={onGoToPersonalizar}
      >
        Elegir combo y contratar
      </Button>
    </div>
  );
}
