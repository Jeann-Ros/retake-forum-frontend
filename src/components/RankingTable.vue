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
        <tr v-if="type === 'matches'">
          <th>Nome</th>
          <th class="detail-column">Data</th>
          <th class="detail-column">Pais</th>
        </tr>

        <tr v-else>
          <th>Jogador</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in rows" :key="row.id || row.name">
          <template v-if="type === 'matches'">
            <td class="rank-name">{{ row.name }}</td>
            <td class="detail-column rank-detail">
              {{ formatDate(row.scheduled_at) }}
            </td>
            <td class="detail-column rank-detail">{{ row.country || "-" }}</td>
          </template>

          <td v-else class="rank-name uppercase">
            {{ row.name }}
          </td>
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
      validator: (value) => ["players", "matches"].includes(value),
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
    formatDate(value) {
      if (!value) return "-";

      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value));
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

.detail-column {
  text-align: right;
  white-space: nowrap;
}
</style>
