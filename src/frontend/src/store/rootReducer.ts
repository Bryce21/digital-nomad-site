import { combineReducers } from "@reduxjs/toolkit";
import { searchReducer } from "./reducers/searchReducer";

const rootReducer = combineReducers({
  search: searchReducer.reducer,
});

export default rootReducer;
