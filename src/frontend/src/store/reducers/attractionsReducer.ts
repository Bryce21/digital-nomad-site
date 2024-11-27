/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AttractionsState, Attraction } from '../types';
import getAttractions from '../../services/viatorService';
import {
  AttractionsPagination,
  AttractionResponse,
} from '../../services/types';

export const initialState: AttractionsState = {
  data: [],
  loading: true,
  destination: undefined,
  totalCount: 0,
  currentPage: 0,
};

export const fetchAttractionsPage = createAsyncThunk(
  'attractions/fetchPage',
  async ({
    inputAddress,
    pagination,
    maxPrice,
    minRating,
  }: {
    inputAddress: string;
    pagination?: AttractionsPagination;
    maxPrice?: number;
    minRating?: number;
  }) => {
    console.log('info', { maxPrice, minRating });
    const res = await getAttractions(inputAddress, pagination, {
      maxPrice,
      minRating,
    });
    return res;
  }
);

export const attractionsReducer = createSlice({
  name: 'attractions',
  initialState,
  reducers: {
    setRows: (state, action: PayloadAction<Attraction[]>) => {
      state.data = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<Error | undefined>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAttractionsPage.fulfilled,
      (state, action: PayloadAction<AttractionResponse>) => {
        state.data = action.payload.attractions.products;
        state.totalCount = action.payload.attractions.totalCount;
        state.loading = false;

        state.destination = action.payload.destination;
      }
    );
  },
});

export const { setRows, setLoading, setError } = attractionsReducer.actions;

export default attractionsReducer.reducer;
