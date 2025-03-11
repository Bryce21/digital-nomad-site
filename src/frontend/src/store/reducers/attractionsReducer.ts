/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AttractionsState, Attraction, AttractionFilters } from '../types';
import getAttractions from '../../services/viatorService';
import {
  AttractionsPagination,
  AttractionResponse,
} from '../../services/types';

export const initialState: AttractionsState = {
  data: [],
  loading: true,
  destination: undefined,
  totalCount: undefined,
  pageStart: undefined,
  filters: {},
  pageSize: 15,
};

export const fetchAttractionsPage = createAsyncThunk(
  'attractions/fetchPage',
  async ({
    inputAddress,
    pagination,
    maxPrice,
    minRating,
    searchTerm,
    minPrice,
  }: {
    inputAddress: string;
    pagination?: AttractionsPagination;
    maxPrice?: number;
    minPrice?: number;
    minRating?: number;
    searchTerm?: string;
  }) => {
    const res = await getAttractions(inputAddress, pagination, {
      maxPrice,
      minRating,
      searchTerm,
      minPrice,
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
    setPageSize: (state, action: PayloadAction<number>) => {
      if (state.pageSize !== action.payload) {
        state.pageSize = action.payload;
      }
    },

    setFilters: (
      state,
      action: PayloadAction<AttractionFilters | undefined>
    ) => {
      if (action.payload) {
        state.filters = action.payload;
      } else {
        state.filters = {};
      }
    },

    setPageStart: (state, action: PayloadAction<number | undefined>) => {
      if (state.pageStart !== action.payload) {
        state.pageStart = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAttractionsPage.fulfilled,
      (state, action: PayloadAction<AttractionResponse>) => {
        state.data = action.payload.attractions.products || [];
        state.totalCount = action.payload.attractions.totalCount;
        state.loading = false;
        state.error = undefined;

        state.destination = action.payload.destination;
      }
    );
  },
});

export const {
  setRows,
  setLoading,
  setError,
  setFilters,
  setPageStart,
  setPageSize,
} = attractionsReducer.actions;

export default attractionsReducer.reducer;
