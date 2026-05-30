import axiosInstance from "..utils/axiosInstance";
import { API_PATHS } from "..utils/apiPaths";

// Get all quizzes
export const getQuizzes = async (documentId) => {
    try {
        const response = await axiosInstance.get(
            API_PATHS.QUIZZES.GET_QUIZZES(documentId)
        );
        return response.data;
    } catch (error) {
        throw error?.response?.data || {message:"failed to fetch quizzes"};
    }
};

// Get quiz by ID
export const getQuizById = async (quizId) => {
    try {
        const response = await axiosInstance.get(
            API_PATHS.QUIZZES.GET_QUIZ_BY_ID(quizId)
        );
        return response.data;
    } catch (error) {
        throw error?.response?.data || {message:"failed to fetch quiz"};
    }
};

// Submit quiz answers
export const submitQuiz = async (quizId, answers) => {
    try {
        const response = await axiosInstance.post(
            API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId),
            answers
        );
        return response.data;
    } catch (error) {
        throw error?.response?.data || {message:"failed to submit quiz"};
    }
};

// Get quiz results
export const getQuizResults = async (quizId) => {
    try {
        const response = await axiosInstance.get(
            API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId)
        );
        return response.data;
    } catch (error) {
        throw error?.response?.data ||{message:"failed to fetch quiz results "};
    }
};

// Delete quiz
export const deleteQuiz = async (quizId) => {
    try {
        const response = await axiosInstance.delete(
            API_PATHS.QUIZZES.DELETE_QUIZ(quizId)
        );
        return response.data;
    } catch (error) {
        throw error?.response?.data || {message:"failed to delete quiz"};
    }
};

const quizService={
    getQuizzes,
    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz,
}

export default quizService;