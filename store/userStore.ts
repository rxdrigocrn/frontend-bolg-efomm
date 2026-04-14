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
  avatarUrl?: string;
  role?: "REDATOR" | "PRESIDENTE";
  tagIds?: string[];
};

export type UpdateUserInput = {
  nome?: string;
  email?: string;
  password?: string;
  bio?: string;
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

  fetchUsers: async () => {
    const data = await apiFetch("/users");
    const currentUserId = useAuthStore.getState().user?.id;
    const users = Array.isArray(data) ? data : [];

    set({
      users: currentUserId ? users.filter((user) => user.id !== currentUserId) : users,
    });
  },

  createUser: async (data) => {
    await apiFetch("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });

    await useUserStore.getState().fetchUsers();
  },

  updateUser: async (id, data) => {
    await apiFetch(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

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