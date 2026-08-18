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
