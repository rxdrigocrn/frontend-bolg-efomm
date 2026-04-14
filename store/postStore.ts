import { create } from "zustand";
import { apiFetch } from "@/services/api";

type Post = {
  id: string;
  titulo: string;
  slug: string;
  conteudo: string;
  imagemUrl: string;
  publicado: boolean;
  autorId: string;
  autor: {
    id: string;
    nome: string;
    avatarUrl: string;
  };
  createdAt: string;
};

type Meta = {
  total: number;
  page: number;
  lastPage: number;
};

type CreatePostInput = {
  titulo: string;
  conteudo: string;
  imagemUrl?: string;
  publicado: boolean;
};

type PostState = {
  posts: Post[];
  meta: Meta;
  loading: boolean;

  fetchPosts: () => Promise<void>;
  fetchPublicPosts: (page?: number, limit?: number) => Promise<void>;
  createPost: (data: FormData | CreatePostInput) => Promise<void>;
  updatePost: (id: string, data: any) => Promise<void>; // Any para suportar FormData ou Objeto
  deletePost: (id: string) => Promise<void>;
};

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  meta: { total: 0, page: 1, lastPage: 1 },
  loading: false,

  // Busca para o Painel Privado
  fetchPosts: async () => {
    set({ loading: true });
    const data = await apiFetch("/posts");
    set({
      posts: data.data,
      meta: data.meta,
      loading: false,
    });
  },

  // Busca para o Portal Público (com paginação)
  fetchPublicPosts: async (page = 1, limit = 9) => {
    set({ loading: true });
    // Ajuste a rota para bater com o seu backend
    const data = await apiFetch(`/posts/public?page=${page}&limit=${limit}`);
    
    set({
      posts: data.data,
      meta: data.meta,
      loading: false,
    });
  },

  createPost: async (data) => {
    await apiFetch("/posts", {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
    await get().fetchPosts();
  },

  updatePost: async (id, data) => {
    await apiFetch(`/posts/${id}`, {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
    await get().fetchPosts();
  },

  deletePost: async (id) => {
    await apiFetch(`/posts/${id}`, {
      method: "DELETE",
    });
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    }));
  },
}));