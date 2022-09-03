import { LOGIN, LOGOUT, SIGNUP } from "../actionTypes/user";

export const userReducer = (state = {}, action) => {
    switch (action.type) {
        case LOGIN: {
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true
            };
        }
        case SIGNUP: {
            return {
                ...state,
                ...action.payload
            };
        }
        case LOGOUT: {
            return {
                ...state,
                ...action.payload,
                isAuthenticated: false
            };
        }
        default:
            return state;
    }
};
