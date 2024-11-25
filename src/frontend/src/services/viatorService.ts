import {
  AttractionSearchResult,
  AttractionsPagination,
  AttractionResponse,
} from "./types";
import axios from "axios";

export async function getAttractions(
  inputAddress: string,
  pagination?: AttractionsPagination
): Promise<AttractionResponse> {
  console.log("pagination", pagination);
  const res = await axios.get<AttractionResponse>(
    `http://${process.env.REACT_APP_BACKEND_HOST}/viator/attractions`,
    {
      params: {
        address: inputAddress,
        start: pagination?.start,
        count: pagination?.count,
      },
    }
  );
  console.log("attractions res", res);
  return res.data;
}
