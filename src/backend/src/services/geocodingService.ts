import { GeocodeResult} from "@googlemaps/google-maps-services-js";

import {client} from './googleClient'

async function getLatLngFromAddress(address: string): Promise<{ lng: number, lat: number, isCached: boolean }> {

    // todo cache lookup attempt here

    const lngLatResponse = await client.geocode(
        {
            params: {
                address: address,
                key: process.env.GOOGLE_API_KEY || ""
            }
        }
    )

    if(lngLatResponse.data.error_message){
        throw new Error(lngLatResponse.data.error_message)
    }
    const geoCodeData: GeocodeResult | undefined = lngLatResponse.data.results.pop()
    if(!geoCodeData){
        throw new Error("Could not geocode - no data returned")
    }

    console.log(JSON.stringify(geoCodeData, null, 2))

    return {
        lat: geoCodeData.geometry.location.lat,
        lng: geoCodeData.geometry.location.lng,
        isCached: false
    }
}


export {
    getLatLngFromAddress
}
