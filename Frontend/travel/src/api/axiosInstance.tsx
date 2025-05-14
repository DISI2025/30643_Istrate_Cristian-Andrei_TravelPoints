import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {logoutUser} from "./userApi";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9090",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    const isExpired = checkExpiredToken(token);
    if (isExpired) {
      logoutUser();
      window.location.href = "/login";
      return Promise.reject(new Error("Token expired. Redirecting to login."));
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const checkExpiredToken = (token: string) => {
  const decodeToken = jwtDecode(token);
  const expirationTime = decodeToken.exp!
  const currentTime = Math.floor(Date.now() / 1000);

  return expirationTime < currentTime;

}
export default axiosInstance;
