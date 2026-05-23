<template>
  <div class="detail-page">
    <AppHeader />

    <main class="detail-container">
      <BackButton @click="goBack" />

      <div v-if="loading" class="loading">Carregando conteúdo...</div>

      <div v-else-if="!content" class="error-message">
        Conteúdo não encontrado.
      </div>

      <div v-else class="detail-card">
        <div class="content-header">
          <span class="badge" :class="contentType.toLowerCase()">
            {{ contentType === "post" ? "FÓRUM" : "NOTÍCIA" }}
          </span>

          <span class="content-date">
            {{
              formatDate(content.dataCriacao || content.date || content.data)
            }}
          </span>
        </div>

        <h1 class="content-title">
          {{ content.titulo }}
        </h1>

        <div v-if="contentType === 'noticia'" class="evento-badge">
          Evento:
          <strong>{{ content.evento }}</strong>
        </div>

        <div class="author-info">
          <span class="author-icon">👤</span>

          <div class="author-details">
            <p class="author-name">
              {{ content.nick || content.autorNickname }}
            </p>

            <p class="author-date">
              Publicado em
              {{
                formatDate(content.dataCriacao || content.date || content.data)
              }}
            </p>
          </div>
        </div>

        <div class="content-body">
          <div v-html="content.content" class="content-html" />
        </div>

        <div class="content-interactions">
          <button
            :class="['interaction-btn', { active: hasLiked }]"
            :disabled="likeLoading"
            @click="handleLike"
          >
            <span class="icon">👍</span>
            {{ likeLoading ? "Curtindo..." : `${content.likes || 0} curtidas` }}
          </button>

          <button class="interaction-btn" @click="scrollToComments">
            <span class="icon">💬</span>
            {{ allContentComments.length }} comentários
          </button>
        </div>

        <div id="comentarios">
          <CommentTree
            :comments="processedComments"
            :target-type="contentType === 'post' ? 'Post' : 'Noticia'"
            :target-number="content.postNumber || content.noticiaNumber"
            @add-comment="handleAddComment"
            @update-comment="handleUpdateComment"
          />
        </div>
      </div>
    </main>

    <div v-if="content" class="summary-widget" aria-live="polite">
      <section
        v-if="summaryOpen && (summary || summaryError || summaryLoading)"
        class="summary-panel"
      >
        <div class="summary-header">
          <h2>Resumo Gemini</h2>

          <button
            class="summary-close"
            type="button"
            aria-label="Fechar resumo"
            @click="summaryOpen = false"
          >
            ×
          </button>
        </div>

        <p v-if="summaryLoading" class="summary-text">Gerando resumo...</p>
        <p v-else-if="summaryError" class="summary-error">
          {{ summaryError }}
        </p>
        <p v-else class="summary-text">{{ summary }}</p>
      </section>

      <button
        class="summary-button"
        type="button"
        :disabled="summaryLoading"
        @click="handleSummarize"
      >
        <span class="gemini-symbol">✦</span>
        {{ summaryLoading ? "Resumindo..." : summaryButtonLabel }}
      </button>
    </div>
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";
import CommentTree from "../components/CommentTree.vue";
import BackButton from "../components/BackButton.vue";

import authService from "../services/authService";
import apiService from "../services/apiService";

