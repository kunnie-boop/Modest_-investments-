import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Send,
  AlertCircle,
  CreditCard,
  MapPin,
  Phone,
  User,
  FileText,
} from 'lucide-react';
import { STORE_INFO, formatTZS, buildWhatsAppOrderLink } from '../data/catalog';

export interface BasketItem {
  name: string;
  price: number;
  quantity: number;
  safetyNote?: string;
}

interface BasketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: BasketItem[];
  onUpdateQuantity: (name: string, delta: number) => void;
  onRemoveItem: (name: string) => void;
  onClearBasket: () => void;
  onOrderPrepared: (orderData: any) => void;
  lang: 'sw' | 'en';
}

export const BasketDrawer: React.FC<BasketDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearBasket,
  onOrderPrepared,
  lang,
}) => {
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const estimatedSubtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const validateForm = (): boolean => {
    if (!customerName.trim()) {
      setFormError(lang === 'sw' ? 'Tafadhali weka jina lako.' : 'Please enter your name.');
      return false;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setFormError(
        lang === 'sw'
          ? 'Tafadhali weka namba sahihi ya simu (mfano: 0759755280 au +255...).'
          : 'Please enter a valid phone number (e.g., +255...).'
      );
      return false;
    }
    if (!area.trim()) {
      setFormError(
        lang === 'sw'
          ? 'Tafadhali weka eneo lako (mfano: Ubungo, Mbweni, Tegeta).'
          : 'Please enter your delivery area (e.g., Ubungo, Mbweni).'
      );
      return false;
    }
    setFormError(null);
    return true;
  };

  // Direct WhatsApp dispatch
  const handleSendToWhatsApp = () => {
    if (!validateForm()) return;

    const whatsappUrl = buildWhatsAppOrderLink({
      customerName,
      phone,
      area,
      items: items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.price,
      })),
      estimatedTotal: estimatedSubtotal,
      notes: notes.trim() || undefined,
    });

    window.open(whatsappUrl, '_blank');
  };

  // API Order Preparation
  const handlePrepareOrderAPI = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch('/api/order-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          phone,
          area,
          items: items.map((i) => ({
            name: i.name,
            quantity: i.quantity,
          })),
          notes: notes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Hitilafu kwenye maandalizi ya ombi.');
      }

      const orderData = await res.json();
      onOrderPrepared(orderData);
    } catch (err: any) {
      setFormError(
        lang === 'sw'
          ? 'Haikuweza kukamilisha ombi kwenye server. Unaweza kutumia kitufe cha WhatsApp moja kwa moja.'
          : 'Failed to prepare order request. Please use the direct WhatsApp button.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col">
          {/* Drawer Top */}
          <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-800" />
              <h2 className="text-base font-bold text-neutral-900 font-display">
                {lang === 'sw' ? 'Kikapu cha Makadirio' : 'Estimate Basket'}
              </h2>
              <span className="text-xs text-neutral-500 font-medium tabular-nums">
                ({items.length} {lang === 'sw' ? 'aina' : 'items'})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={onClearBasket}
                  title={lang === 'sw' ? 'Ondoa Zote' : 'Clear all'}
                  className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-neutral-800">
                  {lang === 'sw' ? 'Kikapu chako kiko tupu' : 'Your basket is currently empty'}
                </p>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                  {lang === 'sw'
                    ? 'Chagua bidhaa kutoka kwenye katalogi au uliza Modesta AI ikuandalie.'
                    : 'Add items from the store catalog or ask Modesta AI to assist you.'}
                </p>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                    {lang === 'sw' ? 'Bidhaa Zilizochaguliwa' : 'Selected Items'}
                  </span>

                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-neutral-900 truncate">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-neutral-500 tabular-nums">
                            {formatTZS(item.price)} kila kimoja
                          </span>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.name)}
                          className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.safetyNote && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{item.safetyNote}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 text-xs">
                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.name, -1)}
                            className="p-1 text-neutral-600 hover:text-neutral-900 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-neutral-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.name, 1)}
                            className="p-1 text-neutral-600 hover:text-neutral-900 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-bold text-neutral-900 tabular-nums">
                          {formatTZS(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal Calculation Box */}
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                  <div className="flex items-center justify-between text-xs text-amber-900 mb-1">
                    <span className="font-medium">
                      {lang === 'sw' ? 'Kadirio la Bidhaa (Subtotal):' : 'Estimated Items Subtotal:'}
                    </span>
                    <span className="text-base font-extrabold text-neutral-900 tabular-nums">
                      {formatTZS(estimatedSubtotal)}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-800 leading-snug">
                    <p>
                      * {lang === 'sw'
                        ? 'Gharama ya delivery itathibitishwa na timu kulingana na eneo lako (Mbweni, Ubungo, n.k.).'
                        : 'Delivery fee will be confirmed by store staff based on your specific location.'}
                    </p>
                  </div>
                </div>

                {/* Order Details Form */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                    {lang === 'sw' ? 'Taarifa za Mteja (Kwa ajili ya Oda)' : 'Customer Details'}
                  </span>

                  {formError && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      {lang === 'sw' ? 'Jina Kamili *' : 'Full Name *'}
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={lang === 'sw' ? 'Mfano: Asha Juma' : 'e.g. Asha Juma'}
                        className="w-full pl-8 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      {lang === 'sw' ? 'Namba ya Simu / WhatsApp *' : 'Phone / WhatsApp Number *'}
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+255..."
                        className="w-full pl-8 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      {lang === 'sw' ? 'Eneo la Delivery (Mtaa / Kata) *' : 'Delivery Area *'}
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder={lang === 'sw' ? 'Mfano: Ubungo Riverside, Mbweni JKT...' : 'e.g. Ubungo, Mbweni...'}
                        className="w-full pl-8 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      {lang === 'sw' ? 'Maelezo ya Ziada (Hiari)' : 'Special Notes (Optional)'}
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      placeholder={
                        lang === 'sw'
                          ? 'Mfano: Naomba delivery kabla ya mchana, au thibitisha vali ya gesi.'
                          : 'e.g. Please deliver before noon, verify gas valve compatibility.'
                      }
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                    />
                  </div>

                  {/* Payment Info Callout */}
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                      <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                      <span>{STORE_INFO.payment.mobile_money}: {STORE_INFO.payment.lipa_namba}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Jina la Akaunti: <strong>{STORE_INFO.payment.account_name}</strong>. Usitume malipo yoyote mpaka duka lithibitishe upatikanaji wa bidhaa na oda yako.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Actions Bottom Bar */}
          {items.length > 0 && (
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-2">
              <button
                onClick={handleSendToWhatsApp}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                <span>
                  {lang === 'sw' ? 'Tuma Oda Moja kwa Moja WhatsApp' : 'Dispatch Order to WhatsApp'}
                </span>
              </button>

              <button
                onClick={handlePrepareOrderAPI}
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                <span>
                  {submitting
                    ? (lang === 'sw' ? 'Inaandaa...' : 'Preparing...')
                    : (lang === 'sw' ? 'Andaa Risiti ya Ombi (API)' : 'Prepare Official Request (API)')}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
