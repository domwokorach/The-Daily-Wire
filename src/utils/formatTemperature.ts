export function formatTemperature(value: number, unit: 'C' | 'F' = 'C'): string {
  return `${Math.round(value)}°${unit}`;
}
