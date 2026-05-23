<template>
  <div class="login-page">
    <!-- Header -->
    <AppHeader @logout="handleLogout" />

    <!-- Conteúdo Principal -->
    <main class="login-container">
      <div class="login-box">
        <!-- Logo Grande -->
        <div class="login-header">
          <h1 class="welcome-title">Bem-vindo</h1>
          <p class="welcome-subtitle">Faça login na sua conta para continuar</p>
        </div>

        <!-- Abas de Navegação (se tiver múltiplas seções) -->
        <div class="form-tabs">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="['tab-btn', { active: activeTab === tab }]"
          >
            {{ tab === "login" ? "Login" : "Registrar" }}
          </button>
        </div>

        <!-- Formulário de Login -->
        <div v-show="activeTab === 'login'" class="form-container">
          <LoginForm @login-success="handleLoginSuccess" />
        </div>

        <!-- Formulário de Registro (placeholder) -->
        <div v-show="activeTab === 'register'" class="form-container">
          <RegisterForm @register-success="handleRegisterSuccess" />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";
import LoginForm from "../components/LoginForm.vue";
import RegisterForm from "../components/RegisterForm.vue";

export default {
  name: "LoginView",
  components: {
    AppHeader,
    LoginForm,
    RegisterForm,
  },
  data() {
    return {
      activeTab: "login",
      tabs: ["login", "register"],
    };
  },
  methods: {
    handleLoginSuccess() {
      // Redirecionar para a página inicial ou dashboard após login bem-sucedido
      this.$router.push("/");
    },
    handleRegisterSuccess() {
      // Após registro bem-sucedido, mudar para aba de login
      this.activeTab = "login";
    },
    handleLogout() {
      // Manter na página de login
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

.login-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.login-box {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.welcome-title {
  font-size: 28px;
  font-weight: bold;
  color: #111827;
  margin: 0 0 8px 0;
}

.welcome-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.form-tabs {
  display: flex;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.tab-btn {
  padding: 12px 0;
  border: none;
  background: none;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  flex: 1;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  position: relative;
  bottom: -1px;
}

.tab-btn:hover {
  color: #374151;
}

.tab-btn.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.form-container {
  animation: fadeIn 0.2s ease-in-out;
}

.placeholder-text {
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
  padding: 20px 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade */
@media (max-width: 640px) {
  .login-box {
    padding: 24px;
  }

  .welcome-title {
    font-size: 24px;
  }

  .login-container {
    padding: 16px;
  }
}
</style>
