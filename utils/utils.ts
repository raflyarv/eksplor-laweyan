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

export const calculatePopularity = (
  reviewsCount: number,
  bookmarksCount: number
): number => {
  return reviewsCount + bookmarksCount; // Adjust this formula as needed
};

export const averageRating = (siteReviews: any[]): number => {
  const totalRating = siteReviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  // Calculate the average rating
  const average = siteReviews.length ? totalRating / siteReviews.length : 0;

  // Return the average rounded to one decimal place
  return Math.round(average * 10) / 10;
};
