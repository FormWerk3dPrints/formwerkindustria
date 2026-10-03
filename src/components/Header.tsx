import Link from 'next/link';
import Image from 'next/image';
import SmoothAnchor from './SmoothAnchor';

const LINKS = [
  { label: 'Soluções', href: '#solucoes' },
  { label: 'Contato', href: '#site-footer' },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-graphite border-b-2 border-accent shadow-md">
      <nav className="container mx-auto px-6 py-5 flex items-center justify-between gap-6">
        <Link href="/" className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring">
          <Image
            src="/logo_formwerk_branca.svg"
            alt="FormWerk Soluções Industriais"
            width={300}
            height={64}
            priority
            unoptimized
            className="h-16 w-auto"
          />
        </Link>
        <div className="flex items-center gap-6">
          {LINKS.map((link) => (
            <SmoothAnchor
              key={link.href}
              href={link.href}
              className="text-on-graphite font-semibold text-base tracking-wide border-b-2 border-transparent py-0.5 transition-colors duration-200 hover:border-accent focus-visible:border-accent focus-visible:outline-none"
            >
              {link.label}
            </SmoothAnchor>
          ))}
        </div>
      </nav>
    </header>
  );
}
