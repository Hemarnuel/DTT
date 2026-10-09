export const param = (v: unknown): string =>
  Array.isArray(v) ? String(v[0] ?? "") : String(v ?? "");