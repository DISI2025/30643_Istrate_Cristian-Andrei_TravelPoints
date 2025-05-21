import axiosInstance from "./axiosInstance";

const CONTACT_URL = "/contact";

export const sendContactMessage = async (data: { userId: number; subject: string; message: string }) => {
    const res = await axiosInstance.post(CONTACT_URL, data);
    return res.data;
};
