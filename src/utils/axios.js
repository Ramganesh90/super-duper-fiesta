import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true
});

axiosInstance.interceptors.response.use((res) => {
    console.log(
        "🚀 ~ file: axios.js ~ line 14 ~ axiosInstance.interceptors.response.use ~ res",
        document.cookie || "Cookie Not found"
    );
    return res;
});

export default axiosInstance;
