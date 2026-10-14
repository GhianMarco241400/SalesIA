import type {
  AwsCatalog,
  AwsRegion,
  AwsService,
  Extra,
  FieldErrors,
  OrderPayload,
  OrderResponse,
  Plan,
  QuoteRequest,
  QuoteResponse,
} from "@/types/api";
import { fieldErrorMessage } from "@/lib/validation";

const API_URL = (import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000").replace(/\/+$/, "");

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: FieldErrors;

  constructor(message: string, status = 0, fieldErrors: FieldErrors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function toApiError(status: number, data: unknown): ApiError {
  const detail =
    data && typeof data === "object" && "detail" in data
      ? (data as { detail: unknown }).detail
      : undefined;

  if (typeof detail === "string" && detail.trim().length > 0) {
    return new ApiError(detail, status);
  }

  if (Array.isArray(detail)) {
    const fieldErrors: FieldErrors = {};
    for (const item of detail) {
      if (!item || typeof item !== "object") continue;
      const loc = "loc" in item ? (item as { loc: unknown }).loc : undefined;
      const msg = "msg" in item ? (item as { msg: unknown }).msg : undefined;
      const field = Array.isArray(loc)
        ? [...loc]
            .reverse()
            .find(
              (part): part is string =>
                typeof part === "string" && part !== "body" && part !== "query" && part !== "path",
            )
        : undefined;
      const key = field ?? "_";
      const apiMessage = typeof msg === "string" ? msg : undefined;
      if (!fieldErrors[key]) fieldErrors[key] = fieldErrorMessage(key, apiMessage);
    }
    const message =
      Object.keys(fieldErrors).length > 0
        ? "Revisa los campos marcados."
        : "La solicitud no es válida.";
    return new ApiError(message, status, fieldErrors);
  }

  if (status === 400) return new ApiError("La solicitud no es válida.", status);
  return new ApiError("Ocurrió un error inesperado. Inténtalo de nuevo.", status);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
      },
    });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor", 0);
  }

  const text = await response.text();
  let data: unknown = null;
  if (text.trim().length > 0) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) throw toApiError(response.status, data);
  return data as T;
}

export function getPlans(): Promise<Plan[]> {
  return request<Plan[]>("/plans");
}

export function getExtras(): Promise<Extra[]> {
  return request<Extra[]>("/extras");
}

export function createOrder(payload: OrderPayload): Promise<OrderResponse> {
  return request<OrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAwsCatalog(): Promise<AwsCatalog> {
  return request<AwsCatalog>("/aws/catalog");
}

export function getAwsRegions(): Promise<AwsRegion[]> {
  return request<AwsRegion[]>("/aws/regions");
}

export function getAwsServices(): Promise<AwsService[]> {
  return request<AwsService[]>("/aws/services");
}

export function postAwsQuote(payload: QuoteRequest): Promise<QuoteResponse> {
  return request<QuoteResponse>("/aws/quote", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
