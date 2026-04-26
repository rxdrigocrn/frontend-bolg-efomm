"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useTagStore } from "@/store/tagStore";
import {
  type CreateUserInput,
  type UpdateUserInput,
  type User,
  useUserStore,
} from "@/store/userStore";
import {
  Mail,
  AlertTriangle,
  Pencil,
  Plus,
  Save,
  X as RemoveIcon,
  Tags,
  Trash2,
  Users as UsersIcon,
  X,
} from "lucide-react";

type UserModalProps = {
  user?: User | null;
  onClose: () => void;
  onSuccess: () => void;
  createUser: (data: CreateUserInput) => Promise<void>;
  updateUser: (id: string, data: UpdateUserInput) => Promise<void>;
  tags: Array<{ id: string; name: string }>;
};

export default function UsersPage() {
  const { user } = useAuthStore();
  const { tags, fetchTags } = useTagStore();
  const { users, fetchUsers, deleteUser, createUser, updateUser } = useUserStore();
  const [modalUser, setModalUser] = useState<User | null | undefined>(undefined);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    void fetchUsers();
    void fetchTags();
  }, [fetchTags, fetchUsers]);

  const canManageUsers = user?.role === "PRESIDENTE";

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    await deleteUser(userToDelete.id);
    setUserToDelete(null);
    void fetchUsers();
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Equipe</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie os redatores e administradores do portal.</p>
        </div>

        {canManageUsers && (
          <button
            onClick={() => setModalUser(null)}
            className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
          >
            <Plus size={16} />
            Novo Usuário
          </button>
        )}
      </div>

      {!users || users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200/60 rounded-2xl shadow-sm text-center">
          <div className="bg-slate-50 p-4 rounded-full mb-4">
            <UsersIcon size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Nenhum usuário encontrado</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm">
            Você ainda não adicionou ninguém à equipe. Clique no botão acima para cadastrar o primeiro membro.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-900 font-bold">
                    {u.nome?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{u.nome}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Mail size={12} /> {u.email}
                    </p>
                    {u.tags && u.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] uppercase tracking-wide text-slate-400 inline-flex items-center gap-1">
                          <Tags size={10} /> Tags:
                        </span>
                        {u.tags.map((tag) => (
                          <span
                            key={`${u.id}-${tag.id}`}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-100 text-blue-700"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span
                    className={`px-2 py-1 text-xs rounded-md font-bold ${
                      u.role === "PRESIDENTE"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {u.role}
                  </span>

                  <div className="flex items-center gap-1">
                    {canManageUsers && (
                      <button
                        onClick={() => setModalUser(u)}
                        className="p-2 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar usuário"
                      >
                        <Pencil size={18} />
                      </button>
                    )}
                    {canManageUsers && (
                      <button
                        onClick={() => setUserToDelete(u)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remover usuário"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modalUser !== undefined && (
        <UserModal
          user={modalUser}
          tags={tags}
          onClose={() => setModalUser(undefined)}
          onSuccess={() => {
            fetchUsers();
            setModalUser(undefined);
          }}
          createUser={createUser}
          updateUser={updateUser}
        />
      )}

      {userToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Confirmar exclusão</h2>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Tem certeza que deseja remover o usuário {userToDelete.nome}? Esta ação não pode ser desfeita.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmDelete()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UserModal({ user, onClose, onSuccess, createUser, updateUser, tags }: UserModalProps) {
  const { user: currentUser } = useAuthStore();
  const isEditing = Boolean(user);
  const canChooseRole = currentUser?.role === "PRESIDENTE";

  const initialTagIds = useMemo(() => user?.tags?.map((tag) => tag.id) || [], [user]);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    password: "",
    bio: "",
    role: "REDATOR" as "REDATOR" | "PRESIDENTE",
    tagIds: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreviewUrl(user?.avatarUrl || "");
      return;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile, user]);

  useEffect(() => {
    setForm({
      nome: user?.nome || "",
      email: user?.email || "",
      password: "",
      bio: user?.bio || "",
      role: user?.role || "REDATOR",
      tagIds: initialTagIds,
    });
    setSelectedTagId("");
    setAvatarFile(null);
  }, [initialTagIds, user]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setAvatarFile(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (isEditing && user) {
        const payload: UpdateUserInput = {
          nome: form.nome,
          email: form.email,
          bio: form.bio,
          role: form.role,
          tagIds: form.tagIds,
        };

        if (form.password.trim()) {
          payload.password = form.password;
        }

        if (avatarFile) {
          payload.avatarFile = avatarFile;
        }

        await updateUser(user.id, payload);
      } else {
        await createUser({
          nome: form.nome,
          email: form.email,
          password: form.password,
          bio: form.bio,
          avatarFile: avatarFile || undefined,
          role: form.role,
          tagIds: form.tagIds,
        });
      }
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setForm((current) => ({
      ...current,
      tagIds: current.tagIds.includes(tagId)
        ? current.tagIds.filter((id) => id !== tagId)
        : [...current.tagIds, tagId],
    }));
  };

  const addSelectedTag = () => {
    if (!selectedTagId || form.tagIds.includes(selectedTagId)) {
      setSelectedTagId("");
      return;
    }

    setForm((current) => ({
      ...current,
      tagIds: [...current.tagIds, selectedTagId],
    }));
    setSelectedTagId("");
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? "Editar Usuário" : "Novo Usuário"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isEditing
                ? "Atualize os dados e ajuste as tags vinculadas ao usuário."
                : "Cadastre um novo usuário e já defina as tags de acesso."}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Nome Completo</label>
              <input
                required
                value={form.nome}
                placeholder="Ex: João Silva"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">E-mail</label>
              <input
                required
                value={form.email}
                type="email"
                placeholder="joao@exemplo.com"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Foto do Usuário</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4">
                <div className="h-20 w-20 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                  {avatarPreviewUrl ? (
                    <img src={avatarPreviewUrl} alt="Pré-visualização do avatar" className="h-full w-full object-cover" />
                  ) : (
                    <UsersIcon size={28} className="text-slate-300" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-900 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-blue-800"
                    onChange={handleAvatarChange}
                  />
                  <p className="text-xs text-slate-500">
                    Use uma imagem para representar o usuário. Em edição, deixe em branco para manter a foto atual.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                {isEditing ? "Nova Senha" : "Senha Provisória"}
              </label>
              <input
                required={!isEditing}
                value={form.password}
                type="password"
                placeholder={isEditing ? "Deixe em branco para manter a atual" : "••••••••"}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Bio</label>
              <textarea
                value={form.bio}
                rows={3}
                placeholder="Breve descrição do usuário"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
          </div>

          {canChooseRole && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Tipo de Usuário</label>
              <select
                value={form.role}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value as "REDATOR" | "PRESIDENTE",
                  })
                }
              >
                <option value="REDATOR">Redator</option>
                <option value="PRESIDENTE">Presidente</option>
              </select>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Tags</label>
              <p className="text-xs text-slate-500 mt-1">
                Selecione uma ou mais tags para vincular ao usuário.
              </p>
            </div>

            {tags.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-xl p-4 text-sm text-slate-500">
                Nenhuma tag cadastrada ainda.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={selectedTagId}
                    onChange={(event) => setSelectedTagId(event.target.value)}
                    className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="">Selecione uma tag</option>
                    {tags
                      .filter((tag) => !form.tagIds.includes(tag.id))
                      .map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                  </select>

                  <button
                    type="button"
                    onClick={addSelectedTag}
                    disabled={!selectedTagId}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-900 text-white hover:bg-blue-800 transition-colors disabled:opacity-60"
                  >
                    <Plus size={16} />
                    Adicionar
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {form.tagIds.length === 0 ? (
                    <span className="text-xs text-slate-500">Nenhuma tag adicionada.</span>
                  ) : (
                    form.tagIds.map((tagId) => {
                      const tag = tags.find((item) => item.id === tagId);

                      if (!tag) return null;

                      return (
                        <span
                          key={tag.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"
                        >
                          {tag.name}
                          <button
                            type="button"
                            onClick={() => toggleTag(tag.id)}
                            className="rounded-full p-0.5 hover:bg-blue-200 transition-colors"
                            title="Remover tag"
                          >
                            <RemoveIcon size={12} />
                          </button>
                        </span>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              disabled={loading}
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-70"
            >
              <Save size={16} />
              {loading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Cadastrar Usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}