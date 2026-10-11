import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

export interface TanishqCardItem {
  id: string;
  title: string;
  tamilSubtitle: string;
  tagline: string;
  badge: string;
  badgeColor: string; // e.g. bg-amber-700, bg-emerald-700
  image: string;
  startingPrice: string;
  offerText: string;
  link: string;
  designsCount: number;
}

const TANISHQ_STYLE_CARDS: TanishqCardItem[] = [
  {
    id: 'attigai',
    title: 'Chettinad Attigai',
    tamilSubtitle: 'கெம்ப் அட்டிகை',
    tagline: 'Royal close-fitting kemp choker necklaces with basra pearls',
    badge: 'NEW COLLECTION',
    badgeColor: 'bg-[#8F7241]',
    image: '/images/chettinad/chettinad_attigai_gold.jpg',
    startingPrice: '₹18,400',
    offerText: '10% Off with AUREVYA10',
    link: '/collections?category=Attigai',
    designsCount: 14,
  },
  {
    id: 'jhimikki',
    title: 'Thanjavur Jhimikki',
    tamilSubtitle: 'மயில் ஜிமிக்கி',
    tagline: 'Dancing bell drops with ergonomic silicone counterweights',
    badge: 'BESTSELLER',
    badgeColor: 'bg-[#A63D40]',
    image: '/images/chettinad/thanjavur_jhimikki_gold.jpg',
    startingPrice: '₹12,800',
    offerText: 'Save ₹2,500 on 2 Pairs',
    link: '/collections?category=Jhimikki+Kammal',
    designsCount: 16,
  },
  {
    id: 'bridal',
    title: 'Muhurtham Bridal',
    tamilSubtitle: 'முகூர்த்த சீதனம்',
    tagline: 'Complete 7-piece heirloom trousseau for the Tamil bride',
    badge: 'BRIDAL 2026',
    badgeColor: 'bg-[#292722]',
    image: '/images/south_indian_bride.jpg',
    startingPrice: '₹52,000',
    offerText: 'Free 24K Gold Coin',
    link: '/collections?category=Bridal+Sets',
    designsCount: 15,
  },
  {
    id: 'manga-kasu',
    title: 'Manga & Kasu Malai',
    tamilSubtitle: 'மாங்காய் & காசு மாலை',
    tagline: 'Auspicious mango cabochons & embossed Lakshmi gold coins',
    badge: 'HEIRLOOM',
    badgeColor: 'bg-[#A88955]',
    image: '/images/chettinad/manga_malai_gold.jpg',
    startingPrice: '₹28,500',
    offerText: '24K Matte Vermeil',
    link: '/collections?category=Manga+Malai',
    designsCount: 14,
  },
  {
    id: 'valayal',
    title: 'Madurai Nagas Valayal',
    tamilSubtitle: 'நாகாஸ் வளையல்',
    tagline: 'Hand-engraved Gajalakshmi & elephant repoussé temple kadas',
    badge: 'TEMPLE GOLD',
    badgeColor: 'bg-[#6B5B3E]',
    image: '/images/chettinad/nagas_valayal_gold.jpg',
    startingPrice: '₹16,500',
    offerText: 'Free BlueDart Express',
    link: '/collections?category=South+Indian+Valayal',
    designsCount: 15,
  },
  {
    id: 'vanki-oddiyanam',
    title: 'Vanki & Oddiyanam',
    tamilSubtitle: 'வங்கி & ஒட்டியாணம்',
    tagline: 'Inverted-V bridal armlets & sculpted temple waist belts',
    badge: 'LIMITED ARCHIVE',
    badgeColor: 'bg-[#8F7241]',
    image: '/images/chettinad/chettinad_oddiyanam_vanki.jpg',
    startingPrice: '₹22,000',
    offerText: 'Only 5 Sets / Month',
    link: '/collections?category=Vanki+%26+Hip+Belts',
    designsCount: 10,
  },
];

