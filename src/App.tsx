/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MessageSquare, ShoppingBag } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PackagesSection } from './components/PackagesSection';
import { CatalogSection } from './components/CatalogSection';
import { AIAssistantModal } from './components/AIAssistantModal';
import { BasketDrawer, BasketItem } from './components/BasketDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { StoreSafeguards } from './components/StoreSafeguards';
import { Footer } from './components/Footer';

export default function App() {
  const [lang, setLang] = useState<'sw' | 'en'>('sw');
  const [basket, setBasket] = useState<BasketItem[]>(() => {
    try {
      const saved = localStorage.getItem('modesta_basket');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [assistantPrompt, setAssistantPrompt] = useState<string | undefined>(undefined);
  const [isBasketOpen, setIsBasketOpen] = useState<boolean>(false);
  const [orderSuccessData, setOrderSuccessData] = useState<any>(null);

  // Sync basket to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('modesta_basket', JSON.stringify(basket));
    } catch (e) {
      console.warn('Could not save basket to localStorage', e);
    }
  }, [basket]);

  // Total quantity count in basket
  const totalBasketCount = basket.reduce((acc, item) => acc + item.quantity, 0);

  // Add individual item to basket
  const handleAddItem = (name: string, price: number, safetyNote?: string) => {
    setBasket((prev) => {
      const existingIdx = prev.findIndex((i) => i.name.toLowerCase() === name.toLowerCase());
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      }
      return [...prev, { name, price, quantity: 1, safetyNote }];
    });
  };

  // Add multiple items (e.g. from a whole package)
  const handleAddMultipleItems = (
    itemsToAdd: { name: string; price: number; safetyNote?: string }[]
  ) => {
    setBasket((prev) => {
      const copy = [...prev];
      for (const item of itemsToAdd) {
        const existingIdx = copy.findIndex((i) => i.name.toLowerCase() === item.name.toLowerCase());
        if (existingIdx >= 0) {
          copy[existingIdx].quantity += 1;
        } else {
          copy.push({
            name: item.name,
            price: item.price,
            quantity: 1,
            safetyNote: item.safetyNote,
          });
        }
      }
      return copy;
    });
  };

  // Update item quantity
  const handleUpdateQuantity = (name: string, delta: number) => {
    setBasket((prev) => {
      return prev
        .map((item) => {
          if (item.name.toLowerCase() === name.toLowerCase()) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as BasketItem[];
    });
  };

  // Remove single item
  const handleRemoveItem = (name: string) => {
    setBasket((prev) => prev.filter((i) => i.name.toLowerCase() !== name.toLowerCase()));
  };

  // Clear basket
  const handleClearBasket = () => {
    setBasket([]);
  };

  // Open Assistant with optional initial question
  const handleOpenAssistant = (prompt?: string) => {
    setAssistantPrompt(prompt);
    setIsAssistantOpen(true);
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'sw' ? 'en' : 'sw'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans">
      {/* 1. Header */}
      <Header
        basketCount={totalBasketCount}
        onOpenBasket={() => setIsBasketOpen(true)}
        onOpenAssistant={() => handleOpenAssistant()}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          lang={lang}
          onOpenAssistant={handleOpenAssistant}
          onExploreCatalog={() => {
            const el = document.getElementById('katalogi');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. Curated Packages Section */}
        <PackagesSection
          lang={lang}
          onAddItem={handleAddItem}
          onAddMultipleItems={handleAddMultipleItems}
        />

        {/* 4. Complete Catalog Section */}
        <CatalogSection lang={lang} onAddItem={handleAddItem} />

        {/* 5. Store Safeguards Section */}
        <StoreSafeguards lang={lang} />
      </main>

      {/* 6. Footer */}
      <Footer
        lang={lang}
        onOpenAssistant={() => handleOpenAssistant()}
        onOpenBasket={() => setIsBasketOpen(true)}
      />

      {/* Floating Action Button for Assistant (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
        {totalBasketCount > 0 && (
          <button
            onClick={() => setIsBasketOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900 text-white shadow-xl hover:bg-neutral-800 transition-all font-semibold text-xs border border-neutral-700"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>{lang === 'sw' ? 'Kikapu' : 'Basket'}</span>
            <span className="w-5 h-5 rounded-full bg-amber-400 text-neutral-900 text-[11px] font-bold flex items-center justify-center tabular-nums">
              {totalBasketCount}
            </span>
          </button>
        )}

        <button
          onClick={() => handleOpenAssistant()}
          className="flex items-center gap-2.5 px-4.5 py-3 rounded-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white shadow-xl hover:shadow-2xl transition-all font-semibold text-xs border border-amber-500/50"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{lang === 'sw' ? 'Uliza Modesta AI' : 'Chat with Modesta'}</span>
        </button>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => {
          setIsAssistantOpen(false);
          setAssistantPrompt(undefined);
        }}
        lang={lang}
        initialPrompt={assistantPrompt}
        onAddItem={handleAddItem}
      />

      {/* Shopping Basket Drawer */}
      <BasketDrawer
        isOpen={isBasketOpen}
        onClose={() => setIsBasketOpen(false)}
        items={basket}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearBasket={handleClearBasket}
        onOrderPrepared={(orderData) => {
          setIsBasketOpen(false);
          setOrderSuccessData(orderData);
        }}
        lang={lang}
      />

      {/* Order Prepared Success Modal */}
      <OrderSuccessModal
        orderData={orderSuccessData}
        onClose={() => setOrderSuccessData(null)}
        lang={lang}
      />
    </div>
  );
}
