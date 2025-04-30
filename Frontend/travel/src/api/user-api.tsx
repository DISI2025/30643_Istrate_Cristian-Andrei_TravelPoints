import axios from "axios";

const BASE_URL = "http://localhost:8080/user";

export const registerUser = async (values: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    console.log("Registration values:", values);
    const response = await axios.post(`${BASE_URL}/register`, values);
    return response.data;
  } catch (error: any) {
    const rawMessage = error.response?.data || "Something went wrong";
    const match = rawMessage.match(/"(.*?)"/);
    throw match ? match[1] : rawMessage;
  }
};

export const loginUser = async (values: { name: string; password: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, values);
    return response.data;
  } catch (error: any) {
    const rawMessage = error.response?.data || "Something went wrong";
    const match = rawMessage.match(/"(.*?)"/);
    throw match ? match[1] : rawMessage;
  }
};
