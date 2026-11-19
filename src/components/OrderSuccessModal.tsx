import React from 'react';
import { CheckCircle2, AlertTriangle, Send, X, CreditCard, Phone } from 'lucide-react';
import { formatTZS, STORE_INFO } from '../data/catalog';

interface OrderSuccessModalProps {
  orderData: any;
  onClose: () => void;
  lang: 'sw' | 'en';
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  orderData,
  onClose,
  lang,
}) => {
  if (!orderData) return null;

  const { customer, items, known_items_estimated_subtotal_tzs, whatsapp_url, notes } = orderData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 font-display leading-tight">
              {lang === 'sw' ? 'Ombi la Oda Limeandaliwa!' : 'Order Request Prepared!'}
            </h3>
            <span className="text-xs text-neutral-500">
              {lang === 'sw' ? 'Kumbukumbu ya Awali • MODESTA INVESTMENTS' : 'Preliminary Request • MODESTA INVESTMENTS'}
            </span>
          </div>
        </div>

        {/* Safeguard Banner: Not Confirmed Yet */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mb-4 text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-snug">
            {lang === 'sw'
              ? 'Hii ni oda ya awali (haijathibitishwa). Timu ya MODESTA itathibitisha upatikanaji wa bidhaa stoo na gharama ya usafirishaji kuelekea eneo lako kabla ya malipo.'
              : 'This is a preliminary request (not yet confirmed). Staff must verify inventory availability and delivery fees before any payment is made.'}
          </p>
        </div>

        {/* Customer & Delivery Summary */}
        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 mb-4 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-neutral-500">{lang === 'sw' ? 'Mteja:' : 'Customer:'}</span>
            <span className="font-semibold text-neutral-900">{customer?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">{lang === 'sw' ? 'Simu:' : 'Phone:'}</span>
            <span className="font-semibold text-neutral-900 tabular-nums">{customer?.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">{lang === 'sw' ? 'Eneo la Delivery:' : 'Delivery Area:'}</span>
            <span className="font-semibold text-neutral-900">{customer?.area}</span>
          </div>
          {notes && (
            <div className="flex justify-between pt-1 border-t border-neutral-200/60">
              <span className="text-neutral-500">{lang === 'sw' ? 'Maelezo:' : 'Notes:'}</span>
              <span className="font-medium text-neutral-800 text-right">{notes}</span>
            </div>
          )}
        </div>

        {/* Itemized list */}
        <div className="max-h-36 overflow-y-auto space-y-1.5 mb-4 pr-1 text-xs">
          {items?.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between py-1 border-b border-neutral-100 last:border-0">
              <span className="text-neutral-800">
                {item.quantity}x {item.name}
              </span>
              <span className="font-semibold text-neutral-900 tabular-nums">
                {item.subtotal_tzs ? formatTZS(item.subtotal_tzs) : (lang === 'sw' ? 'Itathibitishwa' : 'Pending')}
              </span>
            </div>
          ))}
        </div>

        {/* Total & Lipa Namba */}
        <div className="flex items-baseline justify-between pt-3 border-t border-neutral-200 mb-5">
          <span className="text-xs font-semibold text-neutral-600">
            {lang === 'sw' ? 'Kadirio la Bidhaa:' : 'Estimated Items Subtotal:'}
          </span>
          <span className="text-lg font-extrabold text-neutral-900 tabular-nums">
            {formatTZS(known_items_estimated_subtotal_tzs || 0)}
          </span>
        </div>

        {/* Payment reminder */}
        <div className="p-3 bg-neutral-100/70 rounded-xl text-[11px] text-neutral-600 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-neutral-700" />
            <span>{STORE_INFO.payment.mobile_money}: <strong>{STORE_INFO.payment.lipa_namba}</strong></span>
          </div>
          <span className="text-neutral-500">MODESTA INVESTMENTS</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {whatsapp_url && (
            <a
              href={whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'sw' ? 'Tuma Moja kwa Moja WhatsApp' : 'Send to WhatsApp Now'}</span>
            </a>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-xl text-xs transition-colors"
          >
            {lang === 'sw' ? 'Funga Risiti' : 'Close Receipt'}
          </button>
        </div>
      </div>
    </div>
  );
};
