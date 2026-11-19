import React from 'react';
import { ShieldCheck, Phone, AlertCircle, FileCheck, CreditCard, Flame, Baby, Truck } from 'lucide-react';
import { STORE_INFO } from '../data/catalog';

interface StoreSafeguardsProps {
  lang: 'sw' | 'en';
}

export const StoreSafeguards: React.FC<StoreSafeguardsProps> = ({ lang }) => {
  const safeguards = [
    {
      icon: <FileCheck className="w-5 h-5 text-amber-700" />,
      title_sw: 'Bei Zilizothibitishwa',
      title_en: 'Transcribed Poster Pricing',
      desc_sw: 'Bei zote zimenukuliwa kutoka bango rasmi la duka na zinathibitishwa kabla ya malipo.',
      desc_en: 'All prices are transcribed from the physical store poster and confirmed prior to payment.',
    },
    {
      icon: <Truck className="w-5 h-5 text-emerald-700" />,
      title_sw: 'Delivery ya Uwazi (Mbweni & Ubungo)',
      title_en: 'Transparent Delivery Policy',
      desc_sw: 'Hakuna makisio ya uongo ya delivery. Eneo, nauli na muda vinathibitishwa na duka.',
      desc_en: 'No fabricated delivery fees or timelines. Coverage and fees are verified directly with staff.',
    },
    {
      icon: <Flame className="w-5 h-5 text-orange-600" />,
      title_sw: 'Tahadhari ya Mitungi ya Gesi',
      title_en: 'Gas Refill Safety Check',
      desc_sw: 'Kwa mitungi ya O-Gas, Oryx na Yang (6kg, 13kg, 29kg), thibitisha aina ya vali na stoo kabla ya kubeba.',
      desc_en: 'For O-Gas, Oryx, and Yang (6kg, 13kg, 29kg), valve compatibility must be confirmed with staff.',
    },
    {
      icon: <Baby className="w-5 h-5 text-pink-600" />,
      title_sw: 'Maziwa ya Mtoto (NAN)',
      title_en: 'Infant Nutrition Stage Check',
      desc_sw: 'Thibitisha hatua sahihi (NAN 1, 2, au 3) kulingana na umri wa mtoto na mshauri wa afya.',
      desc_en: 'Confirm the exact stage (NAN 1, 2, or 3) and suitability for your infant before dispatch.',
    },
    {
      icon: <CreditCard className="w-5 h-5 text-sky-700" />,
      title_sw: 'Lipa Namba Salama',
      title_en: 'Verified Vodacom Lipa Namba',
      desc_sw: 'Lipa Namba ni 51102080 (MODESTA INVESTMENTS). Hatutawahi kukuuliza PIN au OTP ya siri.',
      desc_en: 'Lipa Namba 51102080 (MODESTA INVESTMENTS). We never request customer PINs or OTPs.',
    },
    {
      icon: <Phone className="w-5 h-5 text-purple-700" />,
      title_sw: 'Usaidizi wa Haraka wa Binadamu',
      title_en: 'Instant Human Staff Escalation',
      desc_sw: 'Swali lolote au malalamiko yanapelekwa moja kwa moja kwa wafanyakazi wetu WhatsApp.',
      desc_en: 'Any custom inquiry, complaint, or dispute is directly routed to human store personnel.',
    },
  ];

  return (
    <section id="kanuni" className="py-16 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>{lang === 'sw' ? 'Miongozo na Usalama wa Wateja' : 'Customer Safeguards & Policy'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display tracking-tight">
            {lang === 'sw' ? 'Kanuni 7 za Uendeshaji za MODESTA' : 'Our 7 Operating Safeguards'}
          </h2>
          <p className="text-sm text-neutral-600 mt-2">
            {lang === 'sw'
              ? 'Tunajenga uaminifu kupitia taarifa sahihi, ulinzi wa fedha zako, na ukaguzi wa bidhaa nyeti.'
              : 'Built to safeguard customer trust with verified pricing, zero payment secrets, and staff oversight.'}
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeguards.map((s, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-3.5">
                {s.icon}
              </div>
              <h3 className="text-sm font-bold text-neutral-900 font-display mb-1.5">
                {lang === 'sw' ? s.title_sw : s.title_en}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {lang === 'sw' ? s.desc_sw : s.desc_en}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Banner */}
        <div className="mt-10 p-6 rounded-2xl bg-white border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              M
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900 font-display">
                MODESTA INVESTMENTS — {STORE_INFO.tagline}
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                {lang === 'sw' ? 'Simu & WhatsApp:' : 'Phone & WhatsApp:'} {STORE_INFO.phone_display} • Vodacom Lipa Namba: {STORE_INFO.payment.lipa_namba}
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${STORE_INFO.phone_whatsapp.replace('+', '')}?text=${encodeURIComponent(
              lang === 'sw' ? 'Habari MODESTA INVESTMENTS, nina swali kuhusu oda yangu.' : 'Hello MODESTA INVESTMENTS, I have an inquiry about my order.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all whitespace-nowrap"
          >
            <Phone className="w-4 h-4" />
            <span>{lang === 'sw' ? 'Wasiliana Nasi WhatsApp' : 'Contact Store Staff'}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
