export type ViatorDestinationResponse = {
  destinationId: string;
  name: string;
  type: string;
  parentDestinationId: string;
  lookupId: string;
  destinationUrl: string;
  defaultCurrencyCode: string;
  timeZone: string;
  countryCallingCode: string;
  languages: string[];
  center: {
    latitude: number;
    longitude: number;
  };
};

export type AttractionFilters = {
  destination: string;
};

export type AttractionPagination = {
  start: number;
  count: number;
};

export type ImageVariant = {
  url: string;
  height: string;
  width: string;
};

export type Image = {
  imageSource: string;
  caption: string;
  isCover: boolean;
  variants: ImageVariant[];
};

export type ReviewSource = {
  provider: string;
  totalCount: number;
  averageRating: number;
};

export type Reviews = {
  totalReviews: number;
  combinedAverageRating: number;
  sources: ReviewSource[];
};

export type Attraction = {
  productCode: string;
  title: string;
  description: string;
  images: Image[];
  reviews: Reviews;
  productUrl: string;
  tags: string[];
};

export type AttractionSearchResult = {
  products: Attraction[];
  totalCount: number;
};
