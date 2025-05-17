import { StatsResponse, TopStatsResponse } from "../models/stats/statsResponse";
import axiosInstance from "./axiosInstance";

const BASE_URL = "/visit";

export const getStatistics = async (): Promise<StatsResponse> => {
  const res = await axiosInstance.get<StatsResponse>(`${BASE_URL}/stats`);
  return res.data;
};

export const getTopStatistics = async (): Promise<TopStatsResponse> => {
  const res = await axiosInstance.get<TopStatsResponse>(
    `${BASE_URL}/top-stats/10`
  );
  return res.data;
};
