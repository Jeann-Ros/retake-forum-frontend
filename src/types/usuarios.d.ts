export type UserRole = "ADMIN" | "USER";

export type CountryOption = {
  value: string;
  label: string;
};

export type Usuario = {
  _id?: string;
  id?: number | string;
  usuarioNumber?: number | string;
  nick?: string;
  email?: string;
  pais?: string;
  role?: UserRole;
  admflag?: UserRole;
  time?: string;
  jogador?: string;
};

export type StoredUser = Usuario;

export type LoginResponse = {
  token?: string;
  user: Usuario;
};

export type RegisterPayload = Partial<Usuario> & {
  senha?: string;
  password?: string;
};

export type UpdateUsuarioPayload = Partial<Usuario>;
