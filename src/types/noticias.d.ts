import type { Comment } from "./comments";

export type Noticia = {
  _id?: string;
  id?: number | string;
  noticiaNumber?: number;
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

export type CreateNoticiaPayload = Partial<Noticia>;
