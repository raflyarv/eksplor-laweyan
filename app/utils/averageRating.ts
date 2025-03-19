interface Review {
  rating: number;
}

export const averageRating = (siteReviews: Review[]): number => {
  if (!siteReviews || siteReviews.length === 0) {
    return 0;
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
