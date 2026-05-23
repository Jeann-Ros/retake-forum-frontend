<template>
  <div class="home-page">
    <AppHeader />

    <main class="home-container">
      <div class="home-content">
        <div class="welcome-section">
          <div class="user-greeting">
            <span class="greeting-icon">👤</span>
            <div class="greeting-text">
              <p class="greeting-hello">Bem-vindo de volta,</p>
              <p class="greeting-name">{{ userName }}</p>
            </div>
          </div>
          <div class="button-group">
            <button class="btn-new-post" @click="goToCreatePost">
              <span class="plus-icon">+</span>
              Post
            </button>
            <button
              v-if="isAdmin"
              class="btn-new-noticia"
              @click="goToCreateNoticia"
            >
              <span class="plus-icon">+</span>
              Notícia
            </button>
          </div>
        </div>

        <HomeBannerCarousel />

        <div class="home-main-grid">
          <div class="rankings-column">
            <RankingTable
              title="Jogadores CS2"
              type="players"
              :rows="playerRankings"
              :loading="playerRankingsLoading"
              :error="playerRankingsError"
            />
          </div>

          <section class="feed-column" aria-label="Conteúdo da comunidade">
            <div class="tabs-navigation">
              <button
                v-for="tab in tabs"
                :key="tab"
                @click="activeTab = tab"
                :class="['tab-btn', { active: activeTab === tab }]"
              >
                {{ tabLabel(tab) }}
              </button>
            </div>

            <div class="tab-content">
              <div v-if="loading" class="loading-message">
                Carregando conteúdo...
              </div>

              <div
                v-else-if="filteredContent.length === 0"
                class="empty-message"
              >
                Nenhum conteúdo disponível
              </div>

              <div v-else>
                <ContentCard
                  v-for="item in filteredContent"
                  :key="item._id || item.id"
                  :title="item.titulo || 'Post sem título'"
                  :author="item.nick || item.autorNickname"
                  :content-type="item.contentType"
                  :comment-count="
                    item.comentarios
                      ? item.comentarios.length
                      : item.commentaries
                      ? item.commentaries.length
                      : 0
                  "
                  class="clickable-card"
                  @click="openContent(item)"
                  @open-comments="openContentComments(item)"
                />
              </div>
            </div>
          </section>

          <div class="rankings-column">
            <RankingTable
              title="Proximo Torneio CS2"
              type="matches"
              :rows="upcomingMatches"
              :loading="upcomingMatchesLoading"
              :error="upcomingMatchesError"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";
import ContentCard from "../components/ContentCard.vue";
import HomeBannerCarousel from "../components/HomeBannerCarousel.vue";
import RankingTable from "../components/RankingTable.vue";
import authService from "../services/authService";
import apiService from "../services/apiService";
import csApiService from "../services/csApiService";

