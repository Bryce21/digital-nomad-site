export interface ApiPlacesResponse {
  name: string | undefined;
  lat: number | undefined;
  long: number | undefined;
  rating: number | undefined;
  types: string[] | undefined;
  totalRatings: number | undefined;
  website: string | undefined;
  hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  address: string | undefined;
  fromType: string;
}
