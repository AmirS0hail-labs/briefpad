import Link from "next/link";
import { logoutAction } from "@/app/login/logout-action";
import type { ReactNode } from "react";

export function AppHeader({
  userName,
  children,
}: {
  userName: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-stone-200 bg-[#fffcf7]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-serif text-xl text-stone-900">
          Briefpad
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {children}
          <span className="text-stone-600">{userName}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-stone-700 underline-offset-4 hover:underline"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
