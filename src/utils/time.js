export function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts = [];
  if (days > 0) parts.push(`${days} gün`);
  if (hours % 24 > 0) parts.push(`${hours % 24} saat`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60} dakika`);
  if (parts.length === 0) parts.push(`${seconds} saniye`);

  return parts.join(' ');
}

export function formatRelative(date) {
  const timestamp = date instanceof Date ? Math.floor(date.getTime() / 1000) : Math.floor(date / 1000);
  return `<t:${timestamp}:R>`;
}

export function formatFull(date) {
  const timestamp = date instanceof Date ? Math.floor(date.getTime() / 1000) : Math.floor(date / 1000);
  return `<t:${timestamp}:F>`;
}
