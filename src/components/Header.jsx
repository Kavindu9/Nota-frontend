// src/components/Header.jsx
'import client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0b0b0b]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/main" className="flex items-center gap-3">
          <span className="text-white font-serif text-2xl tracking-wider">NŌTA</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-300">
          <a href="#specifications" className="hover:text-white transition-colors">Specifications</a>
          <a href="#who-its-for" className="hover:text-white transition-colors">Who it's for</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#inside-the-box" className="hover:text-white transition-colors">Inside the box</a>
        </nav>

        <div className="flex items-center gap-4">
          <a 
            href="#order" 
            className="bg-white text-black px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-3 hover:bg-neutral-200 transition-all"
          >
            <span>Order Nota One</span>
            <span className="text-neutral-500 font-normal">|</span>
            <span className="font-semibold">$300</span>
          </a>
        </div>
      </div>
    </header>
  );
}