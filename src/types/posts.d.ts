import type { Comment } from "./comments";

export type Post = {
  _id?: string;
  id?: number | string;
  postNumber?: number;
  titulo?: string;
  conteudo?: string;
  nick?: string;
  autorNickname?: string;
  comentarios?: Comment[];
  commentaries?: Comment[];
  createdAt?: string;
  dataCriacao?: string;
  date?: string;
  data?: string;
};

export type CreatePostPayload = Partial<Post>;
