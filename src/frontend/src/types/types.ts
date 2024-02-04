export interface Place {
    name: string,
    lat: number,
    long: number,
    rating: number | undefined
    types: string[] | undefined,
    totalRatings: number | undefined
    fromType: string
}

export interface LatLng {
    lat: number
    lng: number
}

export interface PlacesNearbyResponse {
    data: {
        center: {
            lat: number,
            lng: number
        }
        places: Place[]
    }
}
