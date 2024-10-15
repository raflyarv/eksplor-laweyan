interface Review {
  rating: number; // Assuming rating is a number
  // Include other properties of the review if needed
}

export const averageRating = (siteReviews: Review[]): number => {
  if (!siteReviews || siteReviews.length === 0) {
    return 0; // Handle the case where there are no reviews
  }

  const totalRating = siteReviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  // Calculate the average rating
  const average = totalRating / siteReviews.length;

  // Return the average rounded to one decimal place
  return Math.round(average * 10) / 10;
};
