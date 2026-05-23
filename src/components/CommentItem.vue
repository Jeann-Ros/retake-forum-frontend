<template>
  <div class="comment-item">
    <div class="comment-header">
      <span class="comment-author">{{ comment.autorNickname }}</span>
      <span class="comment-date">{{ formatDate(comment.date) }}</span>
    </div>

    <div class="comment-content">
      {{ comment.content }}
    </div>

    <div class="comment-actions">
      <button class="action-btn" @click="toggleReply">
        {{ showReplyForm ? "Cancelar" : "Responder" }}
      </button>
      <button
        :class="['action-btn', { active: hasLiked }]"
        :disabled="likeLoading"
        @click="handleLike"
      >
        {{ likeLoading ? "Curtindo..." : `${comment.likes || 0} curtidas` }}
      </button>
    </div>

    <div v-if="showReplyForm" class="reply-form">
      <input
        v-model="replyText"
        type="text"
        class="reply-input"
        placeholder="Responda este comentário..."
      />
      <button
        class="btn-reply"
        :disabled="!replyText.trim() || loading"
        @click="handleReply"
      >
        {{ loading ? "Enviando..." : "Responder" }}
      </button>
    </div>

    <div
      v-if="comment.commentaries && comment.commentaries.length > 0"
      class="nested-comments"
    >
      <CommentItem
        v-for="nestedComment in comment.commentaries"
        :key="nestedComment.commentNumber"
        :comment="nestedComment"
        :level="level + 1"
        @add-reply="$emit('add-reply', $event)"
        @update-comment="$emit('update-comment', $event)"
      />
    </div>
  </div>
</template>

<script>
import authService from "../services/authService";
import apiService from "../services/apiService";

export default {
  name: "CommentItem",
  emits: ["add-reply", "update-comment"],
  props: {
    comment: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showReplyForm: false,
      replyText: "",
      loading: false,
      likeLoading: false,
    };
  },
  computed: {
    hasLiked() {
      const user = authService.getUser();
      const userId = String(user?.id || "");
      const likedBy = this.comment.likedBy || [];
      return likedBy.includes(userId);
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
    toggleReply() {
      this.showReplyForm = !this.showReplyForm;
      if (!this.showReplyForm) {
        this.replyText = "";
      }
    },
    async handleReply() {
      if (!this.replyText.trim()) {
        return;
      }

      this.loading = true;
      try {
        this.$emit("add-reply", {
          content: this.replyText,
          targetType: "Comment",
          targetNumber: this.comment.commentNumber,
        });
        this.replyText = "";
        this.showReplyForm = false;
      } finally {
        this.loading = false;
      }
    },
    async handleLike() {
      try {
        this.likeLoading = true;
        const updatedComment = await apiService.likeComment(
          this.comment.commentNumber,
        );
        this.$emit("update-comment", updatedComment);
      } catch (error) {
        console.error("Erro ao curtir comentário:", error);
      } finally {
        this.likeLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.comment-item {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  transition: background-color 0.2s;
  text-align: left;
}

.comment-item:hover {
  background-color: #f3f4f6;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.comment-author {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
}

.comment-date {
  font-size: 12px;
  color: #6b7280;
}

.comment-content {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 12px;
  word-break: break-word;
  text-align: left;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.action-btn {
  background: none;
  border: none;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.action-btn:hover {
  color: #1d4ed8;
}

.action-btn.active {
  background-color: #2563eb;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
}

.action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.reply-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #d1d5db;
}

.reply-input {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 10px;
  font-family: inherit;
  font-size: 13px;
  min-height: 40px;
}

.reply-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.btn-reply {
  align-self: flex-end;
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-reply:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-reply:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.nested-comments {
  margin-top: 16px;
  margin-left: 28px;
  padding-left: 16px;
  border-left: 2px solid #d1d5db;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
