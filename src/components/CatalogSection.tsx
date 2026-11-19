import React, { useState, useMemo } from 'react';
import { Search, Plus, Check, AlertCircle } from 'lucide-react';
import { ALL_ITEMS, PACKAGES, formatTZS, CatalogItem } from '../data/catalog';

interface CatalogSectionProps {
  lang: 'sw' | 'en';
  onAddItem: (name: string, price: number, safetyNote?: string) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  lang,
  onAddItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentlyAdded, setRecentlyAdded] = useState<{ [key: string]: boolean }>({});

  const categories = useMemo(() => {
    return [
      { id: 'all', name_sw: 'Bidhaa Zote', name_en: 'All Products' },
      ...PACKAGES.map((p) => ({
        id: p.id,
        name_sw: p.name_sw.replace('Kifurushi cha ', ''),
        name_en: p.name_en.replace(' Package', ''),
      })),
    ];
  }, []);

  const filteredItems = useMemo(() => {
    return ALL_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category_name_sw.toLowerCase().includes(q) ||
        item.category_name_en.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleAdd = (item: CatalogItem) => {
    onAddItem(item.name, item.price_tzs, item.safety_note);
    if (item.id) {
      setRecentlyAdded((prev) => ({ ...prev, [item.id!]: true }));
      setTimeout(() => {
        setRecentlyAdded((prev) => ({ ...prev, [item.id!]: false }));
      }, 1400);
    }
  };

  return (
    <section id="katalogi" className="py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
              {lang === 'sw' ? 'Orodha ya Bei' : 'Official Price List'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display tracking-tight">
              {lang === 'sw' ? 'Katalogi ya Bidhaa Zote' : 'Full Item Catalog'}
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-2xl">
              {lang === 'sw'
                ? 'Bei zote zimenukuliwa kutoka bango rasmi la MODESTA INVESTMENTS. Chagua bidhaa na uandae oda ya WhatsApp kwa urahisi.'
                : 'All prices accurately transcribed from the official store price board. Add individual items directly to your estimate basket.'}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'sw' ? 'Tafuta mchele, maziwa, gesi...' : 'Search rice, milk, gas...'}
              className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl mb-8 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {lang === 'sw' ? cat.name_sw : cat.name_en}
              </button>
            );
          })}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isAdded = item.id ? recentlyAdded[item.id] : false;

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between p-4 rounded-xl bg-white border border-neutral-200 hover:border-amber-300 transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
                    <span className="font-medium">
                      {lang === 'sw' ? item.category_name_sw : item.category_name_en}
                    </span>
                    <span className="tabular-nums font-mono text-neutral-400">#MODESTA</span>
                  </div>

                  <h3 className="text-sm font-semibold text-neutral-900 leading-snug mb-2">
                    {item.name}
                  </h3>

                  {item.safety_note && (
                    <div className="flex items-start gap-1 p-2 rounded-lg bg-amber-50/70 border border-amber-200/50 mb-3 text-[11px] text-amber-800">
                      <AlertCircle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item.safety_note}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 mt-2">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">
                      {lang === 'sw' ? 'Bei ya Bango' : 'Poster Price'}
                    </span>
                    <span className="text-sm font-bold text-neutral-900 tabular-nums">
                      {formatTZS(item.price_tzs)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAdd(item)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-100 hover:bg-amber-600 hover:text-white text-neutral-800'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{lang === 'sw' ? 'Wekwa' : 'Added'}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>{lang === 'sw' ? 'Weka' : 'Add'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300">
            <p className="text-sm text-neutral-600 font-medium">
              {lang === 'sw'
                ? `Hakuna bidhaa iliyopatikana kwa "${searchQuery}".`
                : `No catalog items matched "${searchQuery}".`}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {lang === 'sw'
                ? 'Unaweza kumuuliza Modesta AI au kupiga WhatsApp +255 759 755 280.'
                : 'You can ask Modesta AI or message store staff on WhatsApp +255 759 755 280.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
