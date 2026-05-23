<template>
  <div v-if="open" class="modal-overlay" @click.self="handleClose">
    <div class="create-options-modal">
      <div class="modal-header">
        <h2 class="modal-title">
          {{ option === "link" ? "Adicionar link" : "Adicionar imagem" }}
        </h2>

        <button type="button" class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="form-group">
        <label for="url" class="form-label">
          Cole a URL
          {{ option === "link" ? "do link" : "da imagem" }}
          no campo abaixo:
        </label>

        <input
          id="url"
          v-model="url"
          type="text"
          class="form-input"
          placeholder="https://exemplo.com"
          @keydown.enter="handleSubmit"
        />
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" @click="handleClose">
          Cancelar
        </button>

        <button type="button" class="btn btn-primary" @click="handleSubmit">
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateOptionsModal",
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    option: {
      type: String,
      required: true,
      validator: (value) => ["link", "image"].includes(value),
    },
  },
  data() {
    return {
      url: "",
    };
  },
  watch: {
    open(newValue) {
      if (!newValue) {
        this.url = "";
      }
    },
  },
  methods: {
    handleClose() {
      this.url = "";
      this.$emit("close");
    },
    handleSubmit() {
      if (!this.url.trim()) {
        return;
      }
      this.$emit("submit", this.url);
      this.url = "";
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 16px;
}

.create-options-modal {
  width: 100%;
  max-width: 420px;
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.25);
  animation: fadeIn 0.2s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
}

.close-btn:hover {
  color: #111827;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
