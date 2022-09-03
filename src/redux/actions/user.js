import axiosInstance from "../../utils/axios";
import { LOGIN, LOGOUT } from "../actionTypes/user";
export const userLogin = (payload) => async (dispatch) => {
    const { data } = await axiosInstance.post("/user/login", payload);
    dispatch({
        type: LOGIN,
        payload: data
    });
};

export const userLogout = (payload) => async (dispatch) => {
    const { data } = await axiosInstance.post("/user/logout", payload);
    dispatch({
        type: LOGOUT,
        payload: data
    });
};
