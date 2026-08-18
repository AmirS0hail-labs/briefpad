export function formatUpdatedAt(date: Date) {
  const delta = Date.now() - date.getTime();
  if (delta < 45_000) {
    return "Just now";
  }
  if (delta < 60 * 60 * 1000) {
    const minutes = Math.max(1, Math.floor(delta / 60_000));
    return `${minutes} min ago`;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
