"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useTagStore } from "@/store/tagStore";
import { Pencil, Plus, Save, Tags, Trash2, UserRound, X } from "lucide-react";

export default function TagsPage() {
  const { user } = useAuthStore();
  const { tags, fetchTags, createTag, updateTag, deleteTag } = useTagStore();

  const [newTagName, setNewTagName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    void fetchTags();
  }, [fetchTags]);

  if (user?.role !== "PRESIDENTE") {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <h1 className="text-xl font-bold text-slate-900">Acesso restrito</h1>
        <p className="text-sm text-slate-500 mt-2">
          Apenas presidentes podem gerenciar tags e vincular tags a usuarios.
        </p>
      </div>
    );
  }

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    const name = newTagName.trim();
    if (!name) return;

    try {
      setCreating(true);
      await createTag(name);
      setNewTagName("");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (tagId: string) => {
    const name = editingName.trim();
    if (!name) return;

    await updateTag(tagId, name);
    setEditingTagId(null);
    setEditingName("");
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tags</h1>
        <p className="text-sm text-slate-500 mt-1">
          Somente presidentes podem criar tags e atribui-las aos usuarios.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">
            Criar Nova Tag
          </h2>

          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              value={newTagName}
              onChange={(event) => setNewTagName(event.target.value)}
              placeholder="Ex: Politica"
              className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-70"
            >
              <Plus size={16} />
              {creating ? "Criando..." : "Criar"}
            </button>
          </form>

          <div className="mt-6 space-y-2">
            {tags.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-xl p-4 text-sm text-slate-500">
                Nenhuma tag cadastrada ainda.
              </div>
            ) : (
              tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between border border-slate-200 rounded-xl p-3"
                >
                  {editingTagId === tag.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                      />
                      <button
                        onClick={() => handleUpdate(tag.id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        title="Salvar"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingTagId(null);
                          setEditingName("");
                        }}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                        title="Cancelar"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Tags size={14} className="text-blue-700" />
                        {tag.name}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingTagId(tag.id);
                            setEditingName(tag.name);
                          }}
                          className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => void deleteTag(tag.id)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
