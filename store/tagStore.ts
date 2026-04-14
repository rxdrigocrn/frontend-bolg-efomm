import { create } from "zustand";
import { apiFetch } from "@/services/api";

export type Tag = {
  id: string;
  name: string;
};

type TagState = {
  tags: Tag[];
  loading: boolean;
  fetchTags: () => Promise<void>;
  createTag: (name: string) => Promise<void>;
  updateTag: (id: string, name: string) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
};

const normalizeTagsPayload = (payload: unknown): Tag[] => {
  if (Array.isArray(payload)) return payload as Tag[];
  if (!payload || typeof payload !== "object") return [];

  const wrapped = payload as { data?: unknown };
  if (Array.isArray(wrapped.data)) return wrapped.data as Tag[];

  return [];
};

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  loading: false,

  fetchTags: async () => {
    set({ loading: true });
    const response = await apiFetch("/tags");
    set({ tags: normalizeTagsPayload(response), loading: false });
  },

  createTag: async (name) => {
    await apiFetch("/tags", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    await get().fetchTags();
  },

  updateTag: async (id, name) => {
    await apiFetch(`/tags/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });

    await get().fetchTags();
  },

  deleteTag: async (id) => {
    await apiFetch(`/tags/${id}`, {
      method: "DELETE",
    });

    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== id),
    }));
  },
}));
