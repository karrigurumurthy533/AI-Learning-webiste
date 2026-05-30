import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// Get all documents
export const getDocuments = async () => {
    try {
        const response = await axiosInstance.get(
            API_PATHS.DOCUMENTS.GET_DOCUMENTS
        );


        const res = response.data;

        // ✅ Always return an array (VERY IMPORTANT)
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.documents)) return res.documents;
        if (Array.isArray(res?.data)) return res.data;

        return [];
    } catch (error) {
        throw error?.response?.data || { message: "Failed to fetch documents" };
    }
};

// Upload document
export const uploadDocument = async (formData) => {
    try {
        const response = await axiosInstance.post(
            API_PATHS.DOCUMENTS.UPLOAD_DOCUMENT,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error?.response?.data || { message: "Failed to upload document" };
    }
};

// Get single document
export const getDocumentById = async (id) => {
    try {
        const response = await axiosInstance.get(
            API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(id)
        );
        return response.data;
    } catch (error) {
        throw error?.response?.data || { message: "Failed to fetch document" };
    }
};

// Delete document
export const deleteDocument = async (id) => {
    try {
        const response = await axiosInstance.delete(
            API_PATHS.DOCUMENTS.DELETE_DOCUMENT(id)
        );
        return response.data;
    } catch (error) {
        throw error?.response?.data || { message: "Failed to delete document" };
    }
};

const documentService = {
    getDocuments,
    uploadDocument,
    getDocumentById,
    deleteDocument,
};

export default documentService;