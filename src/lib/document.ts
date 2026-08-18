export const TITLE_MAX_LENGTH = 120;
export const MAX_CONTENT_BYTES = 4_000_000;

export type TiptapDoc = {
  type: "doc";
  content?: Record<string, unknown>[];
};

export const EMPTY_DOC: TiptapDoc = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function asTiptapDoc(value: unknown): TiptapDoc {
  if (
    value &&
    typeof value === "object" &&
    "type" in value &&
    (value as { type: unknown }).type === "doc"
  ) {
    return value as TiptapDoc;
  }
  return EMPTY_DOC;
}

/** Plain JSON only — Tiptap's getJSON() is not safe to pass into a Server Action. */
export function toTiptapDocJson(value: unknown): TiptapDoc {
  return asTiptapDoc(JSON.parse(JSON.stringify(value)));
}

export function parseTiptapDocJson(raw: string): TiptapDoc {
  try {
    return asTiptapDoc(JSON.parse(raw));
  } catch {
    return EMPTY_DOC;
  }
}

export function normalizeTitle(value: string) {
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (!trimmed) {
    return "Untitled";
  }
  return trimmed.slice(0, TITLE_MAX_LENGTH);
}

export function contentSizeError(doc: TiptapDoc) {
  const bytes = new TextEncoder().encode(JSON.stringify(doc)).length;
  if (bytes > MAX_CONTENT_BYTES) {
    return "This brief is too large to save.";
  }
  return null;
}
