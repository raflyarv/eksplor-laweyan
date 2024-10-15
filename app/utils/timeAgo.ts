export const timeAgo = (timestamp: string): string => {
  const now = new Date(); // Get the current time
  const date = new Date(timestamp); // Convert the input timestamp to a Date object
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000); // Time difference in seconds

  if (diffInSeconds < 60) {
    return `${diffInSeconds} detik yang lalu`; // Less than a minute
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} menit yang lalu`; // Less than an hour
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} jam yang lalu`; // Less than a day
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} hari yang lalu`; // Less than a week
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} minggu yang lalu`; // Less than a month
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} bulan yang lalu`; // Less than a year
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} tahun yang lalu`; // More than a year
  }
};
