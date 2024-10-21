export interface OpeningHours {
  day: string;
  openHour: string;
  closeHour: string;
}

const daysMap: { [key: number]: string } = {
  0: "Senin",
  1: "Selasa",
  2: "Rabu",
  3: "Kamis",
  4: "Jumat",
  5: "Sabtu",
  6: "Minggu",
};

export function getOpenCloseStatus(dataJamOperasional: string): {
  indicator: string;
  opening: string | null;
  closing: string | null;
  nextOpeningDay: string | null;
  modifiedResult: OpeningHours[];
} {
  // Initialize modifiedResult to include all days with "Tutup"
  const modifiedResult: OpeningHours[] = Object.keys(daysMap).map((key) => {
    const day = daysMap[Number(key)];
    return {
      day,
      openHour: "Tutup", // Default to "Tutup"
      closeHour: "Tutup", // Default to "Tutup"
    };
  });

  // Parse the input operational hours
  dataJamOperasional.split(", ").forEach((entry) => {
    const [day, open, , close] = entry.split(" ");
    const index = Object.values(daysMap).indexOf(day);

    // Update the corresponding day's open and close hours if it exists
    if (index !== -1) {
      modifiedResult[index] = {
        day,
        openHour: open,
        closeHour: close,
      };
    }
  });

  const now = new Date();
  const currentDayIndex = (now.getDay() + 6) % 7; // Shift current day index to align with new mapping
  const currentDay = daysMap[currentDayIndex];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Find today's opening hours
  const todayHours = modifiedResult.find((hours) => hours.day === currentDay);

  if (!todayHours) {
    return {
      indicator: "Tutup",
      opening: null,
      closing: null,
      nextOpeningDay: null,
      modifiedResult,
    };
  }

  const [openHour, openMinute] = todayHours.openHour.split(":").map(Number);
  const [closeHour, closeMinute] = todayHours.closeHour.split(":").map(Number);

  const isOpenNow =
    (currentHour > openHour ||
      (currentHour === openHour && currentMinute >= openMinute)) &&
    (currentHour < closeHour ||
      (currentHour === closeHour && currentMinute <= closeMinute));

  if (isOpenNow) {
    return {
      indicator: "Buka",
      opening: todayHours.openHour,
      closing: todayHours.closeHour,
      nextOpeningDay: null,
      modifiedResult,
    };
  }

  // Find next available opening day
  let nextOpeningDay: OpeningHours | null = null;
  for (let i = 1; i < 7; i++) {
    const nextDayIndex = (currentDayIndex + i) % 7;
    const nextDayName = daysMap[nextDayIndex];
    const nextDayHours = modifiedResult.find(
      (hours) => hours.day === nextDayName && hours.openHour !== "Tutup"
    );

    if (nextDayHours) {
      nextOpeningDay = nextDayHours;
      break;
    }
  }

  return {
    indicator: "Tutup",
    opening: todayHours.openHour,
    closing: todayHours.closeHour,
    nextOpeningDay: nextOpeningDay?.day || null,
    modifiedResult,
  };
}
