import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import React, { useEffect, useState } from "react";
import { Col, Row, Select, Tag, TagProps } from "antd";
import { getPlacesNearby } from "../../../../../services/LocationService";
import { LatLng, Place, PlacesNearbyResponse } from "../../../../../types/types";
import { GoogleMap } from "./MapDisplay";
import type { SelectProps } from 'antd';
import { SelectComponent } from "../../../../inputs/SelectPlaces/SelectComponent";


type TagRender = SelectProps['tagRender'];

interface MapWithDataProps {
    location: string,
    zoom?: number
}




const availablePlaceTypes = ["accounting", "airport", "amusement_park", "aquarium", "art_gallery", "atm", "bakery", "bank", "bar", "beauty_salon", "bicycle_store", "book_store", "bowling_alley", "bus_station", "cafe", "campground", "car_dealer", "car_rental", "car_repair", "car_wash", "casino", "cemetery", "church", "city_hall", "clothing_store", "convenience_store", "courthouse", "dentist", "department_store", "doctor", "drugstore", "electrician", "electronics_store", "embassy", "fire_station", "florist", "funeral_home", "furniture_store",
    "gas_station", "gym", "hair_care", "hardware_store", "hindu_temple", "home_goods_store", "hospital", "insurance_agency", "jewelry_store", "laundry", "lawyer", "library", "light_rail_station", "liquor_store", "local_government_office", "locksmith", "lodging", "meal_delivery", "meal_takeaway", "mosque", "movie_rental", "movie_theater",
    "moving_company", "museum", "night_club", "painter", "park", "parking", "pet_store", "pharmacy", "physiotherapist", "plumber", "police", "post_office", "primary_school", "real_estate_agency", "restaurant", "roofing_contractor",
    "rv_park", "school", "secondary_school", "shoe_store", "shopping_mall", "spa", "stadium", "storage", "store", "subway_station", "supermarket", "synagogue", "taxi_stand", "tourist_attraction", "train_station", "transit_station", "travel_agency", "university", "veterinary_care", "zoo",
]

// https://visgl.github.io/react-google-maps/docs



export function MapWithData(props: MapWithDataProps) {
    console.log("MapWithData rerendering")
    const [center, setCenter] = useState<LatLng>()
    const [types, setTypes] = useState<string[]>([])
    const [markerPlaces, setMarkerPlaces] = useState<Place[]>([])

    const map = useMap()


    useEffect(
        () => {
            console.log("rerender useEffect firing!!")
            getPlacesNearby(props.location, types)
                .then((res: PlacesNearbyResponse) => {
                    console.log("response", res)
                    console.log('map', map)
                    if (map?.setCenter) {
                        console.log('setting center!!!')
                        map.setCenter(res.data.center)
                    }

                    setCenter(res.data.center)
                    setMarkerPlaces(res.data.places)
                })
        },
        [props.location]
    )


    useEffect(() => {
        // todo - optimization- if the change is from removing a type then do not need to send api request
        getPlacesNearby(props.location, types)
            .then((res: PlacesNearbyResponse) => {
                console.log('place response', res)
                setMarkerPlaces(res.data.places)

            })

    }, [types])



    function renderSelect() {
        return <>
            <SelectComponent
                options={
                    availablePlaceTypes.map(v => ({
                        label: v,
                        value: v
                    })
                    )
                }
                onChange={(v) => setTypes(v)}
            />
        </>
    }

    function renderMap() {
        if (!center) {
            // todo loading icon
            return
        }
        return <div style={{ height: '90vh' }}>
            <GoogleMap center={center} markerData={markerPlaces} centerAddress={props.location} />
        </div>
    }


    // todo move the select thing into the map as a map control component
    return <>
        <div className={"mapDisplayDiv"} style={{ height: '90vh' }}>
            <Row>
                <Col span={4}>

                    {renderSelect()}
                </Col>
            </Row>
            <Row>
                <Col span={24}>{renderMap()}</Col>
            </Row>
        </div>
    </>
}
