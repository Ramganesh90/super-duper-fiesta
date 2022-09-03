import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { composeWithDevTools } from "@redux-devtools/extension";
import thunk from "redux-thunk";
import reducer from "./reducer";

const store = configureStore({
    reducer
});

export default store;
