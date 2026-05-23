<template>
  <div class="comment-section">
    <h3 class="comments-title">Comentários</h3>

    <div class="add-comment">
      <input
        v-model="newCommentText"
        type="text"
        class="comment-input"
        placeholder="Escreva um comentário..."
      />
      <button
        class="btn-add-comment"
        :disabled="!newCommentText.trim() || loading"
        @click="handleAddComment"
      >
        {{ loading ? "Enviando..." : "Comentar" }}
      </button>
    </div>

    <div v-if="comments.length === 0" class="no-comments">
      Nenhum comentário ainda. Seja o primeiro a comentar!
    </div>

    <div v-else class="comments-list">
      <CommentItem
        v-for="comment in comments"
        :key="comment.commentNumber"
        :comment="comment"
        :level="0"
        @add-reply="handleAddReply"
        @update-comment="handleUpdateComment"
      />
    </div>
  </div>
</template>

<script>
import CommentItem from "./CommentItem.vue";

export default {
  name: "CommentTree",
  components: {
    CommentItem,
  },
  props: {
    comments: {
      type: Array,
      required: true,
    },
    targetType: {
      type: String,
      required: true,
      validator: (value) => ["Post", "Noticia"].includes(value),
    },
    targetNumber: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      newCommentText: "",
      loading: false,
    };
  },
  methods: {
    async handleAddComment() {
      if (!this.newCommentText.trim()) {
        return;
      }

      this.loading = true;
      try {
        this.$emit("add-comment", {
          content: this.newCommentText,
          targetType: this.targetType,
          targetNumber: this.targetNumber,
        });
        this.newCommentText = "";
      } finally {
        this.loading = false;
      }
    },

    handleAddReply(commentData) {
      this.$emit("add-comment", commentData);
    },

    handleUpdateComment(comment) {
      this.$emit("update-comment", comment);
    },
  },
};
</script>

<style scoped>
.comment-section {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid #e5e7eb;
  text-align: left;
}

.comments-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 24px 0;
}

.add-comment {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 10px;
}

.comment-input {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px;
  font-family: inherit;
  font-size: 14px;
  min-height: 44px;
}

.comment-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.btn-add-comment {
  align-self: flex-end;
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-add-comment:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-add-comment:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.no-comments {
  text-align: center;
  color: #6b7280;
  padding: 32px 16px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
