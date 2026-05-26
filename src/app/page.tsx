import { Cog, Factory, Microscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import SmoothAnchor from "@/components/SmoothAnchor";

/* ─── Seção Hero ─────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#fff8f2' }}>
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, #ffd8b8, transparent)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-40 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-4">
           Manufatura Aditiva  &amp;  Engenharia Aplicada
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-gray-900">
          {/* Substitua pelo headline real da empresa */}
          Soluções industriais desenvolvidas<br className="hidden md:block" /> para transformar desafios em resultados
        </h1>
        <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-600 leading-relaxed mb-10">
          {/* Substitua pela descrição real */}
          A Formwerk Soluções Industriais utiliza manufatura aditiva,
          prototipagem rápida e desenvolvimento sob demanda para criar
          soluções técnicas personalizadas, reduzindo tempo, custos e
          limitações dos processos industriais tradicionais.
        </p>
        <SmoothAnchor
          href="#contato"
          className="inline-flex items-center px-7 py-3.5 text-sm font-semibold text-[#fff8f2]
                     rounded-md shadow hover:scale-105 transition-all duration-200 transform bg-gray-600"
        >
          Entre em contato
        </SmoothAnchor>
      </div>
    </section>
  );
}

/* ─── Seção Sobre ────────────────────────────────────────────────────────── */
function Sobre() {
  return (
    <section id="sobre" className="bg-[#fff8f2] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Quem somos
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-5">
            {/* Substitua */}
            Engenharia, inovação e manufatura aditiva aplicadas à indústria
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {/* Substitua pelo texto real da empresa */}
            A Formwerk Soluções Industriais nasceu com o propósito de utilizar
            a manufatura aditiva como ferramenta estratégica para resolver
            desafios reais da indústria. Desenvolvemos peças técnicas,
            protótipos funcionais, dispositivos personalizados e soluções sob
            demanda com foco em agilidade, precisão e redução de custos.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Seção Soluções ─────────────────────────────────────────────────────── */
const SOLUCOES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Cog,
    title: "Desenvolvimento sob demanda",
    description:
      "Projetos personalizados desenvolvidos para atender necessidades específicas da indústria.",
  },
  {
    icon: Factory,
    title: "Manufatura aditiva",
    description:
      "Produção de peças técnicas e funcionais através de impressão 3D industrial.",
  },
  {
    icon: Microscope,
    title: "Prototipagem rápida",
    description:
      "Validação ágil de conceitos e redução do tempo entre ideia e aplicação prática.",
  },
];

function Solucoes() {
  return (
    <section id="solucoes" className="bg-[#fff8f2] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            O que oferecemos
          </p>
          <h2 className="text-3xl font-bold text-gray-900">
            Soluções industriais inteligentes e personalizadas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SOLUCOES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-gray-100 rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <Icon className="h-8 w-8 mb-4" style={{ color: '#808080' }} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Seção Contato ──────────────────────────────────────────────────────── */
function Contato() {
  return (
    <section id="contato" className="bg-[#fff8f2] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-lg mx-auto text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Fale conosco
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Vamos trabalhar juntos?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Preencha o formulário e nossa equipe entrará em contato em breve.
            Suas informações são protegidas com criptografia de ponta.
          </p>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}

/* ─── Página ─────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Hero />
      <Sobre />
      <Solucoes />
      <Contato />
    </>
  );
}
