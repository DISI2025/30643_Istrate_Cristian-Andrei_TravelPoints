import { StatsResponse } from "../models/stats/statsResponse";
import axiosInstance from "./axiosInstance";

const BASE_URL = "/visit";

export const getStatistics = async (): Promise<StatsResponse> => {
  const res = await axiosInstance.get<StatsResponse>(`${BASE_URL}/stats`);
  return res.data;
};
