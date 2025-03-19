export const calculateWalkingTime = (distanceInMeters: number): string => {
  const averageWalkingSpeed = 5; // in km/h
  const secondsInAnHour = 3600; // Number of seconds in an hour

  const averageWalkingSpeedInMetersPerSecond =
    (averageWalkingSpeed * 1000) / secondsInAnHour;

  const walkingTimeInSeconds =
    distanceInMeters / averageWalkingSpeedInMetersPerSecond;

  const walkingTimeInMinutes = Math.round(walkingTimeInSeconds / 60);

  const hours = Math.floor(walkingTimeInMinutes / 60);
  const minutes = walkingTimeInMinutes % 60;

  // Return time in "jam" and "menit" format
  if (hours > 0) {
    return `${hours} j ${minutes} m`;
  } else {
    return `${minutes} menit`;
  }
};
