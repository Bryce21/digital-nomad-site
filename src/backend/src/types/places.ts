export interface ApiPlacesResponse {
  name: string | undefined;
  lat: number | undefined;
  long: number | undefined;
  rating: number | undefined;
  types: string[] | undefined;
  totalRatings: number | undefined;
}
