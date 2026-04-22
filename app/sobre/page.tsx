"use client";

import { useEffect, useMemo } from "react";
import { HamburgerMenu } from "@/components/HamburguerMenu";
import { useManagementStore } from "@/store/managementStore";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Sobre() {
  const { members, loading, fetchMembers } = useManagementStore();

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  const membrosSobre = useMemo(
    () => members.filter((member) => member.isSobre),
    [members],
  );

  return (
    <div className="bg-[#f8fafd] min-h-screen font-serif">
      <HamburgerMenu />

      {/* HERO COM ONDAS */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-bg-image"></div>
          <div className="hero-overlay"></div>
        </div>
        <HamburgerMenu />
        <div className="hero-content">
          <Image
            src="/img/logo.jpg"
            alt="Logo Jornal Canal 16"
            width={120}
            height={120}
            className="logo-placeholder"
          />

          <h1 className="hero-title">Sobre nós</h1>

          <p className="hero-subtitle">
            Conheça a equipe por trás do Jornal Canal 16
          </p>
        </div>
      </section>

      {/* EQUIPE */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl text-center font-bold mb-16 text-[#003366] tracking-tight">
          Nossa Equipe
        </h2>

        {loading && membrosSobre.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/50 py-20 text-center text-slate-500">
            Carregando equipe...
          </div>
        ) : membrosSobre.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/50 py-20 text-center text-slate-500">
            Nenhum membro cadastrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 justify-items-center">
            {membrosSobre.map((membro) => (
              <div
                key={membro.id}
                className="group w-full max-w-sm bg-white rounded-[2rem] p-8 text-center shadow-xl shadow-slate-200/60 border border-slate-100 transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl hover:shadow-slate-300/70"
              >
                {/* Moldura da Foto Dourada */}
                <div className="relative mx-auto mb-8 h-48 w-48 shrink-0 transition-transform duration-500 ease-out group-hover:-rotate-2 group-hover:scale-105">
                  <div className="absolute inset-0 rounded-full border-[3px] border-[#c5a059] p-1 transition-colors duration-500 group-hover:border-[#d5b06a]">
                    <div className="h-full w-full overflow-hidden rounded-full bg-slate-50 border border-[#c5a059]/30">
                      {membro.photoUrl ? (
                        <img
                          src={membro.photoUrl}
                          alt={membro.nome}
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-[#c5a059]/40 transition-transform duration-500 ease-out group-hover:scale-110">
                          {membro.nome?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Conteúdo Textual */}
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-[#003366] leading-tight px-2">
                    {membro.nome}
                  </h3>

                  <p className="text-base font-semibold text-[#c5a059] uppercase tracking-wider">
                    {membro.cargo}
                  </p>

                  <div className="w-12 h-[2px] bg-[#c5a059]/30 mx-auto my-4"></div>

                  <p className="text-sm text-slate-500 leading-relaxed italic">
                    {membro.descricao || "3º ano de Náutica"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
