import axios from "axios";
import { BASE_URL } from "./apiPaths";

// Create Axios instance
const axiosInstance = await axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    Accept:"application/json",

});

// Request interceptor (attach token)
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor (handle errors globally)
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.message){
            if(error.response.status===500){
                console.log("Server error Please try again later");
            }else if(error.code==="ECONNABORTED"){
                console.log("Request timeout.please try again");
            }
        }
        const status = error?.response?.status;

        if (status === 401) {
            // Token expired or unauthorized
            localStorage.removeItem("token");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;