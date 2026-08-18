export function canAccessDocument(params: {
  userId: string;
  ownerId: string;
  sharedUserIds: string[];
}) {
  return (
    params.userId === params.ownerId ||
    params.sharedUserIds.includes(params.userId)
  );
}

export function canManageSharing(params: { userId: string; ownerId: string }) {
  return params.userId === params.ownerId;
}

export function canShareWith(params: { ownerId: string; targetUserId: string }) {
  return params.ownerId !== params.targetUserId;
}
