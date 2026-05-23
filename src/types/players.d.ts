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
  rank_diff: number;
  points: number;
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
  rankDiff: number;
};
