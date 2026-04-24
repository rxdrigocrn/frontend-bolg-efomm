import { create } from "zustand";
import { apiFetch } from "@/services/api";
import { toast } from "react-toastify";

type Profile = {
  id: string;
  nome: string;
  bio?: string;
  avatarUrl?: string;
  tags?: Array<{
    id: string;
    name: string;
  }>;
};

type AuthorPost = {
  id: string;
  titulo: string;
  slug?: string;
  conteudo: string;
  imagemUrl?: string;
  imagemUrls?: string[];
  autorId: string;
  autor?: {
    id: string;
    nome: string;
    avatarUrl?: string;
  };
  createdAt: string;
};

type ProfileState = {
  profile: Profile | null;
  posts: AuthorPost[];
  loading: boolean;
  error: string | null;
  fetchProfileWithPosts: (profileId: string) => Promise<void>;
};

const normalizeProfilePayload = (payload: unknown): Profile | null => {
  if (!payload || typeof payload !== "object") return null;

  const wrapped = payload as { data?: unknown };
  const value = wrapped.data ?? payload;

  if (!value || typeof value !== "object") return null;
  return value as Profile;
};

const normalizePostsPayload = (payload: unknown): AuthorPost[] => {
  if (Array.isArray(payload)) return payload as AuthorPost[];
  if (!payload || typeof payload !== "object") return [];

  const wrapped = payload as { data?: unknown };
  if (Array.isArray(wrapped.data)) return wrapped.data as AuthorPost[];

  return [];
};

const filterPostsByAuthor = (posts: AuthorPost[], profileId: string) => {
  return posts.filter((post) => post.autorId === profileId || post.autor?.id === profileId);
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  posts: [],
  loading: false,
  error: null,

  fetchProfileWithPosts: async (profileId: string) => {
    if (!profileId) {
      set({ error: "Perfil inválido.", loading: false, profile: null, posts: [] });
      return;
    }

    set({ loading: true, error: null, posts: [] });

    try {
      const profileResponse = await apiFetch(`/users/${profileId}`, {
        showErrorToast: false,
      });
      const profilePayload = normalizeProfilePayload(profileResponse);

      const response = await apiFetch(`/posts/public?page=1&limit=100`, {
        showErrorToast: false,
      });
      const availablePosts = normalizePostsPayload(response);
      const filteredPosts = filterPostsByAuthor(availablePosts, profileId);

      const fallbackAuthor = filteredPosts[0]?.autor;

      set({
        profile:
          profilePayload ||
          (filteredPosts.length > 0
            ? {
                id: profileId,
                nome: fallbackAuthor?.nome || "Autor",
                bio: "",
                avatarUrl: fallbackAuthor?.avatarUrl || "",
                tags: [],
              }
            : null),
        posts: filteredPosts,
        loading: false,
      });
    } catch {
      try {
        const response = await apiFetch(`/posts/public?page=1&limit=100`, {
          showErrorToast: false,
        });
        const availablePosts = normalizePostsPayload(response);
        const filteredPosts = filterPostsByAuthor(availablePosts, profileId);

        if (filteredPosts.length > 0) {
          const firstAuthor = filteredPosts[0];
          set({
            profile: {
              id: profileId,
              nome: firstAuthor.autor?.nome || "Autor",
              bio: "",
              avatarUrl: firstAuthor.autor?.avatarUrl || "",
              tags: [],
            },
            posts: filteredPosts,
            loading: false,
          });
          return;
        }
      } catch {
        // no-op
      }

      toast.error("Nao foi possivel carregar o perfil do autor.", {
        position: "top-right",
        autoClose: 4500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      set({
        profile: null,
        posts: [],
        error: "Nao foi possivel carregar o perfil do autor.",
        loading: false,
      });
    }
  },
}));
