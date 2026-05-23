<template>
  <div v-if="message" :class="['message', `${type}-message`]">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: "FeedbackMessage",
  props: {
    message: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "error",
      validator: (value) => ["error", "success"].includes(value),
    },
  },
};
</script>
