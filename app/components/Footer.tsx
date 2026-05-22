export default function Footer() {
  return (
    <footer className="bg-luxury-brown text-luxury-cream mt-auto border-t border-luxury-cream/10">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider">About Space 404</h3>
            <p className="text-luxury-cream/80 leading-relaxed">
              Elevate your style beyond the ordinary. Space 404 creates unique, high-value streetwear for those who dare to stand out.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <a href="/about" className="text-luxury-cream/80 hover:text-luxury-cream transition-colors uppercase text-sm tracking-wide">About Us</a>
              </li>
              <li>
                <a href="/contact" className="text-luxury-cream/80 hover:text-luxury-cream transition-colors uppercase text-sm tracking-wide">Contact</a>
              </li>
              <li>
                <a href="/shipping" className="text-luxury-cream/80 hover:text-luxury-cream transition-colors uppercase text-sm tracking-wide">Shipping Info</a>
              </li>
              <li>
                <a href="/returns" className="text-luxury-cream/80 hover:text-luxury-cream transition-colors uppercase text-sm tracking-wide">Returns</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider">Connect With Us</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-luxury-cream/80 hover:text-luxury-cream transition-colors uppercase text-sm tracking-wide">Instagram</a>
              </li>
              <li>
                <a href="#" className="text-luxury-cream/80 hover:text-luxury-cream transition-colors uppercase text-sm tracking-wide">Twitter</a>
              </li>
              <li>
                <a href="#" className="text-luxury-cream/80 hover:text-luxury-cream transition-colors uppercase text-sm tracking-wide">Facebook</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-luxury-cream/10 text-center">
          <p className="text-luxury-cream/80 text-sm tracking-wider">&copy; {new Date().getFullYear()} SPACE 404. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}