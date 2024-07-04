import { useMap } from '@vis.gl/react-google-maps';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import getPlacesNearby from '../../../../../services/LocationService';
import {
  LatLng,
  Place,
  PlacesNearbyResponse,
} from '../../../../../types/types';
import { GoogleMap } from './MapDisplay';
import { SelectComponent } from '../../../../inputs/SelectPlaces/SelectComponent';

interface MapWithDataProps {
  location: string;
  // zoom?: number;
}

const availablePlaceTypes = [
  'accounting',
  'airport',
  'amusement_park',
  'aquarium',
  'art_gallery',
  'atm',
  'bakery',
  'bank',
  'bar',
  'beauty_salon',
  'bicycle_store',
  'book_store',
  'bowling_alley',
  'bus_station',
  'cafe',
  'campground',
  'car_dealer',
  'car_rental',
  'car_repair',
  'car_wash',
  'casino',
  'cemetery',
  'church',
  'city_hall',
  'clothing_store',
  'convenience_store',
  'courthouse',
  'dentist',
  'department_store',
  'doctor',
  'drugstore',
  'electrician',
  'electronics_store',
  'embassy',
  'fire_station',
  'florist',
  'funeral_home',
  'furniture_store',
  'gas_station',
  'gym',
  'hair_care',
  'hardware_store',
  'hindu_temple',
  'home_goods_store',
  'hospital',
  'insurance_agency',
  'jewelry_store',
  'laundry',
  'lawyer',
  'library',
  'light_rail_station',
  'liquor_store',
  'local_government_office',
  'locksmith',
  'lodging',
  'meal_delivery',
  'meal_takeaway',
  'mosque',
  'movie_rental',
  'movie_theater',
  'moving_company',
  'museum',
  'night_club',
  'painter',
  'park',
  'parking',
  'pet_store',
  'pharmacy',
  'physiotherapist',
  'plumber',
  'police',
  'post_office',
  'primary_school',
  'real_estate_agency',
  'restaurant',
  'roofing_contractor',
  'rv_park',
  'school',
  'secondary_school',
  'shoe_store',
  'shopping_mall',
  'spa',
  'stadium',
  'storage',
  'store',
  'subway_station',
  'supermarket',
  'synagogue',
  'taxi_stand',
  'tourist_attraction',
  'train_station',
  'transit_station',
  'travel_agency',
  'university',
  'veterinary_care',
  'zoo',
];

// https://visgl.github.io/react-google-maps/docs

const colors = ['blue', 'orange', 'green', 'cyan', 'yellow'];

export function MapWithData(props: MapWithDataProps) {
  console.log('MapWithData rerendering');
  const [center, setCenter] = useState<LatLng>();
  const [types, setTypes] = useState<string[]>([]);
  const [markerPlaces, setMarkerPlaces] = useState<Place[]>([]);

  const [colorMap, setColorMap] = useState<{ [index: string]: string }>({});

  const map = useMap();

  useEffect(() => {
    console.log('rerender useEffect firing!!');
    getPlacesNearby(props.location, types).then((res: PlacesNearbyResponse) => {
      if (map?.setCenter) {
        map.setCenter(res.data.center);
      }

      setCenter(res.data.center);
      setMarkerPlaces(res.data.places);
    });
  }, [props.location]);

  useEffect(() => {
    // todo - optimization- if the change is from removing a type
    // then do not need to send api request
    if (types.length) {
      getPlacesNearby(props.location, types).then(
        (res: PlacesNearbyResponse) => {
          console.log('place response', res);
          setMarkerPlaces(res.data.places);
        },
      );
    } else {
      setMarkerPlaces([]);
    }
  }, [types]);

  useEffect(() => {
    if (types.length) {
      const updatedColorMap: { [index: string]: string } = { ...colorMap };

      //  iterare over color map and remove those that are not in types to handle removal
      Object.keys(updatedColorMap).forEach((type: string) => {
        const inSelectedTypes = types.find((x) => x === type);
        if (!inSelectedTypes) {
          delete updatedColorMap[type];
        }
      });

      // handle adding a type that needs a color
      types.forEach((type: string) => {
        if (!updatedColorMap[type]) {
          const nextColorIndex = Object.keys(updatedColorMap).length;
          const color = colors[nextColorIndex] || 'default';
          updatedColorMap[type] = color;
        }
      });

      setColorMap(updatedColorMap);
    } else {
      setColorMap({});
    }
  }, [types]);

  function renderSelect() {
    console.log('renderSelect color map', { colorMap, availablePlaceTypes });
    return (
      <SelectComponent
        options={availablePlaceTypes.map((v: string) => ({
          // todo cleanup label
          label: (v.charAt(0).toUpperCase() + v.slice(1)).replaceAll('_', ' '),
          value: v,
        }))}
        colors={colorMap}
        onChange={(v) => setTypes(v)}
      />
    );
  }

  function renderMap(): JSX.Element | undefined {
    if (!center) {
      // todo loading icon
      return undefined;
    }
    return (
      <div style={{ height: '90vh' }}>
        <GoogleMap
          center={center}
          markerData={markerPlaces}
          centerAddress={props.location}
          colors={colorMap}
        />
      </div>
    );
  }

  // todo move the select thing into the map as a map control component
  return (
    <div className="mapDisplayDiv" style={{ height: '90vh' }}>
      <Row>
        <Col span={4}>{renderSelect()}</Col>
      </Row>
      <Row>
        <Col span={24}>{renderMap()}</Col>
      </Row>
    </div>
  );
}

export default MapWithData;