export default {
  name: "DetailView",

  components: {
    AppHeader,
    CommentTree,
    BackButton,
  },

  data() {
    return {
      content: null,
      contentType: "post",
      loading: true,
      likeLoading: false,
      hasLiked: false,
      comments: [],
      summary: "",
      summaryLoading: false,
      summaryError: "",
      summaryOpen: false,
    };
  },

  computed: {
    targetType() {
      return this.contentType === "post" ? "Post" : "Noticia";
    },

    targetNumber() {
      if (!this.content) return 0;
      return this.content.postNumber || this.content.noticiaNumber;
    },

    summaryButtonLabel() {
      return this.contentType === "post" ? "Resumir post" : "Resumir notícia";
    },

    contentComments() {
      return this.comments.filter(
        (comment) =>
          comment.targetType === this.targetType &&
          Number(comment.targetNumber) === Number(this.targetNumber),
      );
    },

    allContentComments() {
      const comments = [...this.contentComments];
      const numbers = comments.map((comment) => comment.commentNumber);
      let foundNewComment = true;

      while (foundNewComment) {
        foundNewComment = false;

        this.comments.forEach((comment) => {
          const isChildComment =
            comment.targetType === "Comment" &&
            numbers.includes(comment.targetNumber) &&
            !numbers.includes(comment.commentNumber);

          if (isChildComment) {
            comments.push(comment);
            numbers.push(comment.commentNumber);
            foundNewComment = true;
          }
        });
      }

      return comments;
    },

    processedComments() {
      const commentsMap = {};

      this.comments.forEach((comment) => {
        commentsMap[comment.commentNumber] = {
          ...comment,
          commentaries: [],
        };
      });

      this.comments.forEach((comment) => {
        if (comment.targetType === "Comment") {
          const parent = commentsMap[comment.targetNumber];

          if (parent) {
            parent.commentaries.push(commentsMap[comment.commentNumber]);
          }
        }
      });

      return this.contentComments.map(
        (comment) => commentsMap[comment.commentNumber],
      );
    },
  },

  methods: {
    formatDate(date) {
      if (!date) return "";

      const d = new Date(date);

      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    resetSummary() {
      this.summary = "";
      this.summaryLoading = false;
      this.summaryError = "";
      this.summaryOpen = false;
    },

    async loadContent() {
      try {
        this.loading = true;
        this.resetSummary();

        const { tipo, id } = this.$route.params;

        this.contentType = tipo === "noticia" ? "noticia" : "post";

        if (this.contentType === "noticia") {
          this.content = await apiService.getNoticiaById(id);
        } else {
          this.content = await apiService.getPostById(id);
        }

        await this.loadComments();
        this.updateLikeStatusFromContent();
      } catch (error) {
        console.error("Erro ao carregar conteúdo:", error);
      } finally {
        this.loading = false;
      }
    },

    async loadComments() {
      try {
        this.comments = await apiService.getAllComments();
      } catch (error) {
        console.error("Erro ao carregar comentários:", error);
      }
    },

    async handleSummarize() {
      if (this.summaryLoading) return;

      if (this.summary) {
        this.summaryOpen = true;
        return;
      }

      try {
        this.summaryLoading = true;
        this.summaryError = "";
        this.summaryOpen = true;

        const response =
          this.contentType === "noticia"
            ? await apiService.resumirNoticia(this.targetNumber)
            : await apiService.resumirPost(this.targetNumber);

        this.summary = response.resumo;
      } catch (error) {
        console.error("Erro ao gerar resumo:", error);
        this.summaryError = "Não foi possível gerar o resumo agora.";
      } finally {
        this.summaryLoading = false;
      }
    },

    async handleAddComment(commentData) {
      try {
        await apiService.createComment({
          ...commentData,
          autorNickname: authService.getUser().nick,
        });

        await this.loadComments();
      } catch (error) {
        console.error("Erro ao adicionar comentário:", error);
      }
    },

    handleUpdateComment(updatedComment) {
      this.comments = this.comments.map((comment) => {
        if (comment.commentNumber === updatedComment.commentNumber) {
          return {
            ...updatedComment,
            commentaries: comment.commentaries,
          };
        }

        return comment;
      });
    },

    async handleLike() {
      try {
        this.likeLoading = true;

        if (this.contentType === "noticia") {
          this.content = await apiService.likeNoticia(this.targetNumber);
        } else {
          this.content = await apiService.likePost(this.targetNumber);
        }

        this.updateLikeStatusFromContent();
      } catch (error) {
        console.error("Erro ao curtir conteúdo:", error);
      } finally {
        this.likeLoading = false;
      }
    },

    updateLikeStatusFromContent() {
      const user = authService.getUser();
      const userId = String(user?.id || "");
      const likedBy = this.content?.likedBy || [];
      this.hasLiked = likedBy.includes(userId);
    },

    scrollToComments() {
      const comments = document.getElementById("comentarios");

      if (comments) {
        comments.scrollIntoView({ behavior: "smooth" });
      }
    },

    goBack() {
      this.$router.back();
    },
  },

  async mounted() {
    if (!authService.isAuthenticated()) {
      this.$router.push("/login");
      return;
    }

    await this.loadContent();

    if (this.$route.hash === "#comentarios") {
      this.$nextTick(() => {
        this.scrollToComments();
      });
    }
  },
};
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

.detail-container {
  flex: 1;
  padding: 32px 16px;
}

.detail-card {
  max-width: 960px;
  margin: 0 auto;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 32px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.content-date {
  font-size: 12px;
  color: #9ca3af;
}

.content-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 16px 0;
  line-height: 1.3;
}

.evento-badge {
  display: inline-block;
  background-color: #fef3c7;
  color: #92400e;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 24px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 32px;
  text-align: left;
}

.author-details {
  text-align: left;
}

.author-icon {
  font-size: 32px;
}

.author-name {
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.author-date {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.content-body {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e5e7eb;
}

.content-html {
  color: #374151;
  line-height: 1.8;
  word-break: break-word;
}

.content-html :deep(p) {
  margin-bottom: 1rem;
}

.content-html :deep(img) {
  max-width: 100%;
  max-height: 500px;
  border-radius: 10px;
  margin: 1rem 0;
}

.content-html :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}

.content-interactions {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.interaction-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid #e5e7eb;
  padding: 10px 16px;
  border-radius: 8px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.interaction-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  color: #111827;
}

.interaction-btn.active {
  background-color: #2563eb;
  border-color: #2563eb;
  color: white;
}

.interaction-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.icon {
  font-size: 16px;
}

.summary-widget {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  max-width: 360px;
}

.summary-panel {
  width: 100%;
  background-color: white;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.18);
  padding: 16px;
  text-align: left;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.summary-header h2 {
  margin: 0;
  color: #111827;
  font-size: 16px;
  line-height: 1.2;
}

.summary-close {
  width: 28px;
  height: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  background-color: white;
  color: #4b5563;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}

.summary-text,
.summary-error {
  margin: 0;
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
}

.summary-error {
  color: #b91c1c;
}

.summary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  border: 0;
  border-radius: 999px;
  background-color: #111827;
  color: white;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.25);
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  padding: 0 18px;
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
}

.summary-button:hover:not(:disabled) {
  background-color: #1f2937;
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.3);
  transform: translateY(-1px);
}

.summary-button:disabled {
  cursor: wait;
  opacity: 0.82;
}

.gemini-symbol {
  color: #93c5fd;
  font-size: 18px;
  line-height: 1;
}

@media (max-width: 640px) {
  .detail-card {
    padding: 24px 16px;
  }

  .content-header,
  .content-interactions {
    align-items: flex-start;
    flex-direction: column;
  }

  .summary-widget {
    right: 16px;
    bottom: 16px;
    left: 16px;
    max-width: none;
  }

  .summary-button,
  .summary-panel {
    width: 100%;
  }
}
</style>
