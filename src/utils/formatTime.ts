export function formatTime(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
  });
}
