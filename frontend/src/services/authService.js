import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// Login user
export const login = async (email, password) => {
    try {
        const response = await axiosInstance.post(
            API_PATHS.AUTH.LOGIN,
            {
                email,
                password,
            }
        );

        const res = response.data;

        // Save token if returned
        const token = res?.token;
        if (token) {
            localStorage.setItem("token", token);
        }

        return res;
    } catch (error) {
        throw error?.response?.data || { message: "An Unknown error occurred" };
    }
};

// Register user
export const register = async (username, email, password) => {
    try {
        const response = await axiosInstance.post(
            API_PATHS.AUTH.REGISTER,
            {
                username,
                email,
                password,
            }
        );

        return response.data;
    } catch (error) {
        throw error?.response?.data || { message: "An Unknown error occurred" };
    }
};

// Get user profile
export const getProfile = async () => {
    try {
        const response = await axiosInstance.get(
            API_PATHS.AUTH.GET_PROFILE
        );

        return response.data;
    } catch (error) {
        throw error?.response?.data || { message: "An Unknown error occurred" };
    }
};

// Update profile
export const updateProfile = async (userData) => {
    try {
        const response = await axiosInstance.put(
            API_PATHS.AUTH.UPDATE_PROFILE,
            userData
        );

        return response.data;
    } catch (error) {
        throw error?.response?.data || { message: "An Unknown error occurred" };
    }
};

// Change password
export const changePassword = async (passwords) => {
    try {
        const response = await axiosInstance.post(
            API_PATHS.AUTH.CHANGE_PASSWORD,
            passwords
        );

        return response.data;
    } catch (error) {
        throw error?.response?.data || { message: "An Unknown error occurred" };
    }
};

// Export as service object
const authService = {
    login,
    register,
    getProfile,
    updateProfile,
    changePassword,
};

export default authService;