export interface OpeningHours {
  day: string;
  openHour: string;
  closeHour: string;
}

const daysMap: { [key: number]: string } = {
  0: "Minggu",
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

export function getOpenCloseStatus(dataJamOperasional: string): {
  indicator: string;
  opening: string | null;
  closing: string | null;
  modifiedResult: OpeningHours[]; // Add this to the return type
} {
  // Convert the operational hours string into an array of OpeningHours
  const modifiedResult: OpeningHours[] = dataJamOperasional
    .split(", ")
    .map((entry) => {
      const [day, open, , close] = entry.split(" ");
      return {
        day,
        openHour: open,
        closeHour: close,
      };
    });

  // Get current time
  const now = new Date();
  const currentDay = daysMap[now.getDay()];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Find today's opening hours
  const todayHours = modifiedResult.find((hours) => hours.day === currentDay);

  if (!todayHours) {
    return {
      indicator: "Tutup",
      opening: null,
      closing: null,
      modifiedResult, // Return the modifiedResult even if todayHours is not found
    };
  }

  const [openHour, openMinute] = todayHours.openHour.split(".").map(Number);
  const [closeHour, closeMinute] = todayHours.closeHour.split(".").map(Number);

  // Check if the place is currently open
  const isOpenNow =
    (currentHour > openHour ||
      (currentHour === openHour && currentMinute >= openMinute)) &&
    (currentHour < closeHour ||
      (currentHour === closeHour && currentMinute <= closeMinute));

  return {
    indicator: isOpenNow ? "Buka" : "Tutup",
    opening: todayHours.openHour,
    closing: todayHours.closeHour,
    modifiedResult, // Return the modifiedResult here
  };
}
