import Image from "next/image";
import { HamburgerMenu } from "@/components/HamburguerMenu";
export default function Home() {
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
                Nosso foco é apresentar informações sobre a profissão,
                rotina e adaptação dos alunos, além de cobrir eventos.
              </p>

              <p>
                Somos um espaço de expressão, informação e conexão entre
                alunos, famílias e a comunidade marítima.
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

          <div className="equipe-grid">
            {[
              {
                nome: "Al. Marcio Rodriguez Filho",
                cargo: "Presidente do Jornal Canal 16",
                info: "3º ano de Náutica",
                img: "/img/marcinho.jpeg",
              },
              {
                nome: "Al. Kamilla Rutowitcz",
                cargo: "Vice-Presidente",
                info: "3º ano de Náutica",
                img: "/img/kamila.png",
              },
              {
                nome: "Al. Josué Pedrosa",
                cargo: "Desenvolvedor do Site",
                info: "3º ano de Máquinas",
                img: "/img/josuepedrosa.jpeg",
              },
              {
                nome: "Al. Silveira",
                cargo: "Enc. de Mídias",
                info: "2º ano de Náutica",
                img: "/img/silveira.png",
              },
              {
                nome: "Al. Ayra Poderoso",
                cargo: "Enc. de Redação",
                info: "3º ano de Máquinas",
                img: "/img/danuza.jpeg",
              },
              {
                nome: "Al. Luiz Barbosa",
                cargo: "Fotografia e Cinegrafia",
                info: "3º ano de Máquinas",
                img: "/img/luizbarbosa.jpeg",
              },
            ].map((membro, i) => (
              <div key={i} className="equipe-member">
                
                <div className="member-photo">
                  <Image
                    src={membro.img}
                    alt={membro.nome}
                    width={200}
                    height={200}
                  />
                </div>

                <h3>{membro.nome}</h3>
                <p className="member-cargo">{membro.cargo}</p>
                <p className="member-info">{membro.info}</p>

                <div className="member-line"></div>
              </div>
            ))}
          </div>
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
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            
            <div className="footer-section">
              <h4>Jornal Canal 16</h4>
              <p>
                Portal de notícias e informações dos alunos da EFOMM em Belém, Pará.
              </p>
            </div>

            <div className="footer-section">
              <h4>Links Rápidos</h4>
              <ul>
                <li><a href="#">Portal de Notícias</a></li>
                <li><a href="#">Sobre</a></li>
                <li><a href="#">Contato</a></li>
                <li><a href="#">Equipe</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Redes Sociais</h4>
              <div className="footer-social">
                <a href="https://instagram.com/jornalcanal16">IG</a>
                <a href="https://youtube.com/@JornalCanal.16">YT</a>
                <a href="https://facebook.com/JornalCanal16">FB</a>
              </div>
            </div>

          </div>

          <div className="footer-bottom">
            <p>© 2026 Jornal Canal 16</p>
            <p>EFOMM (CIABA) • Belém, Pará</p>
          </div>
        </div>
      </footer>

    </div>
  );
}