export const HeroAnimatedCards: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Check scroll boundary
  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Calculate active card index
      const cardWidth = 260; // approximate card width + gap
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(index, 0), TANISHQ_STYLE_CARDS.length - 1));
    }
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, []);

  // Continuous subtle auto-scroll animation (Tanishq style marquee/slide)
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const maxScroll = scrollWidth - clientWidth;

        // If reached end, smoothly reset to beginning
        if (scrollLeft >= maxScroll - 5) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Smoothly advance by one card width
          scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const distance = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-[#FAF5EB] pt-6 pb-8 sm:pt-8 sm:pb-10 border-b border-[#E8E2D9] overflow-hidden">
      {/* Background decorative subtle gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-[#FAF5EB] via-[#F4EFEA] to-[#FAF5EB] pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Tanishq Luxury Typography */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-[#E8E2D9]/80 gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#A88955] font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tanishq-Inspired Curations &bull; 6 Sacred Silhouettes</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-light text-[#292722]">
              Explore by Iconic Adornments
            </h2>
          </div>

          {/* Navigation Controls & Direct Collections Link */}
          <div className="flex items-center gap-4">
            <Link
              to="/collections?style=south+indian+heritage"
              className="text-xs uppercase tracking-wider text-[#A88955] font-semibold hover:text-[#8F7241] transition-colors hidden sm:flex items-center gap-1"
            >
              <span>View All 137 Jewels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAutoScrolling(false);
                  handleManualScroll('left');
                }}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className={`p-2 rounded-full border transition-all ${
                  canScrollLeft
                    ? 'border-[#A88955] bg-white text-[#292722] hover:bg-[#A88955] hover:text-white shadow-xs'
                    : 'border-[#E8E2D9] bg-white/50 text-[#C4BDB2] cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAutoScrolling(false);
                  handleManualScroll('right');
                }}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className={`p-2 rounded-full border transition-all ${
                  canScrollRight
                    ? 'border-[#A88955] bg-white text-[#292722] hover:bg-[#A88955] hover:text-white shadow-xs'
                    : 'border-[#E8E2D9] bg-white/50 text-[#C4BDB2] cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 6 ANIMATED TANISHQ-STYLE CARDS TRACK */}
        <div
          ref={scrollContainerRef}
          onScroll={updateScrollButtons}
          onMouseEnter={() => setIsAutoScrolling(false)}
          onMouseLeave={() => setIsAutoScrolling(true)}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-2 scroll-smooth no-scrollbar scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TANISHQ_STYLE_CARDS.map((card, idx) => (
            <Link
              key={card.id}
              to={card.link}
              className="group relative flex-shrink-0 w-[240px] sm:w-[260px] snap-start bg-white rounded-2xl border border-[#E8E2D9] p-3 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-[#A88955]/15 hover:border-[#A88955]"
            >
              {/* TOP ARCHED IMAGE FRAME (Iconic Tanishq Indian Architectural Arch) */}
              <div className="relative aspect-[4/5] rounded-t-xl rounded-b-lg overflow-hidden bg-[#EDE4D8] border border-[#E8E2D9]/60">
                <ImageWithFallback
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                {/* Floating Status / Offer Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-bold text-white shadow-xs ${card.badgeColor}`}
                  >
                    {card.badge}
                  </span>
                </div>

                {/* Live Count Pill */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold text-white/95 bg-black/50 backdrop-blur-md border border-white/20">
                    {card.designsCount} Designs
                  </span>
                </div>

                {/* Bottom Overlay on Image: Starting Price & Offer */}
                <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                  <p className="text-[10px] uppercase tracking-wider text-[#EDE4D8] font-light">
                    Starting from
                  </p>
                  <p className="font-serif-luxury text-lg font-semibold tracking-wide text-white">
                    {card.startingPrice}
                  </p>
                </div>
              </div>

              {/* CARD DETAILS & CTA */}
              <div className="pt-3.5 pb-1 px-1 space-y-1.5 text-left">
                
                {/* Title & Tamil Subtitle */}
                <div className="flex items-baseline justify-between gap-1">
                  <h3 className="font-serif-luxury text-base sm:text-lg font-medium text-[#292722] group-hover:text-[#A88955] transition-colors truncate">
                    {card.title}
                  </h3>
                  <span className="text-[10px] text-[#A88955] font-light italic shrink-0">
                    {card.tamilSubtitle}
                  </span>
                </div>

                {/* Short Tagline */}
                <p className="text-xs text-[#77736B] line-clamp-1 font-light">
                  {card.tagline}
                </p>

                {/* Special Offer Pill */}
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#8F7241] font-semibold">
                    <Tag className="w-3 h-3 text-[#A88955]" />
                    <span className="truncate">{card.offerText}</span>
                  </span>

                  <span className="text-[11px] font-medium text-[#292722] group-hover:text-[#A88955] transition-colors flex items-center gap-0.5 shrink-0">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>

              {/* Shimmer Border Accent on Hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#A88955] transition-colors pointer-events-none" />
            </Link>
          ))}
        </div>

        {/* BOTTOM PAGINATION DOTS (6 cards) */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {TANISHQ_STYLE_CARDS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setIsAutoScrolling(false);
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({
                    left: idx * 260,
                    behavior: 'smooth',
                  });
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? 'w-8 bg-[#A88955]'
                  : 'w-2 bg-[#D6CEBF] hover:bg-[#A88955]/60'
              }`}
              aria-label={`Go to card ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
