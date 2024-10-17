// distanceUtils.ts

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
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
  return distanceInMeters; // Return distance as a number in meters
};

export const formatDistance = (distanceInMeters: number): string => {
  if (distanceInMeters > 900) {
    const distanceInKm = (distanceInMeters / 1000).toFixed(1); // Convert to kilometers and round
    return `${distanceInKm} km`;
  } else {
    return `${distanceInMeters} m`;
  }
};
