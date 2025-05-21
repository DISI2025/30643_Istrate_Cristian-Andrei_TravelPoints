import { LeaderboardResponse } from "../models/stats/leaderboardResponse";
import axiosInstance from "./axiosInstance";

const BASE_URL = "/leaderboard";

export const getLeaderboardStats = async (): Promise<LeaderboardResponse[]> => {
  const res = await axiosInstance.get<LeaderboardResponse[]>(BASE_URL);
  return res.data;
};
