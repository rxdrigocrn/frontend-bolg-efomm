import { HamburgerMenu } from "@/components/HamburguerMenu";

export default function Noticias() {
  const noticias = Array.from({ length: 6 });

  return (
    <div className="bg-[#eef3f7] min-h-screen font-sans">

      <HamburgerMenu />

      {/* HERO */}
      <section className="relative text-center py-20 bg-blue-900 text-white">
        <h1 className="text-4xl font-bold">Portal de Notícias</h1>
        <p className="opacity-80 mt-2">
          Acompanhe as últimas notícias da EFOMM
        </p>
      </section>

      {/* GRID */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">

          {noticias.map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-40 bg-gray-200 flex items-center justify-center text-3xl">
                📰
              </div>

              <div className="p-5 space-y-3">
                <span className="text-sm text-gray-500">
                  07 de Março de 2026
                </span>

                <h3 className="font-semibold text-lg">
                  Título da Notícia {i + 1}
                </h3>

                <p className="text-sm text-gray-600">
                  Breve descrição da notícia. Clique para ler mais detalhes.
                </p>

                <button className="text-blue-700 font-medium">
                  Ler mais →
                </button>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-900 text-white py-10 text-center text-sm">
        © 2026 Jornal Canal 16 • Belém, Pará
      </footer>
    </div>
  );
}