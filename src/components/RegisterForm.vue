<template>
  <form @submit.prevent="handleSubmit" class="register-form">
    <!-- Nick Input -->
    <div class="form-group">
      <label for="nick" class="form-label">Nick</label>
      <input
        id="nick"
        v-model="formData.nick"
        type="text"
        placeholder="Seu nick"
        class="form-input"
        required
      />
    </div>

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

    <!-- Confirm Password Input -->
    <div class="form-group">
      <label for="confirmPassword" class="form-label">Confirmar Senha</label>
      <input
        id="confirmPassword"
        v-model="formData.confirmPassword"
        type="password"
        placeholder="Confirme sua senha"
        class="form-input"
        required
      />
    </div>

    <!-- Country Input -->
    <div class="form-group">
      <label for="pais" class="form-label">País</label>
      <CountrySelect v-model="formData.pais" />
    </div>

    <!-- Error Message -->
    <FeedbackMessage :message="errorMessage" type="error" />

    <!-- Success Message -->
    <FeedbackMessage :message="successMessage" type="success" />

    <!-- Submit Button -->
    <button type="submit" class="btn-submit" :disabled="isLoading">
      <span v-if="!isLoading">Registrar</span>
      <span v-else>Registrando...</span>
    </button>
  </form>
</template>

<script>
import authService from "../services/authService";
import CountrySelect from "./CountrySelect.vue";
import FeedbackMessage from "./FeedbackMessage.vue";

export default {
  name: "RegisterForm",
  components: {
    CountrySelect,
    FeedbackMessage,
  },
  data() {
    return {
      formData: {
        nick: "",
        email: "",
        password: "",
        confirmPassword: "",
        pais: "",
      },
      isLoading: false,
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true;
      this.errorMessage = "";
      this.successMessage = "";

      // Validações básicas
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errorMessage = "As senhas não coincidem.";
        this.isLoading = false;
        return;
      }

      if (this.formData.password.length < 6) {
        this.errorMessage = "A senha deve ter pelo menos 6 caracteres.";
        this.isLoading = false;
        return;
      }

      try {
        const registerData = {
          nick: this.formData.nick,
          email: this.formData.email,
          senha: this.formData.password,
          pais: this.formData.pais,
          admflag: 0,
          time: "",
          jogador: "",
        };

        await authService.register(registerData);
        this.successMessage =
          "Registro realizado com sucesso! Você pode fazer login agora.";
        // Emitir evento de registro bem-sucedido
        this.$emit("register-success");
        // Limpar formulário
        this.formData = {
          nick: "",
          email: "",
          password: "",
          confirmPassword: "",
          pais: "",
        };
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message ||
          "Erro ao registrar. Tente novamente.";
        console.error("Erro no registro:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

</style>
