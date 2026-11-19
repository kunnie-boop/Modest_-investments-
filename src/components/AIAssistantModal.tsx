import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Phone,
  ShieldAlert,
  Plus,
  Check,
  Code,
  RotateCcw,
} from 'lucide-react';
import { STORE_INFO, formatTZS } from '../data/catalog';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  mode?: string;
  suggestedItems?: { name: string; price_tzs: number }[];
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'sw' | 'en';
  initialPrompt?: string;
  onAddItem: (name: string, price: number) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialPrompt,
  onAddItem,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text:
        lang === 'sw'
          ? 'Habari! Mimi ni Modesta, msaidizi wako rasmi wa duka la MODESTA INVESTMENTS hapa Dar es Salaam (Mbweni & Ubungo). Ninaweza kukusaidia kuangalia bei za katalogi, vifurushi 6, kukadiria gharama za kikapu chako, na kukuandalia ombi la oda kwa ajili ya WhatsApp. Je, nikusaidie nini leo?'
          : "Hello! I am Modesta, your official store assistant for MODESTA INVESTMENTS in Dar es Salaam (Mbweni & Ubungo). I can help you look up catalog prices, discover our 6 bundles, calculate estimated basket totals, and prepare an order request for WhatsApp. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPromptInspector, setShowPromptInspector] = useState<boolean>(false);
  const [addedItemNames, setAddedItemNames] = useState<{ [name: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle initial prompt from props
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const handleSendMessage = async (msgText?: string) => {
    const textToSend = (msgText || input).trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-5).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error('API server returned error');
      }

      const data = await res.json();
      const botMsg: Message = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || (lang === 'sw' ? 'Samahani, jaribu tena au wasiliana nasi WhatsApp.' : 'Sorry, please try again or contact us on WhatsApp.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: data.mode,
        suggestedItems: data.suggested_items,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text:
          lang === 'sw'
            ? 'Kuna hitilafu ya mtandao, lakini unaweza kuwasiliana na timu ya duka moja kwa moja kupitia WhatsApp: +255 759 755 280.'
            : 'Temporary connection delay. You can always message our staff directly on WhatsApp: +255 759 755 280.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggested = (item: { name: string; price_tzs: number }) => {
    onAddItem(item.name, item.price_tzs);
    setAddedItemNames((prev) => ({ ...prev, [item.name]: true }));
    setTimeout(() => {
      setAddedItemNames((prev) => ({ ...prev, [item.name]: false }));
    }, 1800);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        sender: 'assistant',
        text:
          lang === 'sw'
            ? 'Maongezi yamewekwa upya. Je, ungependa kuuliza kuhusu bei, vifurushi, au kuanzisha oda?'
            : 'Conversation reset. Would you like to check prices, bundle contents, or start an order request?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col h-[90vh] max-h-[750px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-2xs">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-900 font-display">
                  Modesta AI Assistant
                </h3>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {lang === 'sw'
                  ? 'Msaidizi Rasmi wa MODESTA INVESTMENTS (Bilingual)'
                  : 'Official Store Assistant for MODESTA INVESTMENTS (Bilingual)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowPromptInspector(!showPromptInspector)}
              title={lang === 'sw' ? 'Kagua Maelekezo ya AI (System Prompt)' : 'Inspect System Prompt & Safeguards'}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                showPromptInspector
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearChat}
              title={lang === 'sw' ? 'Weka Upya' : 'Reset Chat'}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prompt Inspector Drawer (if toggled) */}
        {showPromptInspector && (
          <div className="p-4 bg-neutral-900 text-neutral-200 text-xs border-b border-neutral-800 overflow-y-auto max-h-48 font-mono">
            <div className="flex items-center justify-between text-amber-400 font-semibold mb-2">
              <span>ACTIVE SYSTEM PROMPT & SAFEGUARDS</span>
              <span className="text-[10px] text-neutral-400">Strict Anti-Hallucination</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-neutral-300 text-[11px]">
              <li>Only uses catalog.json transcribed prices (no invented pricing).</li>
              <li>Always labels calculations as preliminary estimates.</li>
              <li>Safety escalation for gas cylinders (brand/valve check) and infant formula.</li>
              <li>Payment details: Vodacom Lipa Namba 51102080 (MODESTA INVESTMENTS).</li>
              <li>Delivery locations: Mbweni & Ubungo, Dar es Salaam (fees confirmed by store).</li>
            </ul>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-neutral-50/40">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-neutral-900 text-white rounded-br-xs'
                      : 'bg-white border border-neutral-200 text-neutral-800 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>

                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-[10px] text-neutral-400 tabular-nums">
                    {m.timestamp}
                  </span>
                  {!isUser && (
                    <span className="text-[10px] text-neutral-400 font-medium">
                      Modesta
                    </span>
                  )}
                </div>

                {/* Suggested Items Action Cards (if model mentioned catalog products) */}
                {!isUser && m.suggestedItems && m.suggestedItems.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[85%]">
                    {m.suggestedItems.map((item, i) => {
                      const isAdded = addedItemNames[item.name];
                      return (
                        <button
                          key={i}
                          onClick={() => handleAddSuggested(item)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                            isAdded
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-white hover:bg-amber-50 border-neutral-200 hover:border-amber-300 text-neutral-800 shadow-2xs'
                          }`}
                        >
                          {isAdded ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Plus className="w-3 h-3 text-amber-600" />
                          )}
                          <span>{item.name}</span>
                          <span className="text-neutral-500 font-normal">
                            ({formatTZS(item.price_tzs)})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 p-2 bg-white rounded-xl border border-neutral-200 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              <span>{lang === 'sw' ? 'Modesta anaandika...' : 'Modesta is typing...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Safeguard & Store Contacts Footer Strip */}
        <div className="px-4 py-2 bg-amber-50/60 border-t border-amber-100 flex items-center justify-between text-[11px] text-amber-900">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="truncate">
              {lang === 'sw'
                ? 'Bei ni za makadirio. Hakuna malipo bila uthibitisho wa duka.'
                : 'Estimates only. Never send money without store staff confirmation.'}
            </span>
          </div>

          <a
            href={`https://wa.me/${STORE_INFO.phone_whatsapp.replace('+', '')}?text=${encodeURIComponent(
              'Habari Modesta Investments, nina swali kutoka kwenye website.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 whitespace-nowrap shrink-0"
          >
            <Phone className="w-3 h-3" />
            <span>WhatsApp Staff</span>
          </a>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              lang === 'sw'
                ? 'Andika swali lako (mfano: "Bei ya mchele kilo 5 na mafuta lita 5")...'
                : 'Ask Modesta (e.g., "Price of 5kg rice and 5L cooking oil")...'
            }
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <span>{lang === 'sw' ? 'Tuma' : 'Send'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
