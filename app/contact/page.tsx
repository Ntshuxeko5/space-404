import React from 'react';
import { EnvelopeIcon, MapPinIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif text-luxury-brown mb-4 uppercase tracking-widest">Connect with the Vault</h1>
        <div className="w-12 h-1 bg-luxury-red mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div className="p-8 border border-luxury-brown/10 bg-luxury-cream/5">
          <EnvelopeIcon className="h-8 w-8 mx-auto text-luxury-red mb-6" />
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-brown mb-4">Direct Inquiry</h3>
          <p className="text-xs text-luxury-brown/60">concierge@space404.identity</p>
        </div>

        <div className="p-8 border border-luxury-brown/10 bg-luxury-cream/5">
          <ChatBubbleLeftRightIcon className="h-8 w-8 mx-auto text-luxury-red mb-6" />
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-brown mb-4">Client Support</h3>
          <p className="text-xs text-luxury-brown/60">Live assistance available<br />Mon - Fri, 9am - 6pm EST</p>
        </div>

        <div className="p-8 border border-luxury-brown/10 bg-luxury-cream/5">
          <MapPinIcon className="h-8 w-8 mx-auto text-luxury-red mb-6" />
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-brown mb-4">Studio</h3>
          <p className="text-xs text-luxury-brown/60">Digital-First Operation<br />Distributed Globally</p>
        </div>
      </div>

      <div className="mt-20 max-w-2xl mx-auto border border-luxury-brown/10 p-10 bg-white shadow-2xl shadow-luxury-brown/5">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[9px] uppercase tracking-[0.2em] text-luxury-brown/40 mb-2">Name</label>
              <input type="text" className="w-full bg-luxury-cream/5 border border-luxury-brown/10 p-4 text-xs outline-none focus:border-luxury-red transition-colors" />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-[0.2em] text-luxury-brown/40 mb-2">Identity (Email)</label>
              <input type="email" className="w-full bg-luxury-cream/5 border border-luxury-brown/10 p-4 text-xs outline-none focus:border-luxury-red transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-luxury-brown/40 mb-2">Manifest (Message)</label>
            <textarea rows={6} className="w-full bg-luxury-cream/5 border border-luxury-brown/10 p-4 text-xs outline-none focus:border-luxury-red transition-colors resize-none"></textarea>
          </div>
          <button type="button" className="w-full bg-luxury-brown text-luxury-cream py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-luxury-red transition-all duration-300 shadow-xl shadow-luxury-brown/10">
            Dispatch Message
          </button>
        </form>
      </div>
    </div>
  );
}
