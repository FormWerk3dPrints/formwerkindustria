import { Cog, Factory, Microscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import SmoothAnchor from "@/components/SmoothAnchor";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureCard from "@/components/ui/FeatureCard";
import { buttonClasses } from "@/components/ui/button";

/* ─── Seção Hero ─────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface-0">
      {/* Grade de pontos: a mesa de impressão (padrão técnico do design system) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
        style={{
          backgroundImage: "radial-gradient(var(--border-strong) 1px, transparent 1.5px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-40 text-center">
        <SectionHeading
          size="display"
          align="center"
          eyebrow="Manufatura Aditiva & Engenharia Aplicada"
          title={
            <>
              {/* Substitua pelo headline real da empresa */}
              Soluções industriais desenvolvidas<br className="hidden md:block" /> para transformar desafios em resultados
            </>
          }
          description={
            <>
              {/* Substitua pela descrição real */}
              A Formwerk Soluções Industriais utiliza manufatura aditiva,
              prototipagem rápida e desenvolvimento sob demanda para criar
              soluções técnicas personalizadas, reduzindo tempo, custos e
              limitações dos processos industriais tradicionais.
            </>
          }
        />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <SmoothAnchor href="#contato" className={buttonClasses("accent", "lg")}>
            Entre em contato
          </SmoothAnchor>
          <SmoothAnchor href="#solucoes" className={buttonClasses("secondary", "lg")}>
            Ver soluções
          </SmoothAnchor>
        </div>
      </div>
    </section>
  );
}

/* ─── Seção Sobre ────────────────────────────────────────────────────────── */
function Sobre() {
  return (
    <section id="sobre" className="bg-surface-0 py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="Quem somos"
          title="Engenharia, inovação e manufatura aditiva aplicadas à indústria"
          description={
            <>
              {/* Substitua pelo texto real da empresa */}
              A Formwerk Soluções Industriais nasceu com o propósito de utilizar
              a manufatura aditiva como ferramenta estratégica para resolver
              desafios reais da indústria. Desenvolvemos peças técnicas,
              protótipos funcionais, dispositivos personalizados e soluções sob
              demanda com foco em agilidade, precisão e redução de custos.
            </>
          }
        />
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
    <section id="solucoes" className="bg-surface-0 py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          className="mb-12"
          align="center"
          eyebrow="O que oferecemos"
          title="Soluções industriais inteligentes e personalizadas"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SOLUCOES.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Seção Contato ──────────────────────────────────────────────────────── */
function Contato() {
  return (
    <section id="contato" className="bg-surface-0 py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          className="mb-12"
          align="center"
          eyebrow="Fale conosco"
          title="Vamos trabalhar juntos?"
          description="Preencha o formulário e nossa equipe entrará em contato em breve. Suas informações são protegidas com criptografia de ponta."
        />
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
