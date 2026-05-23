import axiosInstance from "./axiosInstance";
import type {
  CsApiPlayerStats,
  CsApiTeamRank,
  PlayerListItem,
  WorldRankingListItem,
} from "../types/players";

function formatPlayer(player: CsApiPlayerStats): PlayerListItem {
  return {
    id: player.id,
    rank: player.rank,
    name: player.name || "Jogador sem nome",
    rating: player.rating,
  };
}

function formatTeamRank(team: CsApiTeamRank): WorldRankingListItem {
  return {
    id: team.id,
    rank: team.rank,
    name: team.name || "Time sem nome",
    points: team.points,
    rankDiff: team.rank_diff,
  };
}

const csApiService = {
  async getTopPlayers(limit = 10): Promise<PlayerListItem[]> {
    const response = await axiosInstance.get<CsApiPlayerStats[]>("/cs/players", {
      params: {
        limit,
      },
    });

    return response.data.map(formatPlayer);
  },

  async getWorldRankings(limit = 10): Promise<WorldRankingListItem[]> {
    const response = await axiosInstance.get<CsApiTeamRank[]>("/cs/rankings", {
      params: {
        limit,
      },
    });

    return response.data.map(formatTeamRank);
  },
};

export default csApiService;
