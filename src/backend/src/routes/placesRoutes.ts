import express, {NextFunction, Request, RequestHandler, Response} from "express";
import {getPlacesAutoComplete} from "../services/places";
import {Promise as BPromise} from "bluebird";
import {
    AddressType, Language,
    LatLngLiteral,
    PlacesNearbyRequest,
    PlacesNearbyResponse,
    PlacesNearbyResponseData
} from "@googlemaps/google-maps-services-js";
import {Place} from "@googlemaps/google-maps-services-js/src/common";
import {getLatLngFromAddress} from "../services/geocodingService";
import {client} from "../services/googleClient";
import {ApiPlacesResponse} from "../types/places";
import {query, validationResult, matchedData} from 'express-validator'
import {getPlacesNearby, PlacesNearbySubRequest} from '../services/locationService'
import { CachedData } from "../types/common";
const placesRouter = express.Router();


// const assertLookForTypeExists: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const lookForTypes = req.query["lookForTypes"]
//         if(!lookForTypes){
//             res.locals.lookForTypes = []
//             next()
//         } else if(typeof lookForTypes !== 'string') {
//             next(new Error('lookForTypes is not a string'))
//         } else {
//             // todo assert that not too many values in here
//             res.locals.lookForTypes = lookForTypes.split(',')
//             next()
//         }
//     } catch (e) {
//         console.error(e)
//         next(e)
//     }
// }


// const assertAddressExists: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const address = req.query["address"]
//         if(!address){
//             next(new Error('Address is not defined'))
//         } else if(typeof address !== 'string') {
//             next(new Error('Address is not a string'))
//         } else {
//             res.locals.address = address
//             next()
//         }
//     } catch (e) {
//         console.error(e)
//         next(e)
//     }
// }

// const cacheLookUpAddressLatLong = async (address?: string): Promise<LatLngLiteral | undefined> => {
//     return undefined
// }


// const getLongLatFromAddress: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // todo change caching to use caching service
//         const cacheLookup: LatLngLiteral | undefined = await cacheLookUpAddressLatLong(res.locals.address)
//         if(cacheLookup) {
//             res.locals.latLongCached = true
//             res.locals.latLong = cacheLookup
//         } else {
//             res.locals.latLong = await getLatLngFromAddress(res.locals.address)
//         }
//         next()
//     } catch (e) {
//         console.error(e)
//         next(e)
//     }
// }

// const cacheLookUpPlacesNearby = async (subRequest: PlacesNearbySubRequest) => {
//     return undefined
// }

// interface PlacesNearbySubRequest {
//     type: string | undefined,
//     latLong: LatLngLiteral | undefined
// }

// const getPlacesNearby = async (subRequest: PlacesNearbySubRequest, res: Response) => {
//     try {
//         const cacheLookup = await cacheLookUpPlacesNearby(subRequest)
//         if(cacheLookup){
//             res.locals.dataCached = true
//             return cacheLookup
//         }

//         const googleRes = await client.placesNearby(
//             <PlacesNearbyRequest>{
//                 params: {
//                     // todo probably make radius a request variable
//                     radius: 40000,
//                     location: subRequest.latLong,
//                     keyword: subRequest.type,
//                     language: Language.en,
//                     key: process.env.GOOGLE_API_KEY,
//                     // name: 'indian'
//                 }
//             }
//         )
//         console.log(JSON.stringify(googleRes.data.results, null, 2))
//         return googleRes
//     } catch (e) {
//         console.error(e)
//         throw e
//     }
// }


function assertAutoCompleteInput(req: Request, res: Response, next: NextFunction){
    try {
        const autoCompleteInput = req.query["autoCompleteInput"]
        if(autoCompleteInput === undefined){
            throw new Error("autoCompleteInput query parameter not set")
        }
        res.locals.autoCompleteInput = autoCompleteInput
        next()
    } catch (e) {
        console.error(e)
        next(e)
    }

}


placesRouter.get("/address/autoComplete", assertAutoCompleteInput, async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("here!!")
        const googleRes = await client.placeAutocomplete(
            {
                params: {
                    input: res.locals.autoCompleteInput,
                    key: process.env.GOOGLE_API_KEY || ""
                }
            }
        )
        if(googleRes.data.error_message){
            throw new Error(googleRes.data.error_message)
        }
        // todo clean this into my own types
        res.json(
            googleRes.data.predictions
        )
    } catch (e) {
        console.error(e)
        next(e)
    }
})

placesRouter.get("/types/autoComplete", assertAutoCompleteInput, async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(
            getPlacesAutoComplete(res.locals.autoCompleteTypeInput) || []
        )
    } catch (e) {
        console.error(e)
        next(e)
    }
})

placesRouter.get(
    "/nearby",
     query('address').notEmpty().isString().escape(),
     query('lookForTypes').escape(),
     async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            throw new Error(`Validation error: ${JSON.stringify(result.array())}`)
    
        }
        const data = matchedData(req);
        const lookForTypes = data.lookForTypes ? data.lookForTypes.split(',') : []
        const {lat, lng, isCached: latLngCached} = await getLatLngFromAddress(data.address)
        
        const subRequests: PlacesNearbySubRequest[] | undefined = lookForTypes.map((type: string) => ({latLong: {lat, lng}, type: type}))
        // todo how to handle incomplete results? Should successful values be used
        // could always promise resolve but with an error state then partition them here
        const allPlaces = await BPromise.map(subRequests ? subRequests : [], (req: PlacesNearbySubRequest) => getPlacesNearby(req))

        console.log("allPlaces", allPlaces)
        const responseData: ApiPlacesResponse[] | undefined = allPlaces.flatMap((p: CachedData<PlacesNearbyResponseData>) => {
            return p.data.results.map(
                (value: Place) => ({
                    name: value.name,
                    lat: value.geometry?.location.lat,
                    long: value.geometry?.location.lng,
                    rating: value?.rating,
                    totalRatings: value?.user_ratings_total,
                    types: value.types?.map((a: AddressType) => a.toString()) || []
                })
            )
        })
        const finalResponse = {
            data: {
                places: responseData || [],
                center: {
                    lat, 
                    lng
                }
            },
            metadata: {
                cache: {
                    longLatCached: latLngCached,
                    dataCached: false
                },
                response: {
                    length: (responseData || []).length,
                }
            }
        }
        res.json(finalResponse)
    } catch (e) {
        console.error(e)
        next(e)
    }
})


export {
    placesRouter
}
