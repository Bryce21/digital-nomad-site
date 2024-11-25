import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AttractionsState, Attraction } from "../types";
import { getAttractions } from "../../services/viatorService";
import {
  AttractionSearchResult,
  AttractionsPagination,
  AttractionResponse,
  ViatorDestination,
} from "../../services/types";

export const initialState: AttractionsState = {
  filters: {},
  data: [],
  loading: true,
  destination: undefined,
  totalCount: 0,
  currentPage: 0,
};

export const fetchAttractionsPage = createAsyncThunk(
  "attractions/fetchPage",
  async ({
    inputAddress,
    pagination,
  }: {
    inputAddress: string;
    pagination?: AttractionsPagination;
  }) => {
    const res = await getAttractions(inputAddress, pagination);
    return res;
  }
);

export const attractionsReducer = createSlice({
  name: "attractions",
  initialState,
  reducers: {
    setRows: (state, action: PayloadAction<Attraction[]>) => {
      state.data = action.payload;
      state.loading = false;
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

export const { setRows } = attractionsReducer.actions;

export default attractionsReducer.reducer;
