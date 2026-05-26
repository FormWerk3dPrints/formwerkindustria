import Link from 'next/link';
import Image from 'next/image';
import SmoothAnchor from './SmoothAnchor';

export default function Header() {
  return (
    <header className="shadow-md fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: '#808080' }}>
      <nav className="container mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo_formwerk_branca.svg"
            alt="FormWerk"
            width={300}
            height={64}
            priority
            unoptimized
            className="h-16 w-auto"
          />
        </Link>
        <SmoothAnchor
          href="#site-footer"
          className="text-[#fff8f2] font-semibold text-base tracking-wide transition-transform duration-200 hover:scale-110 inline-block"
        >
          Contato
        </SmoothAnchor>
      </nav>
    </header>
  );
}
