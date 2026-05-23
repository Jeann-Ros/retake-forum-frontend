<template>
  <div class="user-profile-page">
    <AppHeader />

    <main class="profile-container">
      <BackButton max-width="600px" @click="goBack" />

      <div class="profile-content">
        <h1 class="page-title">Editar Perfil</h1>

        <form @submit.prevent="handleSubmit" class="profile-form">
          <!-- Campo: Nick -->
          <div class="form-group">
            <label for="nick" class="form-label">Apelido/Nickname</label>
            <input
              id="nick"
              v-model="formData.nick"
              type="text"
              class="form-input"
              placeholder="Seu apelido"
              required
            />
          </div>

          <!-- Campo: Email -->
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="form-input"
              placeholder="seu@email.com"
              required
            />
          </div>

          <!-- Campo: País -->
          <div class="form-group">
            <label for="pais" class="form-label">País</label>
            <CountrySelect v-model="formData.pais" />
          </div>

          <!-- Campo: Time -->
          <div class="form-group">
            <label for="time" class="form-label">Time (opcional)</label>
            <input
              id="time"
              v-model="formData.time"
              type="text"
              class="form-input"
              placeholder="Nome do seu time"
            />
          </div>

          <!-- Campo: Jogador -->
          <div class="form-group">
            <label for="jogador" class="form-label">Jogador (opcional)</label>
            <input
              id="jogador"
              v-model="formData.jogador"
              type="text"
              class="form-input"
              placeholder="Seu nick de jogador"
            />
          </div>

          <!-- Campo: Senha -->
          <div class="form-group">
            <label for="senha" class="form-label">Nova Senha (opcional)</label>
            <input
              id="senha"
              v-model="formData.senha"
              type="password"
              class="form-input"
              placeholder="Deixe em branco para não alterar"
            />
          </div>

          <!-- Campo: Confirmar Senha -->
          <div v-if="formData.senha" class="form-group">
            <label for="confirmaSenha" class="form-label"
              >Confirmar Senha</label
            >
            <input
              id="confirmaSenha"
              v-model="formData.confirmaSenha"
              type="password"
              class="form-input"
              placeholder="Confirme a nova senha"
              required
            />
          </div>

          <!-- Mensagens de Feedback -->
          <FeedbackMessage :message="errorMessage" type="error" />
          <FeedbackMessage :message="successMessage" type="success" />

          <!-- Botões de Ação -->
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? "Salvando..." : "Salvar Alterações" }}
            </button>
            <button type="button" class="btn btn-secondary" @click="goBack">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/BackButton.vue";
import CountrySelect from "../components/CountrySelect.vue";
import FeedbackMessage from "../components/FeedbackMessage.vue";
import authService from "../services/authService";
import apiService from "../services/apiService";

export default {
  name: "UserProfileView",
  components: {
    AppHeader,
    BackButton,
    CountrySelect,
    FeedbackMessage,
  },
  data() {
    return {
      formData: {
        nick: "",
        email: "",
        pais: "",
        time: "",
        jogador: "",
        senha: "",
        confirmaSenha: "",
      },
      loading: false,
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async loadUserData() {
      try {
        const user = authService.getUser();
        if (user) {
          const userData = await apiService.getUsuarioById(user.id);
          this.formData.nick = userData.nick || "";
          this.formData.email = userData.email || "";
          this.formData.pais = userData.pais || "";
          this.formData.time = userData.time || "";
          this.formData.jogador = userData.jogador || "";
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    },
    async handleSubmit() {
      this.errorMessage = "";
      this.successMessage = "";

      if (
        this.formData.senha &&
        this.formData.senha !== this.formData.confirmaSenha
      ) {
        this.errorMessage = "As senhas não conferem";
        return;
      }

      try {
        this.loading = true;
        const user = authService.getUser();
        const updateData = {
          nick: this.formData.nick,
          email: this.formData.email,
          pais: this.formData.pais,
          time: this.formData.time,
          jogador: this.formData.jogador,
        };

        if (this.formData.senha) {
          updateData.senha = this.formData.senha;
        }

        await apiService.updateUsuario(user.id, updateData);
        this.successMessage = "Perfil atualizado com sucesso!";

        // Atualizar dados no localStorage
        authService.updateUser({
          nick: this.formData.nick,
          email: this.formData.email,
        });

        setTimeout(() => {
          this.$router.push("/");
        }, 2000);
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "Erro ao atualizar perfil";
        console.error("Erro ao atualizar perfil:", error);
      } finally {
        this.loading = false;
      }
    },
    goBack() {
      this.$router.back();
    },
  },
  mounted() {
    if (!authService.isAuthenticated()) {
      this.$router.push("/login");
    } else {
      this.loadUserData();
    }
  },
};
</script>

<style scoped>
.user-profile-page {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

.profile-container {
  flex: 1;
  padding: 32px 16px;
}

.profile-content {
  max-width: 600px;
  margin: 0 auto;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 40px;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #111827;
  margin: 0 0 32px 0;
  text-align: center;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-actions {
  justify-content: center;
  margin-top: 16px;
}
</style>
