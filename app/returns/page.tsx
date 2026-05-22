import React from 'react';

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif text-luxury-brown mb-4 uppercase tracking-widest">Return Policy</h1>
        <div className="w-12 h-1 bg-luxury-red mx-auto"></div>
      </div>

      <div className="space-y-12 text-luxury-brown/80 leading-relaxed font-light">
        <section>
          <h2 className="text-xl font-serif text-luxury-brown mb-4 uppercase tracking-widest">The Policy</h2>
          <p>
            Due to the exclusive and limited nature of our drops, we operate on a strict return policy. Acquisitions can be returned for store credit or exchange within 7 days of delivery, provided the pieces are in original, unworn condition with all tags and archival packaging intact.
          </p>
        </section>

        <section className="bg-luxury-red/5 p-10 border border-luxury-red/10">
          <h2 className="text-xl font-serif text-luxury-brown mb-4 uppercase tracking-widest">Non-Returnable Items</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Final Sale / Archive Items</li>
            <li>Limited Drop Accessories</li>
            <li>Intimate Wear</li>
            <li>Items without original security tags</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-serif text-luxury-brown mb-4 uppercase tracking-widest">Return Process</h2>
          <ol className="list-decimal pl-5 space-y-4 text-sm">
            <li>Contact <span className="font-bold">concierge@space404.identity</span> to request a return authorization.</li>
            <li>Once approved, you will receive a return shipping label.</li>
            <li>Dispatch the piece in its original archival packaging.</li>
            <li>Upon inspection and verification, credit will be issued within 5 business days.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-serif text-luxury-brown mb-4 uppercase tracking-widest">Exchanges</h2>
          <p>
            Exchanges are subject to availability. If the desired size is unavailable due to the limited nature of the drop, store credit will be issued.
          </p>
        </section>
      </div>
    </div>
  );
}
