import { Mail, Phone } from "lucide-react";
import { siInstagram, siWhatsapp } from "simple-icons/icons";

type SimpleIconData = {
  title: string;
  path: string;
};

function SimpleIcon({
  icon,
  className,
}: {
  icon: SimpleIconData;
  className?: string;
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer
      id="site-footer"
      className="bg-graphite text-on-graphite pt-8 pb-6"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-4 mb-4">

          
         
          {/* Contato */}
          <div id="contato" className="text-center">
            <h4 className="text-lg leading-7 font-semibold mb-4">Entre em contato conosco:</h4>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-center sm:justify-center gap-y-3 sm:gap-x-6 text-sm">
              <a
                href="https://wa.me/554999159142"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 whitespace-nowrap rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                aria-label="Abrir WhatsApp para (55) 49 99159142"
              >
                <SimpleIcon icon={siWhatsapp} className="h-4 w-4 shrink-0 text-current" />
                <span className="font-semibold transition-colors group-hover:text-accent">WhatsApp:</span>
                <span>(55) 49 99159142</span>
              </a>
              <a
                href="tel:+554999159142"
                className="group flex items-center justify-center gap-2 whitespace-nowrap rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                aria-label="Ligar para (55) 49 99159142"
              >
                <Phone className="h-4 w-4 shrink-0 text-current" aria-hidden="true" />
                <span className="font-semibold transition-colors group-hover:text-accent">Telefone:</span>
                <span>(55) 49 99159142</span>
              </a>
              <a
                href="https://www.instagram.com/formwerklages/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 whitespace-nowrap rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                aria-label="Abrir Instagram da FormWerk"
              >
                <SimpleIcon icon={siInstagram} className="h-4 w-4 shrink-0 text-current" />
                <span className="font-semibold transition-colors group-hover:text-accent">Instagram:</span>
                <span>@formwerklages</span>
              </a>
              <a
                href="mailto:formwerklages@gmail.com"
                className="group flex items-center justify-center gap-2 whitespace-nowrap rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                aria-label="Enviar email para formwerklages@gmail.com"
              >
                <Mail className="h-4 w-4 shrink-0 text-current" aria-hidden="true" />
                <span className="font-semibold transition-colors group-hover:text-accent">Email:</span>
                <span>formwerklages@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-center text-xs leading-[18px] text-on-graphite-muted">
            &copy; 2026 FormWerk — CNPJ: 63.806.709/0001-07
            <br />Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
