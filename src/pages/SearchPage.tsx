import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, X, Sparkles } from 'lucide-react';
import { DEMO_PRODUCTS } from '../data/demoProducts';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Product } from '../types';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentQuery = searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(currentQuery);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  const popularSearches = [
    'Kundan Choker',
    'Temple Haar',
    'Jhumkas',
    'Bridal Suite',
    'Freshwater Pearl',
    'Cocktail Ring',
    'Meenakari Kada',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handlePopularClick = (term: string) => {
    setInputVal(term);
    setSearchParams({ q: term });
  };

  const searchResults = useMemo(() => {
    if (!currentQuery.trim()) return [];
    const q = currentQuery.toLowerCase().trim();

    return DEMO_PRODUCTS.filter((product) => {
      const matchText =
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.styles.some((s) => s.toLowerCase().includes(q)) ||
        product.material.toLowerCase().includes(q) ||
        product.occasions.some((o) => o.toLowerCase().includes(q));

      if (!matchText) return false;

      if (selectedCategoryFilter !== 'All' && product.category !== selectedCategoryFilter) {
        return false;
      }

      return true;
    });
  }, [currentQuery, selectedCategoryFilter]);

  // Categories present in results
  const availableCategories = useMemo(() => {
    if (!currentQuery.trim()) return [];
    const q = currentQuery.toLowerCase().trim();
    const allMatches = DEMO_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.styles.some((s) => s.toLowerCase().includes(q))
    );
    const set = new Set(allMatches.map((m) => m.category));
    return ['All', ...Array.from(set)];
  }, [currentQuery]);

  const breadcrumbs = [{ label: 'Search' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={breadcrumbs} />

      {/* Search Input Hero */}
      <div className="py-6 border-b border-[#E8E2D9] mb-8">
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#292722] font-light mb-4">
          Search the Atelier
        </h1>

        <form onSubmit={handleSearchSubmit} className="max-w-2xl relative">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search by jewel type, motif, material (e.g. Kundan, Jhumkas, Pearl, Temple)..."
            className="w-full bg-white border border-[#E8E2D9] py-3.5 pl-11 pr-24 text-sm text-[#292722] placeholder-[#77736B] rounded-xs focus:outline-none focus:border-[#A88955] shadow-xs"
          />
          <SearchIcon className="w-5 h-5 text-[#77736B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#A88955] text-white text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#8F7241] transition-colors"
          >
            Search
          </button>
        </form>

        {/* Popular Search Suggestions */}
        <div className="flex items-center gap-2 flex-wrap mt-4 text-xs text-[#77736B]">
          <span className="flex items-center gap-1 text-[#A88955] font-medium uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3 h-3" /> Popular:
          </span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => handlePopularClick(term)}
              className="px-2.5 py-1 bg-white border border-[#E8E2D9] rounded-xs hover:border-[#A88955] hover:text-[#292722] transition-colors text-xs"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {currentQuery.trim() ? (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D9] mb-8">
            <p className="text-xs text-[#77736B]">
              Found <strong className="text-[#292722] font-semibold">{searchResults.length}</strong> creations for "
              <strong className="text-[#292722]">{currentQuery}</strong>"
            </p>

            {/* Category Filter Pills if matches found */}
            {availableCategories.length > 2 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3 py-1 text-xs rounded-xs uppercase tracking-wider transition-all ${
                      selectedCategoryFilter === cat
                        ? 'bg-[#292722] text-[#F8F6F1] font-semibold'
                        : 'bg-white border border-[#E8E2D9] text-[#77736B] hover:text-[#292722]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {searchResults.length === 0 ? (
            <div className="bg-white border border-[#E8E2D9] rounded-xs p-16 text-center space-y-4">
              <SearchIcon className="w-10 h-10 text-[#77736B] mx-auto stroke-1" />
              <h2 className="font-serif-luxury text-2xl text-[#292722]">
                No Matching Jewels Found
              </h2>
              <p className="text-xs text-[#77736B] max-w-md mx-auto">
                We couldn't find any creations matching "{currentQuery}". Check your spelling or browse our full collections catalogue.
              </p>
              <Link
                to="/collections"
                className="inline-block px-6 py-2.5 bg-[#A88955] text-white text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#8F7241] transition-colors"
              >
                Browse All Jewellery
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-[#E8E2D9] rounded-xs p-16 text-center space-y-3">
          <h2 className="font-serif-luxury text-2xl text-[#292722]">Explore Our Catalogue</h2>
          <p className="text-xs text-[#77736B] max-w-md mx-auto">
            Type keywords above to discover Kundan chokers, temple haar necklaces, handcrafted jhumkas, and daily minimal essentials.
          </p>
          <Link
            to="/collections"
            className="inline-block px-6 py-2.5 bg-[#A88955] text-white text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#8F7241] transition-colors mt-2"
          >
            Explore All Jewels
          </Link>
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
