import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";


const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data for file upload
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

export default uploadImage;

