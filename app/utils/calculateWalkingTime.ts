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

  return `${walkingTimeInMinutes} min`;
};
