export type CsApiPlayerStats = {
  id: number;
  name: string;
  rank: number;
  rating: number;
};

export type CsApiTeamRank = {
  id: number;
  name: string;
  rank: number;
  points: number;
  points_diff: number;
};

export type PlayerListItem = {
  id: number;
  rank: number;
  name: string;
  rating: number;
};

export type WorldRankingListItem = {
  id: number;
  rank: number;
  name: string;
  points: number;
  pointsDiff: number;
};
