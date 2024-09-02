/*eslint-disable*/
import axios from "axios";
import { PlacesNearbyResponse } from "../types/types";

export default async function getPlacesNearby(
  inputAddress: string,
  types: string[]
) {
  const res = await axios.get<PlacesNearbyResponse>(
    `http://${process.env.REACT_APP_BACKEND_HOST}/places/nearby`,
    {
      params: {
        address: inputAddress,
        lookForTypes: types.join(","),
      },
    }
  );
  return res.data;
}
