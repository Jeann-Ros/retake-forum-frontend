export type Comment = {
  _id?: string;
  id?: number | string;
  commentNumber?: number;
  comentarioNumber?: number;
  conteudo?: string;
  texto?: string;
  nick?: string;
  autorNickname?: string;
  createdAt?: string;
  dataCriacao?: string;
};

export type CreateCommentPayload = Partial<Comment> & {
  postNumber?: number;
  noticiaNumber?: number;
};
