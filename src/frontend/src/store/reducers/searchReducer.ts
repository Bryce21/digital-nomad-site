/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Search, SetSearchPayload } from '../types';
import { LatLng, Place } from '../../types/types';

export const initialState: Search = {
  inputAddress: undefined,
  latLong: undefined,
  places: [],
  colors: {},
  searchTypes: [],
  error: undefined,
};

const colors = ['blue', 'orange', 'green', 'cyan', 'yellow'];

export const searchReducer = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchAddress: (state, action: PayloadAction<string | undefined>) => {
      if (state.inputAddress !== action.payload) {
        state.inputAddress = action.payload;
      }
    },

    setSearchCenter: (state, action: PayloadAction<LatLng>) => {
      if (state.latLong !== action.payload) {
        state.latLong = action.payload;
      }
    },

    setSearch: (state, action: PayloadAction<SetSearchPayload>) => {
      if (state.inputAddress !== action.payload.inputAddress) {
        state.inputAddress = action.payload.inputAddress;
      }

      if (state.latLong !== action.payload.latLong) {
        state.latLong = action.payload.latLong;
      }
    },

    setPlaces: (state, action: PayloadAction<Place[]>) => {
      state.places = action.payload;
    },

    setSearchTypes: (state, action: PayloadAction<string[]>) => {
      state.searchTypes = action.payload;

      const types = action.payload;

      if (types.length) {
        const updatedColorMap: { [index: string]: string } = {
          ...state.colors,
        };

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

        state.colors = updatedColorMap;
      } else {
        state.colors = {};
      }
    },

    setError: (state, action: PayloadAction<Error | undefined>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSearch,
  setSearchAddress,
  setPlaces,
  setSearchCenter,
  setSearchTypes,
  setError,
} = searchReducer.actions;

export default searchReducer.reducer;
