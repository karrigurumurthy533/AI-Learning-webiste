import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// Get dashboard progress data
export const getDashboardProgress = async () => {
    try {
        const response = await axiosInstance.get(
            API_PATHS.PROGRESS.DASHBOARD
        );
        return response.data;
       
    } catch (error) {
        throw error?.response?.data || {message:"failed to fetch dashboard data"};
    }
};
const progressService={
    getDashboardProgress,
}

export default progressService;