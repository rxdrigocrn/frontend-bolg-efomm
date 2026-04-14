"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  type CreateManagementInput,
  type ManagementMember,
  type UpdateManagementInput,
  useManagementStore,
} from "@/store/managementStore";
import { Loader2, Pencil, Plus, Save, Trash2, Upload, X, Users } from "lucide-react";

type MemberModalProps = {
  member?: ManagementMember | null;
  onClose: () => void;
  onSuccess: () => void;
  createMember: (data: CreateManagementInput) => Promise<void>;
  updateMember: (id: string, data: UpdateManagementInput) => Promise<void>;
};

export default function DashboardSobrePage() {
  const { user } = useAuthStore();
  const { members, loading, fetchMembers, createMember, updateMember, deleteMember } = useManagementStore();
  const [modalMember, setModalMember] = useState<ManagementMember | null | undefined>(undefined);

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  if (user?.role !== "PRESIDENTE") {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Acesso restrito</h1>
        <p className="text-sm text-slate-500 mt-2">
          Apenas presidentes podem gerenciar a seção Sobre.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sobre</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie os membros exibidos na página pública Sobre.</p>
        </div>

        <button
          onClick={() => setModalMember(null)}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
        >
          <Plus size={16} />
          Novo Membro
        </button>
      </div>

      {loading && members.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-900" size={36} />
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200/60 rounded-2xl shadow-sm text-center">
          <div className="bg-slate-50 p-4 rounded-full mb-4">
            <Users size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Nenhum membro cadastrado</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm">
            Adicione o primeiro membro para exibir a equipe na página Sobre.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {members.map((member) => (
            <article
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
            >
              <div className="h-40 bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center overflow-hidden">
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.nome}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-white border border-slate-200 flex items-center justify-center text-3xl font-bold text-slate-400">
                    {member.nome?.charAt(0)?.toUpperCase() || "M"}
                  </div>
                )}
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{member.nome}</h3>
                      <p className="text-sm text-blue-700 font-medium">{member.cargo}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      Ordem {member.order}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{member.descricao}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalMember(member)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                  >
                    <Pencil size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => void deleteMember(member.id)}
                    className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalMember !== undefined && (
        <MemberModal
          member={modalMember}
          onClose={() => setModalMember(undefined)}
          onSuccess={() => {
            void fetchMembers();
            setModalMember(undefined);
          }}
          createMember={createMember}
          updateMember={updateMember}
        />
      )}
    </div>
  );
}

function MemberModal({ member, onClose, onSuccess, createMember, updateMember }: MemberModalProps) {
  const isEditing = Boolean(member);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    nome: "",
    cargo: "",
    descricao: "",
    photoUrl: "",
    order: 0,
  });

  useEffect(() => {
    setForm({
      nome: member?.nome || "",
      cargo: member?.cargo || "",
      descricao: member?.descricao || "",
      photoUrl: member?.photoUrl || "",
      order: member?.order ?? 0,
    });
    setFile(null);
  }, [member]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      const payload = {
        nome: form.nome,
        cargo: form.cargo,
        descricao: form.descricao,
        photoUrl: form.photoUrl,
        order: form.order,
        file,
      };

      if (isEditing && member) {
        await updateMember(member.id, payload);
      } else {
        await createMember(payload);
      }

      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? "Editar Membro" : "Novo Membro"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Preencha os dados que serão exibidos na página Sobre.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Nome</label>
              <input
                required
                value={form.nome}
                onChange={(event) => setForm({ ...form, nome: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Cargo</label>
              <input
                required
                value={form.cargo}
                onChange={(event) => setForm({ ...form, cargo: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Descrição</label>
              <input
                required
                value={form.descricao}
                onChange={(event) => setForm({ ...form, descricao: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Ordem</label>
              <input
                type="number"
                value={form.order}
                onChange={(event) => setForm({ ...form, order: Number(event.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Foto URL</label>
              <input
                value={form.photoUrl}
                onChange={(event) => setForm({ ...form, photoUrl: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Upload de Foto</label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100">
                <Upload size={16} />
                <span>{file ? file.name : "Selecionar imagem"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 text-white hover:bg-blue-800 text-sm font-medium disabled:opacity-70"
            >
              <Save size={16} />
              {loading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Membro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}