import React from 'react';
import { MessageSquare, ShoppingBag, ShieldCheck, MapPin, CreditCard, Sparkles } from 'lucide-react';
import { STORE_INFO } from '../data/catalog';

interface HeroProps {
  lang: 'sw' | 'en';
  onOpenAssistant: (initialPrompt?: string) => void;
  onExploreCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onOpenAssistant,
  onExploreCatalog,
}) => {
  const quickQuestions = lang === 'sw' ? [
    'Bei ya Mchele 5kg na Mafuta 5L',
    'Kifurushi cha Alfajiri kina nini?',
    'Bei ya Gesi 6kg na 13kg refill',
    'Je, mnafanya delivery Ubungo?',
  ] : [
    'Price of 5kg Rice and 5L Oil',
    "What's in the Breakfast Package?",
    'Gas refill price for 6kg & 13kg',
    'Do you deliver to Ubungo?',
  ];

  return (
    <div className="relative bg-white border-b border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Store Story & AI Launcher */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Quiet metadata line */}
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide uppercase mb-3">
              <span>{STORE_INFO.name}</span>
              <span aria-hidden="true">·</span>
              <span>{lang === 'sw' ? 'Duka Rasmi la Vyombo na Vyakula' : 'Official Groceries & Home Store'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-500 font-normal">Dar es Salaam</span>
            </div>

            {/* Headline with text-wrap: balance */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight font-display leading-[1.12] mb-4 text-balance">
              {lang === 'sw'
                ? 'Modesta kwa kila mahitaji yako ya nyumbani'
                : 'Modesta for all your daily home & grocery needs'}
            </h1>

            {/* Subtitle / Value proposition */}
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed mb-6 max-w-2xl">
              {lang === 'sw'
                ? 'Katalogi kamili ya vyakula, gesi, mahitaji ya mtoto na usafi. Msaidizi wetu wa AI anakusaidia kuhesabu makadirio ya kikapu chako na kuagiza moja kwa moja WhatsApp.'
                : 'Complete catalog of grains, cooking gas, baby care, and home essentials. Our bilingual AI assistant helps estimate basket totals and dispatches confirmed orders to WhatsApp.'}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-7">
              <button
                onClick={() => onOpenAssistant()}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl transition-all shadow-sm hover:shadow whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{lang === 'sw' ? 'Anza Maongezi na Modesta AI' : 'Chat with Modesta AI'}</span>
              </button>

              <button
                onClick={onExploreCatalog}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 rounded-xl transition-colors whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4 text-neutral-700" />
                <span>{lang === 'sw' ? 'Tazama Bidhaa na Bei' : 'Browse Items & Prices'}</span>
              </button>
            </div>

            {/* Quick Ask Chips */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                {lang === 'sw' ? 'Mifano ya maswali ya haraka:' : 'Quick questions to ask:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => onOpenAssistant(q)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100/90 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-200 border border-neutral-200 rounded-lg transition-colors text-left"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Storefront Visual */}
          <div className="lg:col-span-5 relative flex items-center">
            <div className="relative w-full h-[340px] sm:h-[420px] rounded-2xl overflow-hidden border border-neutral-200 shadow-lg">
              <img
                src="/src/assets/images/hero_modesta_storefront_1793311006875.jpg"
                alt="Modesta Investments Storefront in Dar es Salaam"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
              
              {/* Bottom Scrim Content with Real Details */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-1">
                  <span>MODESTA INVESTMENTS</span>
                  <span>DAR ES SALAAM</span>
                </div>
                <p className="text-sm font-medium text-neutral-100 leading-snug">
                  {lang === 'sw' 
                    ? 'Bei sahihi zilizothibitishwa kutoka bango rasmi la duka. Delivery inapatikana Mbweni na Ubungo.'
                    : 'Transcribed catalog from store price board. Serving Mbweni, Ubungo, and greater Dar es Salaam.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column Trust & Safeguard Bar Below Hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-neutral-200">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-2 mb-1 text-amber-700">
              <CreditCard className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wide">Vodacom Lipa Namba</span>
            </div>
            <p className="text-sm font-extrabold text-neutral-900 tabular-nums">51102080</p>
            <span className="text-xs text-neutral-500">MODESTA INVESTMENTS</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-2 mb-1 text-emerald-700">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wide">Delivery Advertised</span>
            </div>
            <p className="text-sm font-semibold text-neutral-900">Mbweni & Ubungo</p>
            <span className="text-xs text-neutral-500">{lang === 'sw' ? 'Gharama inathibitishwa na duka' : 'Fee confirmed by staff'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-2 mb-1 text-sky-700">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wide">{lang === 'sw' ? 'Hakuna Siri za Malipo' : 'No Payment Secrets'}</span>
            </div>
            <p className="text-sm font-semibold text-neutral-900">{lang === 'sw' ? 'Hatutaki PIN au OTP' : 'No PIN or OTP needed'}</p>
            <span className="text-xs text-neutral-500">{lang === 'sw' ? 'Usalama wa 100%' : '100% Safe Verification'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-2 mb-1 text-amber-700">
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wide">WhatsApp Support</span>
            </div>
            <p className="text-sm font-bold text-neutral-900 tabular-nums">{STORE_INFO.phone_display}</p>
            <span className="text-xs text-neutral-500">{lang === 'sw' ? 'Bilingual Swahili / English' : 'Bilingual Swahili / English'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
