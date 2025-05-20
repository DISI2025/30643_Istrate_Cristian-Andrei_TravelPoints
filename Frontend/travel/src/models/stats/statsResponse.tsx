export interface StatsResponse {
  visitsByHour: number[];
  visitsByMonth: number[];
}

export interface TopStats {
  name: string;
  visitsCount: number;
}

export interface TopStatsResponse {
  topAttractions: TopStats[];
  topLocations: TopStats[];
}
