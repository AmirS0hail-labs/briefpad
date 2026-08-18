"use server";

import bcrypt from "bcryptjs";
import { redirect, unstable_rethrow } from "next/navigation";
import { setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type LoginState = { error: string } | null;

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { error: "Email or password is incorrect." };
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return { error: "Email or password is incorrect." };
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    redirect("/");
  } catch (error) {
    unstable_rethrow(error);
    return {
      error: "Could not sign in. Wait a few seconds and try again.",
    };
  }
}
