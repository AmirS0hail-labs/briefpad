"use client";

import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { saveBrief } from "@/app/briefs/actions";
import { BriefToolbar } from "@/components/brief-toolbar";
import {
  TITLE_MAX_LENGTH,
  normalizeTitle,
  toTiptapDocJson,
  type TiptapDoc,
} from "@/lib/document";

type SaveStatus = "saved" | "saving" | "error";

export function BriefEditor({
  id,
  initialTitle,
  initialContent,
}: {
  id: string;
  initialTitle: string;
  initialContent: TiptapDoc;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef(initialTitle);
  const contentRef = useRef<TiptapDoc>(initialContent);
  const timerRef = useRef<number | null>(null);
  const saveGen = useRef(0);

  const persist = async () => {
    const gen = ++saveGen.current;
    setStatus("saving");
    try {
      const result = await saveBrief({
        id,
        title: titleRef.current,
        contentJson: JSON.stringify(toTiptapDocJson(contentRef.current)),
      });
      if (gen !== saveGen.current) {
        return;
      }
      if (!result.ok) {
        setStatus("error");
        setError(result.error);
        return;
      }
      setStatus("saved");
      setError(null);
    } catch {
      if (gen !== saveGen.current) {
        return;
      }
      setStatus("error");
      setError("Could not save. Try again.");
    }
  };

  const scheduleSave = () => {
    setStatus("saving");
    setError(null);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      void persist();
    }, 800);
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
        code: false,
        codeBlock: false,
        blockquote: false,
        link: false,
        strike: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing…",
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "tiptap",
      },
    },
    onUpdate: ({ editor: current }) => {
      contentRef.current = toTiptapDocJson(current.getJSON());
      scheduleSave();
    },
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onLeave = (event: BeforeUnloadEvent) => {
      if (status === "saving" || status === "error") {
        event.preventDefault();
      }
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [status]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <BriefToolbar editor={editor} />
        <p className="shrink-0 text-xs text-stone-500" aria-live="polite">
          {status === "saving" ? "Saving…" : null}
          {status === "saved" ? "Saved" : null}
          {status === "error" ? (
            <button
              type="button"
              onClick={() => void persist()}
              className="text-red-800 underline-offset-2 hover:underline"
            >
              Couldn’t save. Retry
            </button>
          ) : null}
        </p>
      </div>
      {error && status === "error" ? (
        <p className="text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <div className="rounded-lg border border-stone-200 bg-[#fffcf7] px-6 py-6 shadow-sm sm:px-10 sm:py-8">
        <input
          value={title}
          maxLength={TITLE_MAX_LENGTH}
          aria-label="Brief title"
          onChange={(event) => {
            const next = event.target.value;
            setTitle(next);
            titleRef.current = next;
            scheduleSave();
          }}
          onBlur={() => {
            const next = normalizeTitle(titleRef.current);
            const changed = next !== titleRef.current;
            setTitle(next);
            titleRef.current = next;
            if (changed) {
              scheduleSave();
            }
          }}
          className="mb-4 w-full border-none bg-transparent font-serif text-3xl tracking-tight text-stone-900 outline-none placeholder:text-stone-400"
          placeholder="Untitled"
        />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
