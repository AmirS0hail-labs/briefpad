import { canAccessDocument } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export async function listOwnedBriefs(userId: string) {
  return prisma.document.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, updatedAt: true },
  });
}

export async function listSharedBriefs(userId: string) {
  return prisma.document.findMany({
    where: { shares: { some: { userId } } },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      owner: { select: { name: true } },
    },
  });
}

export async function listTeammates(excludeUserId: string) {
  return prisma.user.findMany({
    where: { id: { not: excludeUserId } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true },
  });
}

export async function getBriefForUser(id: string, userId: string) {
  const brief = await prisma.document.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true } },
      shares: { select: { userId: true } },
    },
  });

  if (!brief) {
    return { status: "missing" as const };
  }

  const allowed = canAccessDocument({
    userId,
    ownerId: brief.ownerId,
    sharedUserIds: brief.shares.map((share) => share.userId),
  });

  if (!allowed) {
    return { status: "forbidden" as const };
  }

  return { status: "ok" as const, brief };
}
