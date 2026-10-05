export function parseOptionalNumber(
  value: FormDataEntryValue | null
): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function parseOptionalText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function parseOptionalIso(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function requireText(value: FormDataEntryValue | null): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) throw new Error("This field is required.");
  return text;
}
