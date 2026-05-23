<template>
  <div class="content-card">
    <div class="card-header">
      <span class="badge" :class="contentType.toLowerCase()">
        {{ contentType === "post" ? "FÓRUM" : "NOTÍCIA" }}
      </span>
    </div>
    <h3 class="card-title">{{ title }}</h3>
    <div class="card-meta">
      <span class="published-by">
        Publicado por <strong>{{ author }}</strong>
      </span>
    </div>
    <div class="card-footer">
      <button class="comment-btn" @click.stop="$emit('open-comments')">
        <span class="comment-icon">💬</span>
        <span class="comment-count">{{ commentCount }}</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContentCard",
  emits: ["open-comments"],
  props: {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
      validator: (value) => ["noticia", "post"].includes(value),
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped>
.content-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  transition: box-shadow 0.2s;
}

.content-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.date {
  font-size: 12px;
  color: #9ca3af;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 12px 0;
  line-height: 1.4;
}

.card-meta {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
}

.published-by strong {
  color: #111827;
  font-weight: 600;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.comment-btn {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;
}

.comment-btn:hover {
  color: #111827;
}

.comment-icon {
  font-size: 18px;
}

.comment-count {
  font-weight: 500;
}
</style>
