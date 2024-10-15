// Define the structure for the User who submitted the review
interface User {
  _id: string;
  fullName: string;
  profileImage: string | null; // profileImage can be null if not provided
  reviewCount: number;
}

// Define the structure for a Review
export interface ReviewProps {
  _id: string;
  siteName: string;
  userId: User; // Reference to the user who submitted the review
  locationId: number; // The location the review is related to
  rating: number; // The rating provided (e.g., 1 to 5)
  comments: string; // The content of the review
  dateVisited: string; // The date when the location was visited
  createdAt: string; // The date when the review was created
  updatedAt: string; // The date when the review was last updated
}
