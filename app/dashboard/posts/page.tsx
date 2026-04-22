"use client";

import { useEffect, useState } from "react";
import { usePostStore } from "@/store/postStore";
import { useTagStore } from "@/store/tagStore";
import { Plus, X, FileText, Trash2, Pencil, AlertTriangle, Tags } from "lucide-react";

export default function PostsPage() {
  // Assuma que você tenha ou crie um 'updatePost' no seu Zustand store
  const { posts, fetchPosts, deletePost, createPost, updatePost } =
    usePostStore();
  const { tags, fetchTags } = useTagStore();

  // Controles de Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<any | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  useEffect(() => {
    void fetchPosts();
    void fetchTags();
  }, [fetchPosts, fetchTags]);

  // Abre modal vazio para criar
  const handleOpenCreate = () => {
    setPostToEdit(null);
    setIsModalOpen(true);
  };

  // Abre modal preenchido para editar
  const handleOpenEdit = (post: any) => {
    setPostToEdit(post);
    setIsModalOpen(true);
  };

  // Confirma a exclusão
  const handleConfirmDelete = async () => {
    if (postToDelete) {
      await deletePost(postToDelete);
      setPostToDelete(null);
      fetchPosts(); // Atualiza a lista após deletar
    }
  };

  return (
    <div className="space-y-6 fade-in relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Notícias
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie as publicações do portal.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
        >
          <Plus size={16} />
          Nova Matéria
        </button>
      </div>

      {/* EMPTY STATE OU TABELA */}
      {!posts || posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200/60 rounded-2xl shadow-sm text-center">
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            <FileText size={32} className="text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Nenhuma matéria escrita
          </h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm">
            O portal está vazio. Clique em "Nova Matéria" para começar a
            publicar conteúdos.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200/60 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Título da Matéria</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Autor</th>
                  <th className="px-6 py-4">Tags</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 max-w-[300px] truncate">
                      {post.titulo}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                          post.publicado
                            ? "bg-emerald-100/80 text-emerald-700"
                            : "bg-amber-100/80 text-amber-700"
                        }`}
                      >
                        {post.publicado ? "Publicado" : "Rascunho"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-slate-100/80 text-slate-700">
                        {post.autor?.nome || "Desconecido"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {!post.tags || post.tags.length === 0 ? (
                        <span className="text-xs text-slate-400">Sem tags</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map((tag) => {
                            if (!tag?.name) return null;

                            return (
                              <span
                                key={`${post.id}-${tag.id}`}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-100 text-blue-700"
                              >
                                {tag.name}
                              </span>
                            );
                          })}
                          {post.tags.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setPostToDelete(post.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL CRIAR/EDITAR POST */}
      {isModalOpen && (
        <PostModal
          postToEdit={postToEdit}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchPosts();
            setIsModalOpen(false);
          }}
          createPost={createPost}
          updatePost={updatePost}
          tags={tags}
        />
      )}

      {/* MODAL DE CONFIRMAÇÃO DE DELEÇÃO */}
      {postToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Confirmar exclusão
              </h2>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Tem certeza que deseja apagar esta matéria? Esta ação não pode ser
              desfeita e removerá o conteúdo permanentemente.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
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

/* ================= MODAL DE POSTS (CRIAR E EDITAR) ================= */
function PostModal({
  onClose,
  onSuccess,
  createPost,
  updatePost,
  postToEdit,
  tags,
}: any) {
  const [form, setForm] = useState({
    titulo: "",
    conteudo: "",
    imagemUrl: "",
    publicado: true,
    tagIds: [] as string[],
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState("");

  // Preenche ou limpa os campos ao abrir o modal
  useEffect(() => {
    const initialTagIds = Array.isArray(postToEdit?.tags)
      ? postToEdit.tags
          .map((tag: { id?: string }) => tag?.id)
          .filter(Boolean)
      : [];

    if (postToEdit) {
      setForm({
        titulo: postToEdit.titulo || "",
        conteudo: postToEdit.conteudo || "",
        imagemUrl: postToEdit.imagemUrl || "",
        publicado: postToEdit.publicado ?? true,
        tagIds: initialTagIds,
      });
    } else {
      setForm({
        titulo: "",
        conteudo: "",
        imagemUrl: "",
        publicado: true,
        tagIds: [],
      });
    }
    setFile(null); // Sempre reseta o arquivo
    setSelectedTagId("");
  }, [postToEdit]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      let dataToSubmit: any;

      // Monta os dados (com ou sem arquivo)
      if (file) {
        const formData = new FormData();
        formData.append("titulo", String(form.titulo));
        formData.append("conteudo", String(form.conteudo));
        formData.append("publicado", String(form.publicado));
        formData.append("file", file);
        form.tagIds.forEach((tagId) => formData.append("tags", tagId));
        dataToSubmit = formData;
      } else {
        dataToSubmit = {
          titulo: form.titulo,
          conteudo: form.conteudo,
          publicado: form.publicado,
          tags: form.tagIds,
          ...(form.imagemUrl ? { imagemUrl: form.imagemUrl } : {}),
        };
      }

      // Verifica se é edição ou criação
      if (postToEdit) {
        await updatePost(postToEdit.id, dataToSubmit);
      } else {
        await createPost(dataToSubmit);
      }

      onSuccess();
    } finally {
      setLoading(false);
    }
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

  const removeTag = (tagId: string) => {
    setForm((current) => ({
      ...current,
      tagIds: current.tagIds.filter((id) => id !== tagId),
    }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            {postToEdit ? "Editar Matéria" : "Redigir Nova Matéria"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:bg-slate-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">
              Título
            </label>
            <input
              required
              value={form.titulo}
              placeholder="Ex: Novos equipamentos chegam à EFOMM..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">
              Conteúdo
            </label>
            <textarea
              required
              rows={6}
              value={form.conteudo}
              placeholder="Escreva o corpo da matéria aqui..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">
              {postToEdit && postToEdit.imagemUrl
                ? "Substituir Imagem de Capa"
                : "Upload de Imagem"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
            />
          </div>

          {!file && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                URL da Imagem de Capa (Opcional)
              </label>
              <input
                value={form.imagemUrl}
                placeholder="https://..."
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                onChange={(e) =>
                  setForm({ ...form, imagemUrl: e.target.value })
                }
              />
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                <Tags size={12} />
                Tags da Matéria
              </label>
              <p className="text-xs text-slate-500 mt-1">
                Associe uma ou mais tags para classificar este post.
              </p>
            </div>

            {!tags || tags.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-xl p-4 text-sm text-slate-500">
                Nenhuma tag cadastrada ainda.
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={selectedTagId}
                    onChange={(event) => setSelectedTagId(event.target.value)}
                    className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="">Selecione uma tag</option>
                    {tags
                      .filter((tag: { id: string }) => !form.tagIds.includes(tag.id))
                      .map((tag: { id: string; name: string }) => (
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
                    <span className="text-xs text-slate-500">Sem tags vinculadas.</span>
                  ) : (
                    form.tagIds.map((tagId) => {
                      const tag = tags.find((item: { id: string }) => item.id === tagId);

                      if (!tag) return null;

                      return (
                        <span
                          key={tag.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"
                        >
                          {tag.name}
                          <button
                            type="button"
                            onClick={() => removeTag(tag.id)}
                            className="rounded-full p-0.5 hover:bg-blue-200 transition-colors"
                            title="Remover tag"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>

          {/* Toggle Customizado para "Publicar" */}
          <div className="flex items-center gap-3 py-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, publicado: !form.publicado })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.publicado ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.publicado ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <div>
              <p className="text-sm font-medium text-slate-800">
                Publicar imediatamente
              </p>
              <p className="text-xs text-slate-500">
                Se desmarcado, será salvo como Rascunho.
              </p>
            </div>
          </div>

          <div className="pt-4 flex gap-3 justify-end border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              disabled={loading}
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-70 shadow-sm"
            >
              {loading
                ? "Salvando..."
                : postToEdit
                  ? "Salvar Alterações"
                  : "Criar Matéria"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
