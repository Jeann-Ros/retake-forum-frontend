<template>
  <section class="ranking-card" :aria-label="title">
    <div class="ranking-header">
      <h2 class="ranking-title">{{ title }}</h2>
    </div>

    <div v-if="loading" class="ranking-state">Carregando lista...</div>

    <div v-else-if="error" class="ranking-state error">
      Nao foi possivel carregar a lista.
    </div>

    <div v-else-if="rows.length === 0" class="ranking-state">
      Nenhum item disponivel.
    </div>

    <table v-else class="ranking-table">
      <thead>
        <tr v-if="type === 'teams'">
          <th class="rank-column">#</th>
          <th>Time</th>
          <th class="detail-column">Score</th>
        </tr>

        <tr v-else>
          <th class="rank-column">#</th>
          <th>Jogador</th>
          <th class="detail-column">Rating</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in rows" :key="row.id || row.name">
          <template v-if="type === 'teams'">
            <td class="rank-position">{{ row.rank }}</td>
            <td class="rank-name">{{ row.name }}</td>
            <td class="detail-column rank-detail score-cell">
              <span class="score-total">{{ row.points }}</span>
              <span :class="['score-diff', variationClass(row.pointsDiff)]">
                {{ formatPointVariation(row.pointsDiff) }}
              </span>
            </td>
          </template>

          <template v-else>
            <td class="rank-position">{{ row.rank }}</td>
            <td class="rank-name uppercase">
              {{ row.name }}
            </td>
            <td class="detail-column rank-detail">
              {{ formatRating(row.rating) }}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
export default {
  name: "RankingTable",
  props: {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ["players", "teams"].includes(value),
    },
    rows: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    formatRating(value) {
      if (typeof value !== "number") return "-";
      return value.toFixed(2);
    },
    formatPointVariation(value) {
      if (typeof value !== "number") return "-";
      return value >= 0 ? `+${value}` : String(value);
    },
    variationClass(value) {
      if (value > 0) return "positive";
      if (value < 0) return "negative";
      return "";
    },
  },
};
</script>

<style scoped>
.ranking-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.ranking-header {
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 18px;
}

.ranking-title {
  color: #111827;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
  margin: 0;
}

.ranking-state {
  color: #6b7280;
  font-size: 14px;
  padding: 24px 18px;
  text-align: center;
}

.ranking-state.error {
  color: #991b1b;
}

.ranking-table {
  border-collapse: collapse;
  width: 100%;
}

.ranking-table th {
  color: #6b7280;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 12px;
  text-align: left;
  text-transform: uppercase;
}

.ranking-table td {
  border-top: 1px solid #e5e7eb;
  color: #374151;
  font-size: 13px;
  padding: 12px;
  vertical-align: middle;
}

.rank-name {
  color: #111827;
  font-weight: 700;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-name.uppercase {
  text-transform: uppercase;
}

.rank-detail {
  color: #6b7280;
  font-weight: 600;
}

.rank-position {
  color: #6b7280;
  font-weight: 700;
  white-space: nowrap;
  width: 1%;
}

.detail-column {
  text-align: right;
  white-space: nowrap;
}

.rank-column {
  width: 1%;
}

.rank-detail.positive {
  color: #047857;
}

.rank-detail.negative {
  color: #b91c1c;
}

.score-diff.positive {
  color: #047857;
}

.score-diff.negative {
  color: #b91c1c;
}

.score-cell {
  line-height: 1.15;
}

.score-total,
.score-diff {
  display: block;
}

.score-total {
  color: #111827;
  font-weight: 700;
}

.score-diff {
  font-size: 11px;
  font-weight: 800;
  margin-top: 3px;
}
</style>
