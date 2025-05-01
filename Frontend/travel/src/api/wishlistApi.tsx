import axiosInstance from "./axiosInstance";
import {WishlistRequest} from "../models/wishlist/wishlistRequest";

const BASE_URL = "/wishlist";

export const getAllWishlists = async () => {
    const res = await axiosInstance.get(`${BASE_URL}`);
    return res.data;
};

export const getWishlistById = async (id: string) => {
    const res = await axiosInstance.get(`${BASE_URL}/${id}`);
    return res.data;
};

export const createWishlist = async (wishlist: WishlistRequest) => {
    const res = await axiosInstance.post(`${BASE_URL}`, wishlist);
    return res.data;
};

export const deleteWishlist = async (id: any) => {
    const res = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return res.data;
};
