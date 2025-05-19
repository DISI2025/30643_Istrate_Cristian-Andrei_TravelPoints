import axiosInstance from "./axiosInstance";
import {ReviewRequest} from "../models/review/reviewRequest";
import {ReviewResponse} from "../models/review/reviewResponse";

const BASE_URL = "/review";

export const getAllReviewsByAttractionId = async (attractionId: string) => {
    const res = await axiosInstance.get(`${BASE_URL}/attractions/${attractionId}/reviews`);
    return res.data;
}

export const createReview = async (userId: string, review: ReviewRequest) => {
    const res = await axiosInstance.post(`${BASE_URL}/${userId}`, review);
    return res.data;
}
