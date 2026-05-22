import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif text-luxury-brown mb-4 uppercase tracking-widest">About Space 404</h1>
        <div className="w-12 h-1 bg-luxury-red mx-auto"></div>
      </div>
      
      <div className="space-y-12 text-luxury-brown/80 leading-relaxed font-light">
        <section>
          <h2 className="text-xl font-serif text-luxury-brown mb-4 uppercase tracking-widest">The Vision</h2>
          <p>
            Born from the intersection of architectural precision and urban chaos, SPACE 404 is more than a brand—it is a digital-first vault for the extraordinary. We exist for those who find beauty in the unconventional and luxury in the exclusive.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-luxury-brown mb-4 uppercase tracking-widest">Craftsmanship</h2>
          <p>
            Every piece in our collection is meticulously crafted with high-grade materials sourced globally. We prioritize silhouettes that challenge the status quo, ensuring each garment is a statement of identity and intent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-luxury-brown mb-4 uppercase tracking-widest">The Vault</h2>
          <p>
            We operate on a "drop" philosophy. Items are released in limited quantities, ensuring that once a piece enters your collection, it remains a rare artifact of style. We do not mass-produce; we curate.
          </p>
        </section>
      </div>
    </div>
  );
}
