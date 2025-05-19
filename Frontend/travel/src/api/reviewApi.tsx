import axiosInstance from "./axiosInstance";

const BASE_URL = "/review";

export const getAllReviewsByAttractionId = async (attractionId: string) => {
    const res = await axiosInstance.get(`${BASE_URL}/attractions/${attractionId}/reviews`);
    return res.data;
}
