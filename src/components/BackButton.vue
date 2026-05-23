<template>
  <button class="btn-back" :style="{ maxWidth }" @click="$emit('click')">
    ← Voltar
  </button>
</template>

<script>
export default {
  name: "BackButton",
  emits: ["click"],
  props: {
    maxWidth: {
      type: String,
      default: "960px",
    },
  },
};
</script>
