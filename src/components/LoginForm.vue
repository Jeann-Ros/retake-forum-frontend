<template>
  <form @submit.prevent="handleSubmit" class="login-form">
    <!-- Email Input -->
    <div class="form-group">
      <label for="email" class="form-label">Email</label>
      <input
        id="email"
        v-model="formData.email"
        type="email"
        placeholder="seu.email@exemplo.com"
        class="form-input"
        required
      />
    </div>

    <!-- Password Input -->
    <div class="form-group">
      <label for="password" class="form-label">Senha</label>
      <input
        id="password"
        v-model="formData.password"
        type="password"
        placeholder="Insira sua senha"
        class="form-input"
        required
      />
    </div>

    <!-- Error Message -->
    <FeedbackMessage :message="errorMessage" type="error" />

    <!-- Submit Button -->
    <button type="submit" class="btn-submit" :disabled="isLoading">
      <span v-if="!isLoading">Entrar</span>
      <span v-else>Carregando...</span>
    </button>
  </form>
</template>

<script>
import authService from "../services/authService";
import FeedbackMessage from "./FeedbackMessage.vue";

export default {
  name: "LoginForm",
  components: {
    FeedbackMessage,
  },
  data() {
    return {
      formData: {
        email: "",
        password: "",
        rememberMe: false,
      },
      isLoading: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        await authService.login(this.formData.email, this.formData.password);
        // Emitir evento de login bem-sucedido
        this.$emit("login-success");
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message ||
          "Erro ao fazer login. Tente novamente.";
        console.error("Erro no login:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #6b7280;
}

.remember-me input {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.forgot-password {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-password:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.sign-up-link {
  text-align: center;
  font-size: 13px;
  color: #6b7280;
}

.sign-up-link a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.sign-up-link a:hover {
  text-decoration: underline;
}
</style>
