export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): string => {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371000; // Radius of the Earth in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceInMeters = Math.round(R * c); // Distance in meters

  // Return the distance as a string with appropriate units
  if (distanceInMeters > 900) {
    const distanceInKm = Math.round(distanceInMeters / 1000); // Convert to kilometers and round
    return `${distanceInKm} km`;
  } else {
    return `${distanceInMeters} m`;
  }
};
