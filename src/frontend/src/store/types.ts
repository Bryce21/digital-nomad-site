import { LatLng, Place } from '../types/types';
// eslint-disable-next-line
import { ViatorDestination } from '../services/types';

export type Metadata = {
  canConnect: boolean;
};

export type Search = {
  // this is raw input from user
  inputAddress?: string;
  //   the lat/long of the search
  latLong?: LatLng;
  places?: Place[];
  colors?: { [index: string]: string };
  searchTypes?: string[];
  error?: Error;
};

export type StoreState = {
  meta: Metadata;
  search?: Search;
  atractions?: AttractionsState;
};

export type SetSearchPayload = {
  inputAddress: string;
  latLong: LatLng;
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

export type Pricing = {
  currency: string;
  summary: {
    fromPrice?: number;
    fromPriceBeforeDiscount?: number;
  };
};

export type Attraction = {
  productCode: string;
  title: string;
  description: string;
  images: Image[];
  reviews: Reviews;
  productUrl: string;
  tags: string[];
  pricing: Pricing;
};

export type AttractionsState = {
  loading: boolean;
  data: Attraction[];
  totalCount: number;
  currentPage: number;
  destination?: ViatorDestination;
  error?: Error;
};
