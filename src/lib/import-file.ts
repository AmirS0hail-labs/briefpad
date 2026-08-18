import { EMPTY_DOC, normalizeTitle, type TiptapDoc } from "@/lib/document";

export const IMPORT_MAX_BYTES = 1_000_000;
export const IMPORT_ACCEPT = ".md,.txt,text/plain,text/markdown";

type TextNode = {
  type: "text";
  text: string;
  marks?: { type: string }[];
};

function parseInline(src: string): TextNode[] {
  const nodes: TextNode[] = [];
  let i = 0;
  let buffer = "";

  const flush = (marks?: { type: string }[]) => {
    if (!buffer) {
      return;
    }
    nodes.push(marks ? { type: "text", text: buffer, marks } : { type: "text", text: buffer });
    buffer = "";
  };

  while (i < src.length) {
    if (src.startsWith("**", i) || src.startsWith("__", i)) {
      const delim = src.slice(i, i + 2);
      const close = src.indexOf(delim, i + 2);
      if (close !== -1) {
        flush();
        const inner = src.slice(i + 2, close);
        if (inner) {
          nodes.push({ type: "text", text: inner, marks: [{ type: "bold" }] });
        }
        i = close + 2;
        continue;
      }
    }

    if (src[i] === "*" || src[i] === "_") {
      const delim = src[i];
      const close = src.indexOf(delim, i + 1);
      if (close > i + 1) {
        flush();
        nodes.push({
          type: "text",
          text: src.slice(i + 1, close),
          marks: [{ type: "italic" }],
        });
        i = close + 1;
        continue;
      }
    }

    buffer += src[i];
    i += 1;
  }

  flush();
  return nodes;
}

function paragraph(text: string) {
  const content = parseInline(text);
  return content.length ? { type: "paragraph", content } : { type: "paragraph" };
}

function listItem(text: string) {
  return {
    type: "listItem",
    content: [paragraph(text)],
  };
}

export function markdownToTiptap(markdown: string): TiptapDoc {
  const lines = markdown.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const blocks: Record<string, unknown>[] = [];
  let inFence = false;
  const fenceLines: string[] = [];
  let listType: "bullet" | "ordered" | null = null;
  let listItems: ReturnType<typeof listItem>[] = [];

  const flushList = () => {
    if (listType && listItems.length > 0) {
      blocks.push({
        type: listType === "bullet" ? "bulletList" : "orderedList",
        content: listItems,
      });
    }
    listType = null;
    listItems = [];
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      flushList();
      if (inFence) {
        if (fenceLines.length > 0) {
          blocks.push(paragraph(fenceLines.join(" ")));
        }
        fenceLines.length = 0;
        inFence = false;
      } else {
        inFence = true;
      }
      continue;
    }

    if (inFence) {
      fenceLines.push(line);
      continue;
    }

    if (!line.trim()) {
      flushList();
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      flushList();
      const level = heading[1].length === 1 ? 1 : 2;
      const content = parseInline(heading[2]);
      blocks.push(
        content.length
          ? { type: "heading", attrs: { level }, content }
          : { type: "heading", attrs: { level } },
      );
      continue;
    }

    const bullet = /^[-*+]\s+(.*)$/.exec(line);
    if (bullet) {
      if (listType && listType !== "bullet") {
        flushList();
      }
      listType = "bullet";
      listItems.push(listItem(bullet[1]));
      continue;
    }

    const ordered = /^\d+\.\s+(.*)$/.exec(line);
    if (ordered) {
      if (listType && listType !== "ordered") {
        flushList();
      }
      listType = "ordered";
      listItems.push(listItem(ordered[1]));
      continue;
    }

    flushList();
    const quote = /^>\s?(.*)$/.exec(line);
    blocks.push(paragraph(quote ? quote[1] : line));
  }

  flushList();
  if (inFence && fenceLines.length > 0) {
    blocks.push(paragraph(fenceLines.join(" ")));
  }

  return blocks.length > 0 ? { type: "doc", content: blocks } : EMPTY_DOC;
}

export function plainTextToTiptap(text: string): TiptapDoc {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const content = lines.map((line) =>
    line.length === 0
      ? { type: "paragraph" }
      : { type: "paragraph", content: [{ type: "text", text: line }] },
  );
  return { type: "doc", content: content.length > 0 ? content : EMPTY_DOC.content };
}

export function titleFromFilename(filename: string) {
  const base = filename.replace(/\.[^.]+$/, "");
  return normalizeTitle(base.replace(/[-_]+/g, " "));
}

export function validateImportFile(file: { name: string; size: number }) {
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".docx") || lower.endsWith(".doc")) {
    return "Word files are not supported. Export to Markdown or plain text, then import.";
  }
  if (!lower.endsWith(".md") && !lower.endsWith(".txt")) {
    return "Use a .md or .txt file.";
  }
  if (file.size > IMPORT_MAX_BYTES) {
    return "File is over 1MB. Split it or import a smaller draft.";
  }
  return null;
}

export function fileToTiptap(filename: string, text: string): TiptapDoc {
  return filename.toLowerCase().endsWith(".md")
    ? markdownToTiptap(text)
    : plainTextToTiptap(text);
}

export const IMPORT_LIMIT_COPY =
  "Markdown or plain text, up to 1MB. Word (.docx) is not supported.";
