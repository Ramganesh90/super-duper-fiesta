import { combineReducers } from "@reduxjs/toolkit";
import { userReducer } from "./userReducer";
import { groceryReducer } from "./groceryReducer";

const reducer = combineReducers({
    user: userReducer,
    grocery: groceryReducer
});

export default reducer;
