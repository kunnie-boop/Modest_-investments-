import React from 'react';
import { STORE_INFO } from '../data/catalog';

interface FooterProps {
  lang: 'sw' | 'en';
  onOpenAssistant: () => void;
  onOpenBasket: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenAssistant,
  onOpenBasket,
}) => {
  return (
    <footer className="bg-white border-t border-neutral-200 py-10 text-neutral-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-100">
          <div>
            <span className="text-base font-bold text-neutral-900 font-display block">
              MODESTA INVESTMENTS
            </span>
            <p className="text-xs text-neutral-500 mt-0.5">
              {STORE_INFO.tagline} · {STORE_INFO.location_note}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-neutral-600">
            <a href="#vifurushi" className="hover:text-neutral-900 transition-colors">
              {lang === 'sw' ? 'Vifurushi' : 'Packages'}
            </a>
            <a href="#katalogi" className="hover:text-neutral-900 transition-colors">
              {lang === 'sw' ? 'Katalogi' : 'Catalog'}
            </a>
            <button
              onClick={onOpenAssistant}
              className="hover:text-neutral-900 transition-colors"
            >
              {lang === 'sw' ? 'Modesta AI' : 'Modesta AI'}
            </button>
            <button
              onClick={onOpenBasket}
              className="hover:text-neutral-900 transition-colors"
            >
              {lang === 'sw' ? 'Kikapu' : 'Basket'}
            </button>
            <a href="#kanuni" className="hover:text-neutral-900 transition-colors">
              {lang === 'sw' ? 'Miongozo' : 'Policies'}
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-3">
          <p>
            © {new Date().getFullYear()} MODESTA INVESTMENTS. {lang === 'sw' ? 'Haki zote zimehifadhiwa.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-2">
            <span>Vodacom Lipa Namba: {STORE_INFO.payment.lipa_namba}</span>
            <span aria-hidden="true">·</span>
            <span>WhatsApp: {STORE_INFO.phone_display}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
