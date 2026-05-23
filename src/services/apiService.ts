import axiosInstance from "./axiosInstance";
import type { Comment, CreateCommentPayload } from "../types/comments";
import type { CountryOption, Usuario, UpdateUsuarioPayload } from "../types/usuarios";
import type { CreateNoticiaPayload, Noticia } from "../types/noticias";
import type { CreatePostPayload, Post } from "../types/posts";

type SummaryResponse = {
  resumo: string;
};

const apiService = {
  async getCountries(): Promise<CountryOption[]> {
    const response = await axiosInstance.get<CountryOption[]>("/usuarios/countries");
    return response.data;
  },

  async getAllNoticias(): Promise<Noticia[]> {
    const response = await axiosInstance.get<Noticia[]>("/noticias/getAllNoticias");
    return response.data;
  },

  async getNoticiaById(id: number | string): Promise<Noticia> {
    const response = await axiosInstance.get<Noticia>(`/noticias/getNoticiaByID/${id}`);
    return response.data;
  },

  async createNoticia(noticiaData: CreateNoticiaPayload): Promise<Noticia> {
    const response = await axiosInstance.post<Noticia>(
      "/noticias/createNoticia",
      noticiaData,
    );
    return response.data;
  },

  async likeNoticia(noticiaNumber: number | string): Promise<Noticia> {
    const response = await axiosInstance.put<Noticia>(
      `/noticias/likeNoticia/${noticiaNumber}`,
    );
    return response.data;
  },

  async resumirNoticia(noticiaNumber: number | string): Promise<SummaryResponse> {
    const response = await axiosInstance.get<SummaryResponse>(
      `/noticias/resumirNoticia/${noticiaNumber}`,
      { timeout: 30000 },
    );
    return response.data;
  },

  async getAllPosts(): Promise<Post[]> {
    const response = await axiosInstance.get<Post[]>("/posts/getAllPosts");
    return response.data;
  },

  async getPostById(id: number | string): Promise<Post> {
    const response = await axiosInstance.get<Post>(`/posts/getPostByID/${id}`);
    return response.data;
  },

  async createPost(postData: CreatePostPayload): Promise<Post> {
    const response = await axiosInstance.post<Post>("/posts/createPost", postData);
    return response.data;
  },

  async likePost(postNumber: number | string): Promise<Post> {
    const response = await axiosInstance.put<Post>(`/posts/likePost/${postNumber}`);
    return response.data;
  },

  async resumirPost(postNumber: number | string): Promise<SummaryResponse> {
    const response = await axiosInstance.get<SummaryResponse>(
      `/posts/resumirPost/${postNumber}`,
      { timeout: 30000 },
    );
    return response.data;
  },

  async getAllComments(): Promise<Comment[]> {
    const response = await axiosInstance.get<Comment[]>(
      "/comentarios/getAllCommentaries",
    );
    return response.data;
  },

  async createComment(commentData: CreateCommentPayload): Promise<Comment> {
    const response = await axiosInstance.post<Comment>(
      "/comentarios/createCommentary",
      commentData,
    );
    return response.data;
  },

  async likeComment(commentNumber: number | string): Promise<Comment> {
    const response = await axiosInstance.put<Comment>(
      `/comentarios/likeCommentary/${commentNumber}`,
    );
    return response.data;
  },

  async getUsuarioByNick(nickname: string): Promise<Usuario> {
    const response = await axiosInstance.get<Usuario>(
      `/usuarios/getUsuarioByNick/${nickname}`,
    );
    return response.data;
  },

  async updateUsuario(
    id: number | string,
    userData: UpdateUsuarioPayload,
  ): Promise<Usuario> {
    const response = await axiosInstance.put<Usuario>(`/usuarios/${id}`, userData);
    return response.data;
  },

  async getUsuarioById(id: number | string): Promise<Usuario> {
    const response = await axiosInstance.get<Usuario>(`/usuarios/getUsuarioByID/${id}`);
    return response.data;
  },
};

export default apiService;
