export const calculateWalkingTime = (distanceInMeters: number): string => {
  const averageWalkingSpeed = 5; // in km/h
  const secondsInAnHour = 3600; // Number of seconds in an hour

  // Convert average walking speed to meters per second
  const averageWalkingSpeedInMetersPerSecond =
    (averageWalkingSpeed * 1000) / secondsInAnHour;

  // Calculate walking time in seconds
  const walkingTimeInSeconds =
    distanceInMeters / averageWalkingSpeedInMetersPerSecond;

  // Convert seconds to minutes
  const walkingTimeInMinutes = Math.round(walkingTimeInSeconds / 60);

  // Calculate hours and remaining minutes
  const hours = Math.floor(walkingTimeInMinutes / 60);
  const minutes = walkingTimeInMinutes % 60;

  // Return time in "jam" (hours) and "menit" (minutes) format
  if (hours > 0) {
    return `${hours} j ${minutes} m`;
  } else {
    return `${minutes} menit`;
  }
};
