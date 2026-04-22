import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Jornal Canal 16</h4>
            <p>
              Portal de notícias e informações dos alunos da EFOMM em Belém,
              Pará.
            </p>
          </div>

          <div className="footer-section">
            <h4>Links Rápidos</h4>
            <ul>
              <li>
                <a href="#">Portal de Notícias</a>
              </li>
              <li>
                <a href="#">Sobre</a>
              </li>
              <li>
                <a href="#">Contato</a>
              </li>
              <li>
                <a href="#">Equipe</a>
              </li>
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
  );
};

export default Footer;
