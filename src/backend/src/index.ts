import express, {Express, NextFunction, Request, RequestHandler, Response} from "express";
import dotenv from "dotenv";
import {
    AddressType,
    Client,
    Language,
    LatLngLiteral,
    PlacesNearbyRequest,
    PlacesNearbyResponse
} from "@googlemaps/google-maps-services-js";
import {Promise as BPromise} from "bluebird";
import {Place} from "@googlemaps/google-maps-services-js/src/common";
dotenv.config();

const client = new Client({})

const app: Express = express();
const port = process.env.PORT || 3000;



const assertLookForTypeExists: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        const lookForTypes = req.query["lookForTypes"]
        if(!lookForTypes){
            next(new Error('lookForType is not defined'))
        } else if(typeof lookForTypes !== 'string') {
            next(new Error('lookForType is not a string'))
        } else {
            res.locals.lookForTypes = lookForTypes.split(',')
            next()
        }
    } catch (e) {
        console.error(e)
        next(e)
    }
}


const assertAddressExists: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        const address = req.query["address"]
        if(!address){
            next(new Error('Address is not defined'))
        } else if(typeof address !== 'string') {
            next(new Error('Address is not a string'))
        } else {
            res.locals.address = address
            next()
        }
    } catch (e) {
        console.error(e)
        next(e)
    }
}

const cacheLookUpAddressLatLong = async (address?: string): Promise<LatLngLiteral | undefined> => {
    return undefined
}

const getLongLatFromAddress: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cacheLookup: LatLngLiteral | undefined = await cacheLookUpAddressLatLong(res.locals.address)
        if(cacheLookup) {
            res.locals.latLongCached = true
            res.locals.latLong = cacheLookup
        } else {
            res.locals.latLong = {
                lat: 44.439663,
                lng: 26.096306
            }
        }
        next()
    } catch (e) {
        console.error(e)
        next(e)
    }
}

const cacheLookUpPlacesNearby = async (subRequest: PlacesNearbySubRequest) => {
    return undefined
}

interface PlacesNearbySubRequest {
    type: string | undefined,
    latLong: LatLngLiteral | undefined
}

const getPlacesNearby = async (subRequest: PlacesNearbySubRequest, res: Response) => {
    try {
        const cacheLookup = await cacheLookUpPlacesNearby(subRequest)
        if(cacheLookup){
            res.locals.dataCached = true
            return cacheLookup
        }

        const googleRes = await client.placesNearby(
            <PlacesNearbyRequest>{
                params: {
                    radius: 10000,
                    location: subRequest.latLong,
                    keyword: subRequest.type,
                    language: Language.en,
                    key: process.env.GOOGLE_API_KEY
                }
            }
        )
        return googleRes
    } catch (e) {
        console.error(e)
        throw e
    }
}


interface ApiPlacesResponse {
    name: string | undefined,
    lat: number | undefined,
    long: number | undefined,
    rating: number | undefined
    types: string[] | undefined
}

app.get("/nearbyPlaces", assertAddressExists, assertLookForTypeExists, getLongLatFromAddress, async (req: Request, res: Response) => {
    try {
        const subRequests: PlacesNearbySubRequest[] | undefined = res.locals.lookForTypes.map((type: string) => ({latLong: res.locals.latLong, type: type}))
        const allPlaces = await BPromise.map(subRequests ? subRequests : [], (req: PlacesNearbySubRequest) => getPlacesNearby(req, res))
        allPlaces.forEach((x: any) => console.log(JSON.stringify(x.data, null, 2)))

        const responseData: ApiPlacesResponse[] | undefined = allPlaces.flatMap((p: PlacesNearbyResponse) => {
            return p.data.results.map(
                (value: Place) => ({
                    name: value.name,
                    lat: value.geometry?.location.lat,
                    long: value.geometry?.location.lng,
                    rating: value?.rating,
                    types: value.types?.map((a: AddressType) => a.toString()) || []
                })
            )
        })
        const finalResponse = {
            data: responseData || [],
            metadata: {
                cache: {
                    longLatCached: res.locals.latLongCached || false,
                    dataCached: res.locals.dataCached || false
                },
                response: {
                    length: (responseData || []).length,
                }
            }

        }
        res.json(finalResponse)
    } catch (e) {
        console.error(e)
        throw e
    }

})


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
