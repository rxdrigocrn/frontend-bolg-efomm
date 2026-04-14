"use client";

import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore"; // Importando a sua store!
import { useTagStore } from "@/store/tagStore";
import { Camera, Mail, ShieldCheck, UserRound, Save, Loader2, Plus, Tags, X } from "lucide-react";
import { apiFetch } from "@/services/api";

export default function ProfileDashboardPage() {
  const { user } = useAuthStore();
  const canEditTags = user?.role === "PRESIDENTE";
  
  // Usando a store que você já tem
  const { profile, loading: profileLoading, fetchProfileWithPosts } = useProfileStore();
  const { tags, fetchTags } = useTagStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  // Estado do formulário
  const [form, setForm] = useState({
    nome: "",
    bio: "",
    avatarUrl: "",
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // 1. Busca os dados via Store assim que o ID do usuário estiver disponível
  useEffect(() => {
    if (user?.id) {
      void fetchProfileWithPosts(user.id);
    }
  }, [user?.id, fetchProfileWithPosts]);

  useEffect(() => {
    if (canEditTags) {
      void fetchTags();
    }
  }, [canEditTags, fetchTags]);

  // 2. Quando o perfil carregar na Store, preenchemos o formulário
  useEffect(() => {
    if (profile) {
      setForm({
        nome: profile.nome || user?.nome || "", // Se não tiver nome no perfil, pega do user
        bio: profile.bio || "",
        avatarUrl: profile.avatarUrl || "",
      });
      setPreviewUrl(profile.avatarUrl || null);
      setSelectedTagIds(profile.tags?.map((tag) => tag.id) || []);
    } else if (user) {
      // Fallback caso a API ainda não tenha um perfil pra esse usuário
      setForm({
        nome: user.nome || "",
        bio: "",
        avatarUrl: "",
      });
      setSelectedTagIds([]);
    }
  }, [profile, user]);

  // Lida com a seleção da imagem local
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");

    try {
      let dataToSubmit: any;

      if (file) {
        const formData = new FormData();
        formData.append("nome", form.nome);
        formData.append("bio", form.bio);
        formData.append("file", file);
        dataToSubmit = formData;
      } else {
        dataToSubmit = {
          nome: form.nome,
          bio: form.bio,
          ...(canEditTags ? { tagIds: selectedTagIds } : {}),
        };
      }

      if (dataToSubmit instanceof FormData && canEditTags) {
        selectedTagIds.forEach((tagId) => dataToSubmit.append("tagIds", tagId));
      }

      // ⚠️ IMPORTANTE: Mantive a rota /users do seu código antigo.
      // Se você for salvar pela rota nova de Profile, altere para `/profiles/${profile?.id || user?.id}`
      await apiFetch(`/users/${user?.id}`, {
        method: "PATCH",
        body: dataToSubmit instanceof FormData ? dataToSubmit : JSON.stringify(dataToSubmit),
      });

      setSuccessMsg("Perfil atualizado com sucesso!");
      
      // Atualiza a store para os novos dados refletirem na tela instantaneamente
      await fetchProfileWithPosts(user!.id);
      
      setTimeout(() => setSuccessMsg(""), 3000);
      
    } catch (error) {
      console.error("Erro ao salvar", error);
    } finally {
      setSaving(false);
    }
  };

  // Trava de segurança para não exibir a tela enquanto o usuário não existir na sessão
  // ou enquanto a Store estiver fazendo o fetch inicial.
  if (!user?.nome || profileLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-900" size={40} />
      </div>
    );
  }

  const addSelectedTag = () => {
    if (!selectedTagId || selectedTagIds.includes(selectedTagId)) {
      setSelectedTagId("");
      return;
    }

    setSelectedTagIds((current) => [...current, selectedTagId]);
    setSelectedTagId("");
  };

  const removeTag = (tagId: string) => {
    setSelectedTagIds((current) => current.filter((id) => id !== tagId));
  };

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Meu Perfil</h1>
        <p className="text-sm text-slate-500 mt-1">Gerencie suas informações públicas e foto de perfil.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        
        {/* CABEÇALHO DO PERFIL */}
        <div className="h-32 bg-gradient-to-r from-blue-900 to-blue-700 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="relative group">
              <div className="h-24 w-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-900 overflow-hidden ring-1 ring-slate-200">
                {previewUrl ? (
                  <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserRound size={40} className="text-slate-300" />
                )}
              </div>
              
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
              >
                <Camera size={20} />
              </button>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden" 
            />
          </div>
        </div>

        {/* INFO FIXA */}
        <div className="pt-16 pb-6 px-8 border-b border-slate-100 flex flex-wrap gap-6 justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{form.nome || "Seu Nome"}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
              <span className="flex items-center gap-1.5"><Mail size={16} className="text-slate-400"/> {user?.email}</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-slate-400"/> Cargo: <strong className="text-slate-800">{user?.role}</strong></span>
            </div>
          </div>
        </div>

        {/* FORMULÁRIO DE EDIÇÃO */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase">Nome de Exibição</label>
            <input
              required
              value={form.nome}
              placeholder="Ex: João da Silva"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase flex justify-between">
              <span>Biografia / Sobre você</span>
              <span className="text-slate-400">{form.bio?.length || 0}/300</span>
            </label>
            <textarea
              rows={4}
              value={form.bio}
              maxLength={300}
              placeholder="Escreva um pouco sobre sua trajetória profissional, interesses..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 resize-none"
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
            <p className="text-xs text-slate-500">Essa biografia aparecerá no final de todas as matérias que você escrever.</p>
          </div>

          {canEditTags && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
                <Tags size={12} />
                Minhas Tags
              </label>

              {tags.length === 0 ? (
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
                        .filter((tag) => !selectedTagIds.includes(tag.id))
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
                    {selectedTagIds.length === 0 ? (
                      <span className="text-xs text-slate-500">Sem tags vinculadas.</span>
                    ) : (
                      selectedTagIds.map((tagId) => {
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
          )}

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <div>
              {successMsg && (
                <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  ✓ {successMsg}
                </span>
              )}
            </div>
            <button 
              type="submit"
              disabled={saving} 
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-70 shadow-sm hover:shadow-md"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}