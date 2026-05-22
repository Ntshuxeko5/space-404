import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative">
      {/* Hero section */}
      <div className="bg-luxury-brown text-luxury-cream min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-pattern.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            ELEVATE YOUR<br />IDENTITY
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-luxury-cream/80 tracking-wide max-w-2xl mx-auto">
            Discover exclusive streetwear that sets you apart. Each piece is crafted for those who dare to be extraordinary.
          </p>
          <Link
            href="/products"
            className="inline-block bg-luxury-red text-luxury-cream px-12 py-4 text-lg font-semibold hover:bg-luxury-red-dark transition-colors uppercase tracking-wider"
          >
            Explore Collection
          </Link>
        </div>
      </div>

      {/* Featured categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-bold text-center mb-16 uppercase tracking-wider text-luxury-brown">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { name: 'Limited Edition', description: 'Exclusive drops that define rarity' },
            { name: 'Statement Pieces', description: 'Bold designs for the fearless' },
            { name: 'Essential Luxury', description: 'Elevated everyday wear' }
          ].map((category) => (
            <div
              key={category.name}
              className="group relative h-96 bg-luxury-brown/5 overflow-hidden border border-luxury-brown/10 hover:border-luxury-red transition-colors duration-300"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-2xl font-semibold mb-4 text-luxury-brown uppercase tracking-wider">{category.name}</h3>
                <p className="text-luxury-brown/70 mb-6">{category.description}</p>
                <div className="w-12 h-[1px] bg-luxury-red transform origin-left group-hover:scale-x-150 transition-transform"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features section */}
      <div className="bg-luxury-cream/20 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div className="p-8">
              <h3 className="text-xl font-semibold mb-4 text-luxury-brown uppercase tracking-wider">Limited Editions</h3>
              <p className="text-luxury-brown/70">Each piece is part of an exclusive collection</p>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-semibold mb-4 text-luxury-brown uppercase tracking-wider">Premium Quality</h3>
              <p className="text-luxury-brown/70">Crafted with exceptional materials</p>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-semibold mb-4 text-luxury-brown uppercase tracking-wider">Global Shipping</h3>
              <p className="text-luxury-brown/70">Delivered to fashion pioneers worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
