import { describe, expect, it } from "vitest";
import {
  IMPORT_MAX_BYTES,
  markdownToTiptap,
  titleFromFilename,
  validateImportFile,
} from "@/lib/import-file";

describe("validateImportFile", () => {
  it("rejects Word files with a clear reason", () => {
    expect(validateImportFile({ name: "notes.docx", size: 12 })).toMatch(/Word/i);
  });

  it("rejects unsupported types", () => {
    expect(validateImportFile({ name: "photo.png", size: 12 })).toMatch(/\.md or \.txt/);
  });

  it("rejects files over 1MB", () => {
    expect(
      validateImportFile({ name: "notes.md", size: IMPORT_MAX_BYTES + 1 }),
    ).toMatch(/1MB/);
  });

  it("accepts markdown and plain text under the cap", () => {
    expect(validateImportFile({ name: "notes.md", size: 80 })).toBeNull();
    expect(validateImportFile({ name: "notes.TXT", size: 80 })).toBeNull();
  });
});

describe("markdownToTiptap", () => {
  it("maps headings, lists, and bold onto editor nodes", () => {
    const doc = markdownToTiptap(
      "# Title\n\nHello **world**\n\n- one\n- two\n\n1. first\n",
    );
    const types = doc.content?.map((block) => block.type);
    expect(types).toEqual(["heading", "paragraph", "bulletList", "orderedList"]);
  });
});

describe("titleFromFilename", () => {
  it("turns a filename into a readable title", () => {
    expect(titleFromFilename("sample-brief.md")).toBe("sample brief");
  });
});
