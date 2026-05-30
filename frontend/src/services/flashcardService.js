import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// Get all flashcard sets
export const getAllFlashcardSets = async () => {
    try {
        const response = await axiosInstance.get(
            API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS
        );
        return response.data;
    } catch (error) {
        throw error?.response?.data || {message:"failed to get All flashcardSets"};
    }
};

// Get flashcards by document ID
export const getFlashcards = async (documentId) => {
    try {
        const response = await axiosInstance.get(
            API_PATHS.FLASHCARDS.GET_FLASHCARDS(documentId)
        );
        return response.data;
    } catch (error) {
        throw error?.response?.data || {message:"failed to get All flashcards"};
    }
};

// Review flashcard (e.g., mark correct/incorrect)
export const reviewFlashcard = async (cardId, cardIndex) => {
    try {
        const response = await axiosInstance.post(
            API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId),
            {
                cardIndex,
            }
        );
        return response.data;
    } catch (error) {
        throw error?.response?.data || {message:"failed to get All reviewFlashcards"};
    }
};

// Toggle star (favorite) flashcard
export const toggleStarFlashcard = async (cardId) => {
    try {
        const response = await axiosInstance.patch(
            API_PATHS.FLASHCARDS.TOGGLE_STAR_FLASHCARD(cardId)
        );
        return response.data;
    } catch (error) {
        throw error?.response?.data || {message:"failed to update toggleFlashcards"};
    }
};

// Delete flashcard set
export const deleteFlashcardSet = async (id) => {
    try {
        const response = await axiosInstance.delete(
            API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id)
        );
        return response.data;
    } catch (error) {
        throw error?.response?.data || {message:"failed to deleteFlashcards"};
    }
};

const flashcardService={
    getAllFlashcardSets,
    getFlashcards,
    reviewFlashcard,
    toggleStarFlashcard,
    deleteFlashcardSet,
}

export default flashcardService