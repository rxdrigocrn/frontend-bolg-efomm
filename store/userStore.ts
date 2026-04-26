import { create } from "zustand";
import { apiFetch } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export type UserTag = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  nome: string;
  email: string;
  role: "PRESIDENTE" | "REDATOR";
  bio: string;
  avatarUrl: string;
  tags?: UserTag[];
};

export type CreateUserInput = {
  nome: string;
  email: string;
  password: string;
  bio?: string;
  avatarFile?: File;
  role?: "REDATOR" | "PRESIDENTE";
  tagIds?: string[];
};

export type UpdateUserInput = {
  nome?: string;
  email?: string;
  password?: string;
  bio?: string;
  avatarFile?: File;
  avatarUrl?: string;
  role?: "REDATOR" | "PRESIDENTE";
  tagIds?: string[];
};

type UserState = {
  users: User[];
  fetchUsers: () => Promise<void>;
  createUser: (data: CreateUserInput) => Promise<void>;
  updateUser: (id: string, data: UpdateUserInput) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateUserTags: (userId: string, tagIds: string[]) => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
  users: [],

  createUser: async (data) => {
    const formData = new FormData();
    formData.append("nome", data.nome);
    formData.append("email", data.email);
    formData.append("password", data.password);

    formData.append("bio", data.bio ?? "");
    if (data.avatarFile) {
      formData.append("file", data.avatarFile);
    }

    if (data.role) formData.append("role", data.role);
    data.tagIds?.forEach((tagId) => formData.append("tagIds", tagId));

    await apiFetch("/users", {
      method: "POST",
      body: formData,
    });

    await useUserStore.getState().fetchUsers();
  },

  fetchUsers: async () => {
    const data = await apiFetch("/users");
    const currentUserId = useAuthStore.getState().user?.id;
    const users = Array.isArray(data) ? data : [];

    set({
      users: currentUserId ? users.filter((user) => user.id !== currentUserId) : users,
    });
  },

  updateUser: async (id, data) => {
    const hasFile = data.avatarFile instanceof File;

    if (hasFile) {
      const formData = new FormData();

      if (data.nome !== undefined) formData.append("nome", data.nome);
      if (data.email !== undefined) formData.append("email", data.email);
      if (data.password !== undefined) formData.append("password", data.password);
      if (data.bio !== undefined) formData.append("bio", data.bio);
      if (data.role !== undefined) formData.append("role", data.role);
      if (data.avatarFile) {
        formData.append("file", data.avatarFile);
      }
      data.tagIds?.forEach((tagId) => formData.append("tagIds", tagId));

      await apiFetch(`/users/${id}`, {
        method: "PATCH",
        body: formData,
      });
    } else {
      await apiFetch(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    }

    await useUserStore.getState().fetchUsers();
  },

  deleteUser: async (id) => {
    await apiFetch(`/users/${id}`, {
      method: "DELETE",
    });

    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    }));
  },

  updateUserTags: async (userId, tagIds) => {
    await useUserStore.getState().updateUser(userId, { tagIds });
  },
}));