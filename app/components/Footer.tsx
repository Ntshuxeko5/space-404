import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-luxury-brown text-luxury-cream mt-auto border-t border-luxury-cream/10">
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2">
            <h3 className="text-xl font-serif font-bold mb-8 uppercase tracking-[0.2em]">SPACE 404</h3>
            <p className="text-luxury-cream/60 leading-relaxed font-light max-w-sm">
              Archiving the future of urban identity. Every piece is a digital artifact, meticulously crafted for the modern visionary.
            </p>
          </div>
          
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8 text-luxury-red">Concierge</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-luxury-cream/50 hover:text-luxury-cream transition-colors uppercase text-[9px] tracking-[0.2em]">The Vision</Link>
              </li>
              <li>
                <Link href="/contact" className="text-luxury-cream/50 hover:text-luxury-cream transition-colors uppercase text-[9px] tracking-[0.2em]">Contact</Link>
              </li>
              <li>
                <Link href="/shipping" className="text-luxury-cream/50 hover:text-luxury-cream transition-colors uppercase text-[9px] tracking-[0.2em]">Shipping Info</Link>
              </li>
              <li>
                <Link href="/returns" className="text-luxury-cream/50 hover:text-luxury-cream transition-colors uppercase text-[9px] tracking-[0.2em]">Returns Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8 text-luxury-red">Network</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-luxury-cream/50 hover:text-luxury-cream transition-colors uppercase text-[9px] tracking-[0.2em]">Instagram</a>
              </li>
              <li>
                <a href="#" className="text-luxury-cream/50 hover:text-luxury-cream transition-colors uppercase text-[9px] tracking-[0.2em]">Twitter / X</a>
              </li>
              <li>
                <a href="#" className="text-luxury-cream/50 hover:text-luxury-cream transition-colors uppercase text-[9px] tracking-[0.2em]">Discord</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-20 pt-10 border-t border-luxury-cream/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-luxury-cream/30 text-[9px] uppercase tracking-[0.3em]">&copy; {new Date().getFullYear()} SPACE 404. Identity Secured.</p>
          
          <div className="flex items-center gap-8">
            <Link href="/admin/login" className="text-luxury-cream/20 hover:text-luxury-cream/50 transition-colors text-[9px] uppercase tracking-[0.3em]">
              Vault Access
            </Link>
            <p className="text-luxury-cream/20 text-[9px] uppercase tracking-[0.3em]">Built for the future</p>
          </div>
        </div>
      </div>
    </footer>
  );
}