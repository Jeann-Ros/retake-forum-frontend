export type PandaScoreTeam = {
  name?: string | null;
};

export type PandaScorePlayer = {
  id: number;
  name?: string | null;
  first_name?: string | null;
  slug?: string | null;
  current_team?: PandaScoreTeam | null;
};

export type PandaScoreUpcomingMatch = {
  id: number;
  name?: string | null;
  scheduled_at?: string | null;
  begin_at?: string | null;
  tournament?: {
    name?: string | null;
    country?: string | null;
    region?: string | null;
  } | null;
  serie?: {
    full_name?: string | null;
  } | null;
  league?: {
    name?: string | null;
  } | null;
};

export type PlayerListItem = {
  id: number;
  rank: number;
  name: string;
};

export type UpcomingTournamentListItem = {
  id: number;
  name: string;
  scheduled_at?: string | null;
  country: string;
};
