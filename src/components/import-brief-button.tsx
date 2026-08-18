"use client";

import { useActionState, useRef, useState } from "react";
import { importBrief, type ImportState } from "@/app/briefs/actions";
import {
  IMPORT_ACCEPT,
  IMPORT_LIMIT_COPY,
  validateImportFile,
} from "@/lib/import-file";

export function ImportBriefButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState<ImportState, FormData>(
    importBrief,
    null,
  );
  const error = localError ?? state?.error;

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input
        ref={inputRef}
        type="file"
        name="file"
        accept={IMPORT_ACCEPT}
        className="sr-only"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (!file) {
            return;
          }
          const problem = validateImportFile(file);
          if (problem) {
            setLocalError(problem);
            event.currentTarget.value = "";
            return;
          }
          setLocalError(null);
          const input = event.currentTarget;
          input.form?.requestSubmit();
          window.setTimeout(() => {
            input.value = "";
          }, 0);
        }}
      />
      <button
        type="button"
        disabled={pending}
        onClick={() => inputRef.current?.click()}
        className="rounded-md border border-stone-300 bg-[#fffcf7] px-3.5 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50 disabled:opacity-60"
      >
        {pending ? "Importing…" : "Import file"}
      </button>
      <p className="max-w-[16rem] text-right text-xs leading-5 text-stone-500">
        {IMPORT_LIMIT_COPY}
      </p>
      {error ? (
        <p className="max-w-[16rem] text-right text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
