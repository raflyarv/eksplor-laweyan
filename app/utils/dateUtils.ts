export function timeAgoIndicator(date: Date): string {
  const now = new Date();
  console.log(now);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  console.log(hours);

  if (seconds < 60) return `${seconds} detik yang lalu`;
  if (minutes < 60) return `${minutes} menit yang lalu`;
  if (hours < 24) return `${hours} jam yang lalu`;
  if (days < 30) return `${days} hari yang lalu`;
  if (months < 12) return `${months} bulan yang lalu`;
  return `${years} tahun yang lalu`;
}
