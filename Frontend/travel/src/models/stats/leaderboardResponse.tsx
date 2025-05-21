export interface LeaderboardResponse {
  id: number;
  attractionName: string;
  score: number;
}

export type LeaderboardProps = {
  data: LeaderboardResponse[];
};
