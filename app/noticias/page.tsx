"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HamburgerMenu } from "@/components/HamburguerMenu";
import {
  LogIn,
  ArrowRight,
  Newspaper,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePostStore } from "@/store/postStore";

export default function Noticias() {
  const router = useRouter();

  // Pegando dados da Store
  const { posts, meta, loading, fetchPublicPosts } = usePostStore();

  // Estado local para controlar a página atual
  const [currentPage, setCurrentPage] = useState(1);

  // Busca os posts sempre que a página atual mudar
  useEffect(() => {
    fetchPublicPosts(currentPage, 9); // Traz 9 por página
  }, [currentPage]);

  // Função para formatar a data (ex: 12 de Abril de 2026)
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(data);
  };

  const handleNoticiaClick = (id: string) => {
    // Você pode mudar para `/noticias/${post.slug}` se preferir usar a URL amigável
    router.push(`/noticias/${id}`);
  };

  const handleAutorClick = (event: MouseEvent, autorId?: string) => {
    event.stopPropagation();
    if (!autorId) return;
    router.push(`/perfil/${autorId}`);
  };

  return (
    <div className="noticias-page">
      <HamburgerMenu />

      <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
        {/* HEADER / NAV */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <img
                  src="/img/logo.jpg"
                  className="w-12 h-12 object-cover rounded-lg"
                />
              </Link>
            </div>

            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-medium text-sm hover:bg-blue-900 hover:text-white transition-all duration-300"
            >
              <LogIn size={16} />
              Área do Redator
            </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-blue-900 pt-20 pb-24 text-white">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-800 text-blue-200 text-xs font-bold uppercase tracking-widest">
              Informativo Oficial
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Portal de Notícias{" "}
              <span className="text-blue-400 text-3xl md:text-5xl">EFOMM</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto opacity-90 leading-relaxed">
              Acompanhe em tempo real os acontecimentos, editais e a rotina da
              Marinha Mercante.
            </p>
          </div>
        </section>

        {/* MENSAGEM DE CARREGANDO OU VAZIO */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Newspaper className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700">
              Nenhuma notícia encontrada
            </h3>
            <p>Volte mais tarde para novas atualizações.</p>
          </div>
        ) : (
          <main className="max-w-7xl mx-auto px-6 mt-12 pb-20">
            {/* GRID DE NOTÍCIAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((item) => (
                <article
                  key={item.id}
                  onClick={() => handleNoticiaClick(item.id)}
                  className="group cursor-pointer bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Imagem/Thumbnail */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-200 flex items-center justify-center">
                    {item.imagemUrl ? (
                      <img
                        src={item.imagemUrl}
                        alt={item.titulo}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-5xl group-hover:scale-110 transition-transform duration-500">
                        🚢
                      </div>
                    )}

                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1 rounded-md bg-white/90 backdrop-blur shadow-sm text-[10px] font-bold uppercase text-blue-900 tracking-wider">
                        Informativo
                      </span>
                    </div>
                  </div>
                  {/* Conteúdo */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Autor e Data */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 font-bold text-xs shadow-sm">
                        {item.autor?.avatarUrl ? (
                          <img
                            src={item.autor.avatarUrl}
                            alt={item.autor.nome}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          item.autor?.nome?.charAt(0) || "U"
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(event) =>
                          handleAutorClick(
                            event,
                            item.autor?.id || item.autorId,
                          )
                        }
                        className="flex flex-col text-left"
                      >
                        <span className="text-sm font-semibold text-slate-800 hover:text-blue-700 transition-colors">
                          {item.autor?.nome || "Redação"}
                        </span>
                        <time className="text-[11px] font-medium text-slate-500">
                          {formatarData(item.createdAt)}
                        </time>
                      </button>
                    </div>

                    <h3 className="text-xl font-bold leading-snug text-slate-900 group-hover:text-blue-700 transition-colors mb-3 line-clamp-2">
                      {item.titulo}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-6">
                      {item.conteudo}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-blue-700 group-hover:text-blue-800">
                      <span className="text-sm font-bold">Ler reportagem</span>
                      <ArrowRight
                        size={18}
                        className="transform group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {posts.map((item) => (
    <article
      key={item.id}
      onClick={() => handleNoticiaClick(item.id)}
      className="group cursor-pointer bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-row h-48 overflow-hidden"
    >
       <div className="relative w-2/5 shrink-0 overflow-hidden bg-slate-200">
        {item.imagemUrl ? (
          <img
            src={item.imagemUrl}
            alt={item.titulo}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl bg-slate-100">
            🚢
          </div>
        )}
      </div>

       <div className="p-4 flex flex-col flex-1 min-w-0">  
        <div className="flex items-center gap-2 mb-2">
          <time className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">
            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
          </time>
        </div>

        <h3 className="text-sm font-bold leading-tight text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-3 mb-2">
          {item.titulo}
        </h3>
        
        <p className="text-[12px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
          {item.conteudo}
        </p>

        <div className="mt-auto flex items-center text-[11px] font-bold text-blue-700">
          <span className="group-hover:mr-2 transition-all">Ler mais</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </article>
  ))}
</div> */}

            {/* CONTROLES DE PAGINAÇÃO */}
            {meta && meta.lastPage > 1 && (
              <div className="flex items-center j   ustify-center gap-4 mt-16">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft size={16} /> Anterior
                </button>

                <span className="text-sm font-medium text-slate-500">
                  Página {meta.page} de {meta.lastPage}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(meta.lastPage, p + 1))
                  }
                  disabled={currentPage === meta.lastPage}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  Próxima <ChevronRight size={16} />
                </button>
              </div>
            )}
          </main>
        )}

        {/* FOOTER */}
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 grayscale opacity-70">
              <span className="font-bold text-white">Canal 16</span>
            </div>
            <p className="text-[13px]">
              © 2026 Jornal Canal 16 • Centro de Instrução Almirante Braz de
              Aguiar
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contato
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
