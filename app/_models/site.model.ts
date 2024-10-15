/* eslint-disable @typescript-eslint/no-explicit-any */
// Define types for nested objects like contacts, images, and uniqueFacts

interface Contact {
  contactName: string;
  type: string;
  detail: string;
}

interface Image {
  _id: string;
  title: string;
  url: string;
}

interface UniqueFact {
  fact: string;
}

// Main interface for the site details
export interface SiteDetailsProps {
  address: string;
  bookmarkCount: number;
  contacts: Contact[]; // Assuming contacts is an array of contact objects
  createdAt: string; // Assuming it's a date string in ISO format
  createdBy?: {
    _id: string;
    fullName: string;
  };
  updatedBy?: {
    _id: string;
    fullName: string;
  };
  description: string;
  id: number; // Assuming id is a number
  images: Image[]; // Assuming images is an array of image objects
  latitude: number;
  longitude: number;
  operationalHours: string; // Assuming operational hours are stored as a string
  reviews: any[]; // Adjust type according to the structure of your review objects
  siteName: string;
  uniqueFacts: UniqueFact[]; // Assuming unique facts are objects with title and description
  updatedAt: string; // Assuming it's a date string in ISO format
}
