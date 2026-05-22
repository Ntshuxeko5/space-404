import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="bg-luxury-brown text-luxury-cream border-b border-luxury-cream/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold tracking-wider hover:text-luxury-cream/90 transition-colors">
              SPACE 404
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="hover:text-luxury-cream/90 px-3 py-2 text-sm uppercase tracking-widest transition-colors">
                Home
              </Link>
              <Link href="/products" className="hover:text-luxury-cream/90 px-3 py-2 text-sm uppercase tracking-widest transition-colors">
                Collection
              </Link>
              <Link href="/categories" className="hover:text-luxury-cream/90 px-3 py-2 text-sm uppercase tracking-widest transition-colors">
                Categories
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link href="/cart" className="p-2 hover:text-luxury-cream/90 transition-colors">
              <ShoppingCartIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}