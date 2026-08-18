"use client";

import { useEditorState, type Editor } from "@tiptap/react";

function ToolbarButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm ${
        active
          ? "bg-stone-800 text-white"
          : "text-stone-700 hover:bg-stone-100"
      }`}
    >
      {label}
    </button>
  );
}

export function BriefToolbar({ editor }: { editor: Editor | null }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => {
      if (!current) {
        return null;
      }
      return {
        bold: current.isActive("bold"),
        italic: current.isActive("italic"),
        underline: current.isActive("underline"),
        h1: current.isActive("heading", { level: 1 }),
        h2: current.isActive("heading", { level: 2 }),
        bullet: current.isActive("bulletList"),
        ordered: current.isActive("orderedList"),
      };
    },
  });

  if (!editor || !state) {
    return (
      <div className="h-[38px] rounded-md border border-stone-200 bg-[#fffcf7]" />
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-md border border-stone-200 bg-[#fffcf7] px-2 py-1">
      <ToolbarButton
        label="Bold"
        active={state.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        label="Italic"
        active={state.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        label="Underline"
        active={state.underline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <span className="mx-1 h-4 w-px bg-stone-200" />
      <ToolbarButton
        label="Heading"
        active={state.h1}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <ToolbarButton
        label="Subhead"
        active={state.h2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <span className="mx-1 h-4 w-px bg-stone-200" />
      <ToolbarButton
        label="Bullets"
        active={state.bullet}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        label="Numbers"
        active={state.ordered}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
    </div>
  );
}
