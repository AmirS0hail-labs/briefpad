"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { canAccessDocument } from "@/lib/access";
import { requireCurrentUser } from "@/lib/auth";
import {
  contentSizeError,
  EMPTY_DOC,
  normalizeTitle,
  parseTiptapDocJson,
} from "@/lib/document";
import { prisma } from "@/lib/prisma";

export async function createBrief() {
  const user = await requireCurrentUser();
  const brief = await prisma.document.create({
    data: {
      title: "Untitled",
      contentJson: EMPTY_DOC as Prisma.InputJsonValue,
      ownerId: user.id,
    },
  });

  revalidatePath("/");
  redirect(`/briefs/${brief.id}`);
}

export type SaveBriefResult =
  | { ok: true; updatedAt: string; title: string }
  | { ok: false; error: string };

export async function saveBrief(input: {
  id: string;
  title: string;
  contentJson: string;
}): Promise<SaveBriefResult> {
  const user = await requireCurrentUser();
  const contentJson = parseTiptapDocJson(input.contentJson);
  const sizeError = contentSizeError(contentJson);
  if (sizeError) {
    return { ok: false, error: sizeError };
  }

  const brief = await prisma.document.findUnique({
    where: { id: input.id },
    include: { shares: { select: { userId: true } } },
  });

  if (!brief) {
    return { ok: false, error: "This brief no longer exists." };
  }

  const allowed = canAccessDocument({
    userId: user.id,
    ownerId: brief.ownerId,
    sharedUserIds: brief.shares.map((share) => share.userId),
  });

  if (!allowed) {
    return { ok: false, error: "You do not have access to this brief." };
  }

  const updated = await prisma.document.update({
    where: { id: brief.id },
    data: {
      title: normalizeTitle(input.title),
      contentJson: contentJson as Prisma.InputJsonValue,
    },
  });

  revalidatePath("/");
  revalidatePath(`/briefs/${brief.id}`);

  return { ok: true, updatedAt: updated.updatedAt.toISOString(), title: updated.title };
}
