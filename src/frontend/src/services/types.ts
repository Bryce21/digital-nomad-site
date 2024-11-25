import { Attraction } from "../store/types";
export type AttractionSearchResult = {
  products: Attraction[];
  totalCount: number;
};

export type ViatorDestination = {
  name: string;
  type: string;
  destinationUrl: string;
};

export type AttractionResponse = {
  attractions: AttractionSearchResult;
  destination: ViatorDestination;
};

export type AttractionsPagination = {
  start: number;
  count: number;
};
