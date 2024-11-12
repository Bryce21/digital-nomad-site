import { LatLng, Place } from "../types/types";

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
};

export type StoreState = {
  meta: Metadata;
  search?: Search;
};

export type SetSearchPayload = {
  inputAddress: string;
  latLong: LatLng;
};
