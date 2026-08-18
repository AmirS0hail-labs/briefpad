import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { warmDatabase } from "@/lib/prisma";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in · Briefpad",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  warmDatabase();

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="font-serif text-3xl tracking-tight text-stone-900">
          Briefpad
        </p>
        <h1 className="mt-6 text-xl font-medium text-stone-900">
          Sign in to write
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Internal briefs for a small team. Pick a demo teammate to look around.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
