export const BASE_URL = "http://localhost:8000/api";

export const API_PATHS = {
    // AUTH APIs
    AUTH: {
        REGISTER: "/auth/register",
        LOGIN: "/auth/login",
        GET_PROFILE: "/auth/profile",
        UPDATE_PROFILE: "/auth/profile/update",
        CHANGE_PASSWORD: "/auth/change-password",
    },

    // DOCUMENT APIs
    DOCUMENTS: {
        UPLOAD_DOCUMENT: "/documents/uploads",
        GET_DOCUMENTS: "/documents",
        GET_DOCUMENT_BY_ID: (id) => `/documents/${id}`,
        DELETE_DOCUMENT: (id) => `/documents/${id}`,
    },

    // AI APIs
    AI: {
        GENERATE_FLASHCARDS: "/ai/generate-flashcards",
        GENERATE_QUIZ: "/ai/generate-quiz",
        GENERATE_SUMMARY: "/ai/generate-summary",
        CHAT: "/ai/chat",
        EXPLAIN_CONCEPT: "/ai/explain-concept",
        GET_CHAT_HISTORY: (documentId) => `/ai/chat-history/${documentId}`,
    },

    // FLASHCARDS APIs
    FLASHCARDS: {
        GET_ALL_FLASHCARD_SETS: "/flashcards/",
        GET_FLASHCARDS: (documentId) => `/flashcards/${documentId}`,
        REVIEW_FLASHCARD: (cardId) => `/flashcards/${cardId}/review`,
        TOGGLE_STAR_FLASHCARD: (cardId) => `/flashcards/${cardId}/star`,
        DELETE_FLASHCARD_SET: (id) => `/flashcards/${id}`,
    },

    // QUIZZES APIs
    QUIZZES: {
        GET_QUIZZES: "/quizzes/",
        GET_QUIZ_BY_ID: (quizId) => `/quizzes/${quizId}`,
        SUBMIT_QUIZ: (quizId) => `/quizzes/${quizId}/submit`,
        GET_QUIZ_RESULTS: (quizId) => `/quizzes/${quizId}/results`,
        DELETE_QUIZ: (quizId) => `/quizzes/${quizId}`,
    },

    // PROGRESS APIs
    PROGRESS: {
        DASHBOARD: "/progress/dashboard",
    },
    IMAGES:{
        GENERATE_IMAGE: "/images/generate"
    }
};