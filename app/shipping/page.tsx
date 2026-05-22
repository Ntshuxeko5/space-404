import React from 'react';

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif text-luxury-brown mb-4 uppercase tracking-widest">Global Logistics</h1>
        <div className="w-12 h-1 bg-luxury-red mx-auto"></div>
      </div>

      <div className="space-y-12 text-luxury-brown/80 leading-relaxed font-light">
        <section>
          <h2 className="text-xl font-serif text-luxury-brown mb-4 uppercase tracking-widest">Transit Protocol</h2>
          <p>
            All acquisitions from SPACE 404 are dispatched from our centralized logistics hubs. We partner with premium couriers (DHL Express, FedEx) to ensure secure and efficient delivery of your pieces.
          </p>
        </section>

        <section className="bg-luxury-cream/5 p-10 border border-luxury-brown/10">
          <h2 className="text-xl font-serif text-luxury-brown mb-6 uppercase tracking-widest text-center">Delivery Estimates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-brown mb-2">Domestic</h3>
              <p className="text-sm">2 - 4 Business Days</p>
            </div>
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-brown mb-2">International</h3>
              <p className="text-sm">5 - 9 Business Days</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-serif text-luxury-brown mb-4 uppercase tracking-widest">Customs & Duties</h2>
          <p>
            For international acquisitions, import duties and taxes are the responsibility of the client. These are determined by the destination country's customs authority and must be settled upon arrival.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-luxury-brown mb-4 uppercase tracking-widest">Insurance</h2>
          <p>
            Every shipment is fully insured against loss or damage during transit until the point of delivery. A signature is required for all high-value manifests.
          </p>
        </section>
      </div>
    </div>
  );
}
