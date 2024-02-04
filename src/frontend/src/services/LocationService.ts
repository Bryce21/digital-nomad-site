import axios from "axios";
import {PlacesNearbyResponse} from "../types/types";


async function getPlacesNearby(inputAddress: string, types: string[]) {
    const res = await axios.get<PlacesNearbyResponse>(
        'http://localhost:3001/places/nearby',
        {
            params: {
                address: inputAddress,
                lookForTypes: types.join(",")
            }
        }
    )
    return res.data
}

export {
    getPlacesNearby
}