export default {
  name: "HomeView",
  components: {
    AppHeader,
    ContentCard,
    HomeBannerCarousel,
    RankingTable,
  },
  data() {
    return {
      activeTab: "tudo",
      tabs: ["tudo", "noticias", "posts"],
      noticias: [],
      posts: [],
      playerRankings: [],
      upcomingMatches: [],
      loading: true,
      playerRankingsLoading: true,
      playerRankingsError: false,
      upcomingMatchesLoading: true,
      upcomingMatchesError: false,
      userName: "Usuário",
      userRole: "USER",
    };
  },
  computed: {
    isAdmin() {
      return this.userRole === "ADMIN";
    },
    filteredContent() {
      if (this.activeTab === "noticias") {
        return this.sortByNewest(this.noticias);
      } else if (this.activeTab === "posts") {
        return this.sortByNewest(this.posts);
      }

      return this.sortByNewest([...this.noticias, ...this.posts]);
    },
  },
  methods: {
    getContentDate(item) {
      return item.createdAt || item.dataCriacao || item.date || item.data || 0;
    },
    sortByNewest(items) {
      return [...items].sort((a, b) => {
        return (
          new Date(this.getContentDate(b)) - new Date(this.getContentDate(a))
        );
      });
    },
    tabLabel(tab) {
      const labels = {
        tudo: "Tudo",
        noticias: "Notícias",
        posts: "Fórum",
      };
      return labels[tab];
    },
    async loadContent() {
      try {
        this.loading = true;
        const [noticias, posts] = await Promise.all([
          apiService.getAllNoticias(),
          apiService.getAllPosts(),
        ]);

        this.noticias = noticias.map((item) => ({
          ...item,
          contentType: "noticia",
        }));

        this.posts = posts.map((item) => ({
          ...item,
          contentType: "post",
        }));
      } catch (error) {
        console.error("Erro ao carregar conteúdo:", error);
      } finally {
        this.loading = false;
      }
    },
    loadRankings() {
      this.loadUpcomingMatches();
      this.loadPlayerRankings();
    },
    async loadUpcomingMatches() {
      try {
        this.upcomingMatchesLoading = true;
        this.upcomingMatchesError = false;
        this.upcomingMatches = await csApiService.getUpcomingMatches(1);
      } catch (error) {
        this.upcomingMatchesError = true;
        console.error("Erro ao carregar torneios externos:", error);
      } finally {
        this.upcomingMatchesLoading = false;
      }
    },
    async loadPlayerRankings() {
      try {
        this.playerRankingsLoading = true;
        this.playerRankingsError = false;
        this.playerRankings = await csApiService.getTopPlayers(10);
      } catch (error) {
        this.playerRankingsError = true;
        console.error("Erro ao carregar jogadores externos:", error);
      } finally {
        this.playerRankingsLoading = false;
      }
    },
    loadUserName() {
      const user = authService.getUser();
      if (user) {
        this.userName = user.nick || "Usuário";
        this.userRole = user.role || "USER";
      }
    },
    goToCreatePost() {
      this.$router.push("/criar/post");
    },
    goToCreateNoticia() {
      this.$router.push("/criar/noticia");
    },
    openContent(item) {
      this.goToContent(item, "");
    },
    openContentComments(item) {
      this.goToContent(item, "#comentarios");
    },
    goToContent(item, hash) {
      const id =
        item.contentType === "noticia" ? item.noticiaNumber : item.postNumber;

      this.$router.push({
        name: "detail",
        params: {
          tipo: item.contentType,
          id,
        },
        hash,
      });
    },
  },
  mounted() {
    if (!authService.isAuthenticated()) {
      this.$router.push("/login");
      return;
    }

    this.loadUserName();
    this.loadContent();
    this.loadRankings();
  },
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

.home-container {
  flex: 1;
  padding: 32px 16px;
}

.home-content {
  max-width: 1440px;
  margin: 0 auto;
}

.welcome-section {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.user-greeting {
  display: flex;
  align-items: center;
  gap: 16px;
}

.greeting-icon {
  font-size: 40px;
}

.greeting-text {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.greeting-hello {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.greeting-name {
  font-size: 18px;
  font-weight: bold;
  color: #111827;
  margin: 4px 0 0 0;
}

.home-main-grid {
  display: grid;
  grid-template-columns: minmax(240px, 280px) minmax(0, 1fr) minmax(260px, 300px);
  gap: 24px;
  align-items: start;
  margin-top: 32px;
}

.rankings-column {
  min-width: 0;
}

.feed-column {
  min-width: 0;
}

.btn-new-post {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.btn-new-post:hover {
  background-color: #1d4ed8;
}

.button-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-new-noticia {
  background-color: #059669;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.btn-new-noticia:hover {
  background-color: #047857;
}

.plus-icon {
  font-size: 18px;
}

.tabs-navigation {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
  padding: 0 0 0 0;
  border-radius: 8px 8px 0 0;
}

.tab-btn {
  padding: 16px 24px;
  border: none;
  background: none;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  position: relative;
  bottom: -1px;
}

.tab-btn:hover {
  color: #374151;
}

.tab-btn.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.tab-content {
  background-color: white;
  border-radius: 0 0 8px 8px;
  border: 1px solid #e5e7eb;
  border-top: none;
  padding: 24px;
}

.loading-message,
.empty-message {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  padding: 32px 16px;
}

.clickable-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.clickable-card:hover {
  transform: translateY(-2px);
}

@media (max-width: 1180px) {
  .home-main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .home-container {
    padding: 20px 12px;
  }

  .welcome-section {
    align-items: flex-start;
    flex-direction: column;
    gap: 18px;
  }

  .button-group {
    width: 100%;
  }

  .btn-new-post,
  .btn-new-noticia {
    justify-content: center;
    width: 100%;
  }

  .tabs-navigation {
    overflow-x: auto;
  }

  .tab-btn {
    flex: 1;
    min-width: 96px;
  }

  .tab-content {
    padding: 16px;
  }
}
</style>
