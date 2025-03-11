import axios from 'axios';
import { AttractionsPagination, AttractionResponse } from './types';

export default async function getAttractions(
  inputAddress: string,
  pagination?: AttractionsPagination,
  filters?: {
    maxPrice?: number;
    minRating?: number;
    searchTerm?: string;
    minPrice?: number;
  }
): Promise<AttractionResponse> {
  const res = await axios.get<AttractionResponse>(
    `${process.env.REACT_APP_HTTP_METHOD}://${process.env.REACT_APP_BACKEND_HOST}/viator/attractions`,
    {
      params: {
        address: inputAddress,
        start: pagination?.start,
        count: pagination?.count,
        maxPrice: filters?.maxPrice,
        minPrice: filters?.minPrice,
        minRating: filters?.minRating,
        searchTerm: filters?.searchTerm,
      },
    }
  );
  return res.data;
}
