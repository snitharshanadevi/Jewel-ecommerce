import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search, RotateCcw } from 'lucide-react';
import { DEMO_PRODUCTS } from '../data/demoProducts';
import { DEMO_CATEGORIES } from '../data/demoCategories';
import { Product, JewelleryCategory, JewelleryStyle, MaterialFinish, JewelleryOccasion } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const CollectionsPage: React.FC = () => {
  const { category: routeCategory } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Read URL parameters
  const selectedCategories = useMemo<JewelleryCategory[]>(() => {
    if (routeCategory) {
      const decoded = decodeURIComponent(routeCategory) as JewelleryCategory;
      return [decoded];
    }
    const catParam = searchParams.get('category');
    return catParam ? (catParam.split(',') as JewelleryCategory[]) : [];
  }, [routeCategory, searchParams]);

  const selectedStyles = useMemo<JewelleryStyle[]>(() => {
    const styleParam = searchParams.get('style');
    if (!styleParam) return [];
    return styleParam.split(',').map((s) => {
      const clean = s.trim().toLowerCase().replace(/\+/g, ' ');
      if (clean.includes('south')) return 'South Indian Heritage' as JewelleryStyle;
      return (clean.charAt(0).toUpperCase() + clean.slice(1)) as JewelleryStyle;
    });
  }, [searchParams]);

  const selectedMaterials = useMemo<MaterialFinish[]>(() => {
    const matParam = searchParams.get('material');
    return matParam ? (matParam.split(',') as MaterialFinish[]) : [];
  }, [searchParams]);

  const selectedOccasions = useMemo<JewelleryOccasion[]>(() => {
    const occParam = searchParams.get('occasion');
    return occParam ? (occParam.split(',') as JewelleryOccasion[]) : [];
  }, [searchParams]);

  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 100000;
  const inStockOnly = searchParams.get('inStock') === 'true';
  const sortBy = searchParams.get('sort') || 'featured';
  const searchQuery = searchParams.get('q') || '';

  // Synchronize helper
  const updateQueryParam = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, val);
      }
    });
    setSearchParams(newParams);
  };

  const toggleCategory = (cat: JewelleryCategory) => {
    if (routeCategory) return; // If on dedicated category route, ignore toggle or change route
    const current = new Set(selectedCategories);
    if (current.has(cat)) current.delete(cat);
    else current.add(cat);
    updateQueryParam({ category: current.size > 0 ? Array.from(current).join(',') : null });
  };

  const toggleStyle = (style: JewelleryStyle) => {
    const current = new Set(selectedStyles);
    if (current.has(style)) current.delete(style);
    else current.add(style);
    updateQueryParam({ style: current.size > 0 ? Array.from(current).join(',').toLowerCase() : null });
  };

  const toggleMaterial = (mat: MaterialFinish) => {
    const current = new Set(selectedMaterials);
    if (current.has(mat)) current.delete(mat);
    else current.add(mat);
    updateQueryParam({ material: current.size > 0 ? Array.from(current).join(',') : null });
  };

  const toggleOccasion = (occ: JewelleryOccasion) => {
    const current = new Set(selectedOccasions);
    if (current.has(occ)) current.delete(occ);
    else current.add(occ);
    updateQueryParam({ occasion: current.size > 0 ? Array.from(current).join(',') : null });
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return DEMO_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      // Style filter
      if (selectedStyles.length > 0) {
        const hasMatchingStyle = product.styles.some((s) => selectedStyles.includes(s));
        if (!hasMatchingStyle) return false;
      }

      // Material filter
      if (selectedMaterials.length > 0 && !selectedMaterials.includes(product.material)) {
        return false;
      }

      // Occasion filter
      if (selectedOccasions.length > 0) {
        const hasMatchingOccasion = product.occasions.some((o) => selectedOccasions.includes(o));
        if (!hasMatchingOccasion) return false;
      }

      // Price range
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      // In stock
      if (inStockOnly && product.availability !== 'in-stock') {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [
    selectedCategories,
    selectedStyles,
    selectedMaterials,
    selectedOccasions,
    minPrice,
    maxPrice,
    inStockOnly,
    searchQuery,
    sortBy,
  ]);

  // Active filter count
  const activeFiltersCount =
    (selectedCategories.length && !routeCategory ? selectedCategories.length : 0) +
    selectedStyles.length +
    selectedMaterials.length +
    selectedOccasions.length +
    (minPrice > 0 || maxPrice < 100000 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Close filter drawer on esc key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileFilterOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const stylesList: JewelleryStyle[] = [
    'South Indian Heritage',
    'Traditional',
    'Contemporary',
    'Fusion',
    'Bridal',
    'Everyday',
    'Festive',
  ];

  const materialsList: MaterialFinish[] = [
    'gold-tone',
    'kemp stone',
    'silver-tone',
    'oxidised',
    'pearl',
    'gemstone',
  ];

  const occasionsList: JewelleryOccasion[] = [
    'Puja & Muhurtham',
    'Wedding',
    'Festive',
    'Party',
    'Daily Wear',
    'Cocktail',
    'Gifting',
  ];

  const breadcrumbs = routeCategory
    ? [
        { label: 'Collections', to: '/collections' },
        { label: decodeURIComponent(routeCategory) },
      ]
    : [{ label: 'Collections' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={breadcrumbs} />

      {/* Header Banner */}
      <div className="py-6 border-b border-[#E8E2D9] mb-8">
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#292722] font-light">
          {routeCategory ? decodeURIComponent(routeCategory) : 'All Jewellery Collections'}
        </h1>
        <p className="text-xs sm:text-sm text-[#77736B] mt-1 font-light max-w-2xl">
          Impeccable gold-toned filigree, heirloom temple iconography, and modern minimal essentials.
          Every piece is designed for enduring grace.
        </p>
      </div>

      {/* Controls Bar: Search, Mobile Filter Toggle, Sort & Count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D9] mb-8">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2 bg-white border border-[#E8E2D9] text-xs uppercase tracking-wider text-[#292722] flex items-center gap-2 rounded-xs shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#A88955]" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 bg-[#A88955] text-white text-[10px] rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <span className="text-xs text-[#77736B]">
            Showing <strong className="text-[#292722] font-semibold">{filteredProducts.length}</strong> of{' '}
            {DEMO_PRODUCTS.length} jewels
          </span>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="sort-select" className="text-xs uppercase tracking-wider text-[#77736B] font-medium whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => updateQueryParam({ sort: e.target.value })}
            className="bg-white border border-[#E8E2D9] text-xs text-[#292722] py-2 px-3 rounded-xs focus:outline-none focus:border-[#A88955]"
          >
            <option value="featured">Featured First</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8 p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xs">
          <span className="text-[11px] uppercase tracking-wider text-[#77736B] font-medium mr-1">
            Active Filters:
          </span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E8E2D9] text-xs text-[#292722] rounded-xs">
              Search: "{searchQuery}"
              <button onClick={() => updateQueryParam({ q: null })} className="text-[#77736B] hover:text-[#292722]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {!routeCategory &&
            selectedCategories.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E8E2D9] text-xs text-[#292722] rounded-xs">
                {c}
                <button onClick={() => toggleCategory(c)} className="text-[#77736B] hover:text-[#292722]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

          {selectedStyles.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E8E2D9] text-xs text-[#292722] rounded-xs">
              Style: {s}
              <button onClick={() => toggleStyle(s)} className="text-[#77736B] hover:text-[#292722]">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {selectedMaterials.map((m) => (
            <span key={m} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E8E2D9] text-xs text-[#292722] rounded-xs">
              Finish: {m}
              <button onClick={() => toggleMaterial(m)} className="text-[#77736B] hover:text-[#292722]">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {selectedOccasions.map((o) => (
            <span key={o} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E8E2D9] text-xs text-[#292722] rounded-xs">
              Occasion: {o}
              <button onClick={() => toggleOccasion(o)} className="text-[#77736B] hover:text-[#292722]">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E8E2D9] text-xs text-[#292722] rounded-xs">
              In Stock Only
              <button onClick={() => updateQueryParam({ inStock: null })} className="text-[#77736B] hover:text-[#292722]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={clearAllFilters}
            className="text-[11px] text-[#A88955] hover:underline font-semibold ml-auto flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        </div>
      )}

      {/* Main Content Layout: Sidebar Filters (Desktop) + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-8 pr-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#292722] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#A88955]" />
              Refine Selection
            </h2>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-[#77736B] hover:text-[#A88955]"
              >
                Reset
              </button>
            )}
          </div>

          {/* Categories */}
          {!routeCategory && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#292722]">Categories</h3>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {DEMO_CATEGORIES.map((cat) => (
                  <label key={cat.id} className="flex items-center justify-between text-xs text-[#77736B] hover:text-[#292722] cursor-pointer">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="rounded-xs border-[#E8E2D9] text-[#A88955] focus:ring-[#A88955]"
                      />
                      <span>{cat.name}</span>
                    </span>
                    <span className="text-[10px] text-[#77736B]/70">{cat.featuredCount}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Style */}
          <div className="space-y-3 pt-4 border-t border-[#E8E2D9]">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#292722]">Design Style</h3>
            <div className="space-y-1.5">
              {stylesList.map((style) => (
                <label key={style} className="flex items-center gap-2 text-xs text-[#77736B] hover:text-[#292722] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStyles.includes(style)}
                    onChange={() => toggleStyle(style)}
                    className="rounded-xs border-[#E8E2D9] text-[#A88955] focus:ring-[#A88955]"
                  />
                  <span>{style}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Material & Finish */}
          <div className="space-y-3 pt-4 border-t border-[#E8E2D9]">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#292722]">Material & Finish</h3>
            <div className="space-y-1.5">
              {materialsList.map((mat) => (
                <label key={mat} className="flex items-center gap-2 text-xs text-[#77736B] hover:text-[#292722] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(mat)}
                    onChange={() => toggleMaterial(mat)}
                    className="rounded-xs border-[#E8E2D9] text-[#A88955] focus:ring-[#A88955]"
                  />
                  <span className="capitalize">{mat.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Occasion */}
          <div className="space-y-3 pt-4 border-t border-[#E8E2D9]">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#292722]">Occasion</h3>
            <div className="space-y-1.5">
              {occasionsList.map((occ) => (
                <label key={occ} className="flex items-center gap-2 text-xs text-[#77736B] hover:text-[#292722] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOccasions.includes(occ)}
                    onChange={() => toggleOccasion(occ)}
                    className="rounded-xs border-[#E8E2D9] text-[#A88955] focus:ring-[#A88955]"
                  />
                  <span>{occ}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="pt-4 border-t border-[#E8E2D9]">
            <label className="flex items-center gap-2 text-xs text-[#292722] font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => updateQueryParam({ inStock: e.target.checked ? 'true' : null })}
                className="rounded-xs border-[#E8E2D9] text-[#A88955] focus:ring-[#A88955]"
              />
              <span>In-Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <section className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 px-4 bg-white border border-[#E8E2D9] rounded-xs space-y-4">
              <Search className="w-10 h-10 text-[#77736B] mx-auto stroke-1" />
              <h3 className="font-serif-luxury text-2xl text-[#292722]">No Jewels Matched Your Filter</h3>
              <p className="text-xs text-[#77736B] max-w-md mx-auto">
                We could not find any jewellery matching the selected filters. Try broadening your criteria or reset the filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-[#A88955] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#8F7241] transition-colors rounded-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#292722]/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9]">
              <h3 className="font-serif-luxury text-xl font-medium text-[#292722]">Filter Jewels</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-[#77736B] hover:text-[#292722]"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 py-4">
              {/* Category */}
              {!routeCategory && (
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#292722]">Category</h4>
                  {DEMO_CATEGORIES.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 text-xs text-[#77736B]">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(c.id)}
                        onChange={() => toggleCategory(c.id)}
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Styles */}
              <div className="space-y-2 pt-4 border-t border-[#E8E2D9]">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#292722]">Style</h4>
                {stylesList.map((s) => (
                  <label key={s} className="flex items-center gap-2 text-xs text-[#77736B]">
                    <input
                      type="checkbox"
                      checked={selectedStyles.includes(s)}
                      onChange={() => toggleStyle(s)}
                    />
                    <span>{s}</span>
                  </label>
                ))}
              </div>

              {/* Material */}
              <div className="space-y-2 pt-4 border-t border-[#E8E2D9]">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#292722]">Material</h4>
                {materialsList.map((m) => (
                  <label key={m} className="flex items-center gap-2 text-xs text-[#77736B]">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(m)}
                      onChange={() => toggleMaterial(m)}
                    />
                    <span className="capitalize">{m}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E2D9] mt-auto flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2.5 border border-[#E8E2D9] text-xs uppercase tracking-wider text-[#77736B]"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#A88955] text-white text-xs uppercase tracking-wider font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
