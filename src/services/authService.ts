import axiosInstance from "./axiosInstance";
import type {
  LoginResponse,
  RegisterPayload,
  StoredUser,
  UpdateUsuarioPayload,
  Usuario,
} from "../types/usuarios";

const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>("/usuarios/login", {
      email,
      senha: password,
    });

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);

      const userData: StoredUser = {
        ...response.data.user,
        id: response.data.user.id || response.data.user.usuarioNumber,
      };

      localStorage.setItem("user", JSON.stringify(userData));
    }

    return response.data;
  },

  async register(userData: RegisterPayload): Promise<Usuario> {
    const response = await axiosInstance.post<Usuario>("/usuarios/register", userData);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("authToken");
  },

  getUser(): StoredUser | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  updateUser(userData: UpdateUsuarioPayload): void {
    const user = this.getUser();
    if (!user) return;

    localStorage.setItem("user", JSON.stringify({ ...user, ...userData }));
  },
};

export default authService;
