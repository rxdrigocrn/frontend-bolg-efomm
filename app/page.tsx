"use client";

import Image from "next/image";
import { useEffect } from "react";
import { HamburgerMenu } from "@/components/HamburguerMenu";
import { useManagementStore } from "@/store/managementStore";
import Footer from "@/components/Footer";

export default function Home() {
  const { members, loading, fetchMembers } = useManagementStore();

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  return (
    <div>
      {/* HERO */}
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

          <h1 className="hero-title">Jornal Canal 16</h1>

          <p className="hero-subtitle">
            Informações, notícias e histórias dos Alunos da EFOMM
          </p>

          <p className="hero-location">
            Escola de Formação de Oficiais da Marinha Mercante • Belém, Pará
          </p>
        </div>
      </section>

      {/* SOBRE */}
      <section className="sobre">
        <div className="container">
          <h2>Sobre o Jornal</h2>

          <div className="sobre-content">
            <Image
              src="/img/7setembro.jpg"
              alt="Jornal Canal 16"
              width={500}
              height={500}
              className="sobre-image"
            />

            <div className="sobre-text">
              <p>
                O <strong>Jornal Canal 16</strong> é um portal de notícias
                criado por alunos da EFOMM (CIABA), em Belém do Pará.
              </p>

              <p>
                Nosso foco é apresentar informações sobre a profissão, rotina e
                adaptação dos alunos, além de cobrir eventos.
              </p>

              <p>
                Somos um espaço de expressão, informação e conexão entre alunos,
                famílias e a comunidade marítima.
              </p>

              <div className="decorative-line">
                <span>Marinha Mercante • Novidades • Rotina</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPE */}
      <section className="equipe">
        <div className="container">
          <h2>Nossa Gerência</h2>

          {loading && members.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 py-12 text-center text-slate-500">
              Carregando gerência...
            </div>
          ) : members.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 py-12 text-center text-slate-500">
              Nenhum membro da gerência foi cadastrado ainda.
            </div>
          ) : (
            <div className="equipe-grid">
              {members.map((membro) => (
                <div key={membro.id} className="equipe-member">
                  <div className="member-photo">
                    {membro.photoUrl ? (
                      <img
                        src={membro.photoUrl}
                        alt={membro.nome}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-slate-100 text-3xl font-bold text-slate-400">
                        {membro.nome?.charAt(0)?.toUpperCase() || "M"}
                      </div>
                    )}
                  </div>

                  <h3>{membro.nome}</h3>
                  <p className="member-cargo">{membro.cargo}</p>
                  <p className="member-info">{membro.descricao}</p>

                  <div className="member-line"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTATO */}
      <section className="contato">
        <div className="container">
          <h2>Entre em Contato</h2>
          <p className="contato-subtitle">
            Conecte-se conosco através de múltiplos canais
          </p>

          <div className="contato-grid">
            <div className="contato-card">
              <div className="contato-icon-wrapper">
                <span className="contato-icon">📍</span>
              </div>

              <h3>Localização</h3>
              <p>
                CIABA <br />
                Av. Arthur Bernardes, 245 <br />
                Belém - PA
              </p>
            </div>

            <div className="contato-card">
              <div className="contato-icon-wrapper">
                <span className="contato-icon">✉️</span>
              </div>

              <h3>Email</h3>
              <a href="mailto:atendimentojornalcanal16@gmail.com">
                atendimentojornalcanal16@gmail.com
              </a>
            </div>

            <div className="contato-card">
              <div className="contato-icon-wrapper">
                <span className="contato-icon">📱</span>
              </div>

              <h3>Redes Sociais</h3>

              <div className="social-links-compact">
                <a
                  href="https://instagram.com/jornalcanal16"
                  className="social-link-icon social-instagram"
                />
                <a
                  href="https://youtube.com/@JornalCanal.16"
                  className="social-link-icon social-youtube"
                />
                <a
                  href="https://facebook.com/JornalCanal16"
                  className="social-link-icon social-facebook"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
