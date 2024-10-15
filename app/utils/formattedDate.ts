export const formatDateToIndonesian = (dateString: string): string => {
  const date = new Date(dateString); // Convert the input string to a Date object

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day = date.getDate(); // Get the day of the month
  const month = months[date.getMonth()]; // Get the month name in Indonesian
  const year = date.getFullYear(); // Get the full year

  return `${day} ${month} ${year}`; // Return the formatted date
};
