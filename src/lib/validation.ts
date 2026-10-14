import type { FieldErrors } from "@/types/api";

export interface OrderFormValues {
  company_name: string;
  ruc: string;
  contact_name: string;
  email: string;
  phone: string;
  region: string;
}

export const FIELD_LABELS: Record<string, string> = {
  company_name: "razón social",
  ruc: "RUC",
  contact_name: "nombre de contacto",
  email: "correo electrónico",
  phone: "teléfono",
  region: "región",
  plan_code: "combo",
  extra_codes: "extras",
};

export const FIELD_MESSAGES: Record<string, string> = {
  company_name: "La razón social debe tener entre 2 y 200 caracteres.",
  ruc: "El RUC debe tener exactamente 11 dígitos numéricos.",
  contact_name: "El nombre de contacto debe tener entre 2 y 200 caracteres.",
  email: "Ingresa un correo electrónico válido.",
  phone: "El teléfono no debe superar los 20 caracteres.",
  region: "La región no debe superar los 100 caracteres.",
  plan_code: "Selecciona un combo disponible.",
  extra_codes: "Revisa los extras seleccionados.",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function fieldErrorMessage(field: string, apiMessage?: string): string {
  return FIELD_MESSAGES[field] ?? apiMessage ?? "Revisa este campo.";
}

export function validateOrderForm(values: OrderFormValues): FieldErrors {
  const errors: FieldErrors = {};
  const companyName = values.company_name.trim();
  const contactName = values.contact_name.trim();
  const ruc = values.ruc.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const region = values.region.trim();

  if (companyName.length < 2 || companyName.length > 200) errors["company_name"] = FIELD_MESSAGES["company_name"] as string;
  if (!/^\d{11}$/.test(ruc)) errors["ruc"] = FIELD_MESSAGES["ruc"] as string;
  if (contactName.length < 2 || contactName.length > 200) errors["contact_name"] = FIELD_MESSAGES["contact_name"] as string;
  if (!isValidEmail(email)) errors["email"] = FIELD_MESSAGES["email"] as string;
  if (phone.length > 20) errors["phone"] = FIELD_MESSAGES["phone"] as string;
  if (region.length > 100) errors["region"] = FIELD_MESSAGES["region"] as string;

  return errors;
}
