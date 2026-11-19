import React, { useState } from 'react';
import { Plus, Check, AlertCircle, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { PACKAGES, formatTZS, CatalogPackage } from '../data/catalog';

interface PackagesSectionProps {
  lang: 'sw' | 'en';
  onAddItem: (name: string, price: number, safetyNote?: string) => void;
  onAddMultipleItems: (items: { name: string; price: number; safetyNote?: string }[]) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  lang,
  onAddItem,
  onAddMultipleItems,
}) => {
  const [addedPackageId, setAddedPackageId] = useState<string | null>(null);
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);

  const handleAddEntirePackage = (pkg: CatalogPackage) => {
    const itemsToAdd = pkg.items.map((i) => ({
      name: i.name,
      price: i.price_tzs,
      safetyNote: i.safety_note,
    }));
    onAddMultipleItems(itemsToAdd);
    setAddedPackageId(pkg.id);
    setTimeout(() => setAddedPackageId(null), 1800);
  };

  return (
    <section id="vifurushi" className="py-16 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
              {lang === 'sw' ? 'Vifurushi vya Duka' : 'Curated Store Bundles'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display tracking-tight">
              {lang === 'sw' ? 'Vifurushi 6 Rasmi vya MODESTA' : 'Official 6 Store Packages'}
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-2xl">
              {lang === 'sw'
                ? 'Vifurushi vilivyopangwa kulingana na mahitaji yako ya kila siku ya nyumbani, jiko, mtoto na nishati.'
                : 'Carefully categorized packages tailored to daily home, kitchen, childcare, and household energy needs.'}
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-xs text-neutral-500 font-medium">
            <span>* {lang === 'sw' ? 'Jumla ya kifurushi ni makadirio ya bidhaa zilizoorodheshwa' : 'Package totals are estimates from listed prices'}</span>
          </div>
        </div>

        {/* 6 Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKAGES.map((pkg) => {
            const packageSubtotal = pkg.items.reduce((acc, curr) => acc + curr.price_tzs, 0);
            const isAdded = addedPackageId === pkg.id;
            const isExpanded = expandedPackageId === pkg.id;

            return (
              <div
                key={pkg.id}
                className="flex flex-col bg-white rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Optional Package Visual */}
                {pkg.image ? (
                  <div className="relative h-44 w-full bg-neutral-100 overflow-hidden border-b border-neutral-100">
                    <img
                      src={pkg.image}
                      alt={pkg.name_en}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-300">
                        {pkg.items.length} {lang === 'sw' ? 'Bidhaa' : 'Items'}
                      </span>
                      <h3 className="text-base font-bold text-white font-display leading-snug">
                        {lang === 'sw' ? pkg.name_sw : pkg.name_en}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 pb-3 border-b border-neutral-100 bg-neutral-50/50">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-700">
                      {pkg.items.length} {lang === 'sw' ? 'Bidhaa' : 'Items'}
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 font-display mt-0.5">
                      {lang === 'sw' ? pkg.name_sw : pkg.name_en}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">{pkg.description}</p>
                  </div>
                )}

                {/* Items preview list */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {pkg.image && (
                      <p className="text-xs text-neutral-500 mb-3">{pkg.description}</p>
                    )}

                    <div className="space-y-2 mb-4">
                      {pkg.items.slice(0, isExpanded ? pkg.items.length : 4).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs py-1 border-b border-neutral-100 last:border-0"
                        >
                          <div className="pr-2 flex-1 min-w-0">
                            <span className="font-medium text-neutral-800 block truncate">
                              {item.name}
                            </span>
                            {item.safety_note && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-medium">
                                <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                                {lang === 'sw' ? 'Inahitaji uthibitisho wa duka' : 'Requires staff check'}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-semibold text-neutral-900 tabular-nums">
                              {formatTZS(item.price_tzs)}
                            </span>
                            <button
                              onClick={() => onAddItem(item.name, item.price_tzs, item.safety_note)}
                              className="p-1 text-neutral-500 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors"
                              title={lang === 'sw' ? 'Ongeza kwenye kikapu' : 'Add to basket'}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {pkg.items.length > 4 && (
                      <button
                        onClick={() => setExpandedPackageId(isExpanded ? null : pkg.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 mb-3"
                      >
                        {isExpanded ? (
                          <>
                            <span>{lang === 'sw' ? 'Funga bidhaa' : 'Show less'}</span>
                            <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>
                              {lang === 'sw' ? `Tazama zote ${pkg.items.length}` : `View all ${pkg.items.length} items`}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Card bottom: Subtotal & Action */}
                  <div className="pt-3 border-t border-neutral-200 mt-2">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-xs text-neutral-500">
                        {lang === 'sw' ? 'Kadirio la kifurushi chote:' : 'Estimated full bundle:'}
                      </span>
                      <span className="text-base font-bold text-neutral-900 tabular-nums">
                        {formatTZS(packageSubtotal)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddEntirePackage(pkg)}
                      disabled={isAdded}
                      className={`w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-900 text-white hover:bg-neutral-800'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{lang === 'sw' ? 'Kimeongezwa kwenye Kikapu!' : 'Added to Basket!'}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{lang === 'sw' ? 'Weka Kifurushi Chote Kwenye Kikapu' : 'Add Entire Bundle to Basket'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
