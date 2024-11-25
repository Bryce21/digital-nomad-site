import { combineReducers } from "@reduxjs/toolkit";
import { searchReducer } from "./reducers/searchReducer";
import { attractionsReducer } from "./reducers/attractionsReducer";

const rootReducer = combineReducers({
  search: searchReducer.reducer,
  attractions: attractionsReducer.reducer,
});

export default rootReducer;
