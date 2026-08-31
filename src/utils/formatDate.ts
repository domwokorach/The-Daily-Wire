export function timeAgo(isoTimestamp?: string): string {
  if (!isoTimestamp) return '';
  const then = new Date(isoTimestamp).getTime();
  if (Number.isNaN(then)) return '';

  const diffMs = Math.max(0, Date.now() - then);
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

export function formatFullDate(isoTimestamp?: string): string {
  if (!isoTimestamp) return '';
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Joins byline/timestamp fragments with a separator, skipping empty ones. */
export function joinMeta(...parts: Array<string | undefined | false>): string {
  return parts.filter((part): part is string => Boolean(part && part.length > 0)).join(' · ');
}
