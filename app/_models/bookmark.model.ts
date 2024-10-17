interface Image {
  _id: string;
  url: string;
  title: string;
}

interface Review {
  locationId: number;
  rating: number;
}

export interface BookmarkProps {
  _id: string;
  siteName: string;
  address: string;
  latitude: number;
  longitude: number;
  operationalHours: string;
  images: Image[];
  reviews: Review[];
  id: number;
}
