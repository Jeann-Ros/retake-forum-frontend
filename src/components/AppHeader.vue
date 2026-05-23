<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo -->
      <button class="logo" @click="goToHome">
        Retake<span class="logo-highlight">.Forum</span>
      </button>

      <!-- Ações do Header -->
      <div class="header-actions">
        <div v-if="isLoggedIn" class="user-menu">
          <button @click="goToProfile" class="menu-btn profile-btn">
            Perfil
          </button>
          <button @click="handleLogout" class="menu-btn logout-btn">
            Sair
          </button>
        </div>
        <button v-else @click="goToLogin" class="btn-login">
          Entrar / Registar
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import authService from "../services/authService";

export default {
  name: "AppHeader",
  data() {
    return {
      isLoggedIn: false,
    };
  },
  mounted() {
    this.checkAuthStatus();
  },
  methods: {
    checkAuthStatus() {
      this.isLoggedIn = authService.isAuthenticated();
    },
    handleLogout() {
      authService.logout();
      this.$emit("logout");
      this.$router.push("/login");
    },
    goToLogin() {
      this.$router.push("/login");
    },
    goToProfile() {
      this.$router.push("/perfil");
    },
    goToHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.app-header {
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 16px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-weight: bold;
  font-size: 20px;
  letter-spacing: -0.05em;
  color: #111827;
}

.logo-highlight {
  color: #2563eb;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-btn {
  font-size: 14px;
  font-weight: 500;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
}

.profile-btn {
  color: #4b5563;
}

.profile-btn:hover {
  color: #111827;
}

.logout-btn {
  color: #dc2626;
}

.logout-btn:hover {
  color: #991b1b;
}

.icon {
  font-size: 16px;
}

.btn-login {
  background-color: #2563eb;
  color: white;
  border: none;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-login:hover {
  background-color: #1d4ed8;
}
</style>
