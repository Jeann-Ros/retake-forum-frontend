import axios from "axios";
import type {
  PandaScorePlayer,
  PandaScoreUpcomingMatch,
  PlayerListItem,
  UpcomingTournamentListItem,
} from "../types/players";

const csApiClient = axios.create({
  baseURL: "https://api.pandascore.co",
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.VUE_APP_PANDASCORE_TOKEN || ""}`,
  },
});

function formatPlayer(player: PandaScorePlayer, index: number): PlayerListItem {
  return {
    id: player.id,
    rank: index + 1,
    name: player.name || player.first_name || player.slug || "Jogador sem nome",
  };
}

function formatMatch(match: PandaScoreUpcomingMatch): UpcomingTournamentListItem {
  return {
    id: match.id,
    name:
      match.tournament?.name ||
      match.serie?.full_name ||
      match.league?.name ||
      match.name ||
      "Torneio sem nome",
    scheduled_at: match.scheduled_at || match.begin_at,
    country: match.tournament?.country || match.tournament?.region || "-",
  };
}

const csApiService = {
  async getTopPlayers(limit = 10): Promise<PlayerListItem[]> {
    const response = await csApiClient.get<PandaScorePlayer[]>("/csgo/players", {
      params: {
        "page[number]": 1,
        "page[size]": limit,
      },
    });

    return response.data.map(formatPlayer);
  },

  async getUpcomingMatches(limit = 1): Promise<UpcomingTournamentListItem[]> {
    const response = await csApiClient.get<PandaScoreUpcomingMatch[]>(
      "/csgo/matches/upcoming",
      {
        params: {
          "filter[videogame_title]": "cs-2",
          "page[size]": limit,
        },
      },
    );

    return response.data.map(formatMatch);
  },
};

export default csApiService;
