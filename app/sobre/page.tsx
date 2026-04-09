import Image from "next/image";
import { HamburgerMenu } from "@/components/HamburguerMenu";

const membros = [
  { nome: "Marcio Rodriguez Filho", cargo: "Presidente", ano: "3º Náutica", img: "/img/marcinho.jpeg" },
  { nome: "Kamilla Rutowitcz", cargo: "Vice-Presidente", ano: "3º Náutica", img: "/img/kamila.png" },
  { nome: "Josué Pedrosa", cargo: "Dev", ano: "3º Máquinas", img: "/img/josuepedrosa.jpeg" },
  { nome: "Silveira", cargo: "Mídias", ano: "2º Náutica", img: "/img/silveira.png" },
];

export default function Sobre() {
  return (
    <div className="bg-[#eef3f7] min-h-screen">

      <HamburgerMenu />

      {/* HERO COM ONDAS */}
      <section className="relative bg-blue-900 text-white text-center py-24 overflow-hidden">
        
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 160" className="text-blue-800">
            <path
              fill="currentColor"
              d="M0,80 C300,20 900,140 1440,80 L1440,160 L0,160 Z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold z-10 relative">Sobre Nós</h1>
        <p className="opacity-80 mt-2">
          Conheça a equipe do Jornal Canal 16
        </p>
      </section>

      {/* EQUIPE */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl text-center font-bold mb-10">
          Nossa Equipe
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {membros.map((m, i) => (
            <div key={i} className="bg-white rounded-xl p-6 text-center shadow">

              <Image
                src={m.img}
                alt={m.nome}
                width={100}
                height={100}
                className="rounded-full mx-auto mb-4"
              />

              <h3 className="font-semibold">{m.nome}</h3>
              <p className="text-sm text-blue-700">{m.cargo}</p>
              <p className="text-xs text-gray-500">{m.ano}</p>

            </div>
          ))}
        </div>
      </section>

      <footer className="bg-blue-900 text-white py-10 text-center text-sm">
        © 2026 Jornal Canal 16
      </footer>
    </div>
  );
}