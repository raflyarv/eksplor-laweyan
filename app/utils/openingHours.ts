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
  nextOpeningDay: string | null;
  modifiedResult: OpeningHours[];
} {
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
    const nextDayIndex = (now.getDay() + i) % 7;
    const nextDayName = daysMap[nextDayIndex];
    const nextDayHours = modifiedResult.find(
      (hours) => hours.day === nextDayName
    );

    // console.log(`Checking ${nextDayName}:`, nextDayHours);

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
