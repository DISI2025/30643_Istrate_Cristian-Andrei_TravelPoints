import axios from 'axios';
import {WishlistRequest} from "../models/wishlist/wishlistRequest";

const BASE_URL = "http://localhost:9090/wishlist";

export const getAllWishlists = async () => {
    const res = await axios.get(`${BASE_URL}`);
    return res.data;
};

export const getWishlistById = async (id: string) => {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data;
};

export const createWishlist = async (wishlist: WishlistRequest) => {
    const res = await axios.post(`${BASE_URL}`, wishlist);
    return res.data;
};

export const deleteWishlist = async (id: any) => {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
};
