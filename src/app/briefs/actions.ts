"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import {
  canAccessDocument,
  canManageSharing,
  canShareWith,
} from "@/lib/access";
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

export type ShareBriefResult = { ok: true } | { ok: false; error: string };

async function loadOwnedBrief(documentId: string, userId: string) {
  const brief = await prisma.document.findUnique({
    where: { id: documentId },
    select: { id: true, ownerId: true },
  });

  if (!brief) {
    return { ok: false as const, error: "This brief no longer exists." };
  }

  if (!canManageSharing({ userId, ownerId: brief.ownerId })) {
    return {
      ok: false as const,
      error: "Only the owner can change who has access.",
    };
  }

  return { ok: true as const, brief };
}

export async function shareBrief(input: {
  documentId: string;
  userId: string;
}): Promise<ShareBriefResult> {
  const user = await requireCurrentUser();
  const owned = await loadOwnedBrief(input.documentId, user.id);
  if (!owned.ok) {
    return owned;
  }

  if (!canShareWith({ ownerId: owned.brief.ownerId, targetUserId: input.userId })) {
    return { ok: false, error: "You already own this brief." };
  }

  const teammate = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { id: true },
  });
  if (!teammate) {
    return { ok: false, error: "That teammate is not on Briefpad." };
  }

  try {
    await prisma.documentShare.create({
      data: {
        documentId: owned.brief.id,
        userId: teammate.id,
      },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { ok: true };
    }
    throw error;
  }

  revalidatePath("/");
  revalidatePath(`/briefs/${owned.brief.id}`);
  return { ok: true };
}

export async function revokeShare(input: {
  documentId: string;
  userId: string;
}): Promise<ShareBriefResult> {
  const user = await requireCurrentUser();
  const owned = await loadOwnedBrief(input.documentId, user.id);
  if (!owned.ok) {
    return owned;
  }

  await prisma.documentShare.deleteMany({
    where: {
      documentId: owned.brief.id,
      userId: input.userId,
    },
  });

  revalidatePath("/");
  revalidatePath(`/briefs/${owned.brief.id}`);
  return { ok: true };
}
