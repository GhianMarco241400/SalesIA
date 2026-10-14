export interface Plan {
  code: string;
  name: string;
  description: string | null;
  monthly_price: number;
  setup_price: number;
}

export type Extra = Plan;

export interface OrderPayload {
  company_name: string;
  ruc: string;
  contact_name: string;
  email: string;
  phone?: string;
  region?: string;
  plan_code: string;
  extra_codes?: string[];
  region_code?: string;
}

export interface OrderPlanRef {
  code: string;
  name: string;
}

export interface OrderExtraRef {
  code: string;
  name: string;
}

export interface OrderResponse {
  code: string;
  status: string;
  plan: OrderPlanRef;
  extras: OrderExtraRef[];
  monthly_total: number;
  setup_total: number;
}

export type FieldErrors = Record<string, string>;

export interface AwsCatalog {
  provider: string;
  mode: string;
  notice: string;
  reference_date: string;
  currency: string;
  igv: number;
  service_count: number;
  region_count: number;
  fx_rates: Record<string, number>;
}

export interface AwsRegion {
  code: string;
  name: string;
  city: string | null;
  country: string | null;
  price_factor: number;
}

export interface AwsService {
  code: string;
  name: string;
  category: string;
  description: string | null;
}

export interface QuoteServiceSpec {
  service_code: string;
  params: Record<string, unknown>;
}

export interface QuoteRequest {
  region_code?: string;
  plan_code?: string;
  services?: QuoteServiceSpec[];
}

export interface QuoteLine {
  label: string;
  amount: number;
}

export interface QuoteComponent {
  service_code: string;
  name: string;
  source: "live" | "stored" | string;
  monthly_usd: number;
  breakdown: QuoteLine[];
}

export interface QuoteResponse {
  region_code: string;
  region_name: string;
  currency: string;
  mode: string;
  reference_date: string;
  notice: string;
  monthly_usd: number;
  monthly_pen: number | null;
  components: QuoteComponent[];
}
