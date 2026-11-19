import React from 'react';
import { ShoppingBag, MessageSquare, Phone } from 'lucide-react';
import { STORE_INFO } from '../data/catalog';

interface HeaderProps {
  basketCount: number;
  onOpenBasket: () => void;
  onOpenAssistant: () => void;
  lang: 'sw' | 'en';
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  basketCount,
  onOpenBasket,
  onOpenAssistant,
  lang,
  onToggleLang,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single Wordmark */}
          <a href="#" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-amber-700 transition-colors">
              M
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-neutral-900 font-display block leading-tight">
                MODESTA INVESTMENTS
              </span>
              <span className="text-xs text-neutral-500 font-medium tracking-wide">
                {lang === 'sw' ? 'Mbweni na Ubungo, Dar es Salaam' : 'Mbweni & Ubungo, Dar es Salaam'}
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
            <a href="#vifurushi" className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0">
              {lang === 'sw' ? 'Vifurushi 6' : '6 Packages'}
            </a>
            <a href="#katalogi" className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0">
              {lang === 'sw' ? 'Katalogi ya Bei' : 'Price Catalog'}
            </a>
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-1.5 hover:text-amber-700 transition-colors whitespace-nowrap shrink-0"
            >
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span>{lang === 'sw' ? 'Msaidizi wa AI' : 'AI Assistant'}</span>
            </button>
            <a href="#kanuni" className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0">
              {lang === 'sw' ? 'Usalama na Malipo' : 'Safety & Payments'}
            </a>
          </nav>

          {/* Zone 3: Primary Action & Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              title="Badili Lugha / Change Language"
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'sw' ? 'EN 🇬🇧' : 'SW 🇹🇿'}
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAssistant}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-800 bg-amber-100/80 hover:bg-amber-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-800" />
              <span>{lang === 'sw' ? 'Uliza Modesta' : 'Ask Modesta'}</span>
            </button>

            {/* Shopping Basket Trigger */}
            <button
              onClick={onOpenBasket}
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
              aria-label="View Shopping Basket"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'sw' ? 'Kikapu' : 'Basket'}</span>
              {basketCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold text-neutral-900 bg-amber-400 rounded-full tabular-nums">
                  {basketCount}
                </span>
              )}
            </button>

            {/* WhatsApp Direct Link */}
            <a
              href={`https://wa.me/${STORE_INFO.phone_whatsapp.replace('+', '')}?text=${encodeURIComponent(
                lang === 'sw' ? 'Habari MODESTA INVESTMENTS, nina swali kuhusu bidhaa.' : 'Hello MODESTA INVESTMENTS, I have an inquiry about store items.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors"
              title="WhatsApp Duka"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
