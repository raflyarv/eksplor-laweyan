// Function to calculate distance accuracy between Haversine formula and Google Maps
function calculateDistanceAccuracy(
  dGoogle: number,
  dHaversine: number
): number {
  const difference = Math.abs(dGoogle - dHaversine);
  const accuracy = (1 - difference / dGoogle) * 100;
  return accuracy;
}

// // Example usage for distance accuracy
// const dGoogle = 5000; // Google Maps distance in meters
// const dHaversine = 4950; // Haversine formula distance in meters
// const distanceAccuracy = calculateDistanceAccuracy(dGoogle, dHaversine);
// console.log(`Distance Accuracy: ${distanceAccuracy.toFixed(2)}%`);

// Function to calculate walking time accuracy between Google Maps and manual calculation
function calculateTimeAccuracy(tGoogle: number, tManual: number): number {
  const timeDifference = Math.abs(tGoogle - tManual);
  const accuracy = (1 - timeDifference / tGoogle) * 100;
  return accuracy;
}

// // Example usage for time accuracy
// const tGoogle = 3600; // Google Maps estimated walking time in seconds
// const tManual = 3597; // Manually calculated estimated time in seconds
// const timeAccuracy = calculateTimeAccuracy(tGoogle, tManual);
// console.log(`Walking Time Accuracy: ${timeAccuracy.toFixed(2)}%`);
