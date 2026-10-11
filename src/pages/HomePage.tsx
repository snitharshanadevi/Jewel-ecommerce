import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Compass, Feather, ShieldCheck, Heart } from 'lucide-react';
import { DEMO_PRODUCTS } from '../data/demoProducts';
import { DEMO_CATEGORIES } from '../data/demoCategories';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { CustomerFeedbackResults } from '../components/common/CustomerFeedbackResults';
import { LookbookGallery } from '../components/common/LookbookGallery';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { HeroAnimatedCards } from '../components/home/HeroAnimatedCards';
import { AiJewelShowcaseVideo } from '../components/home/AiJewelShowcaseVideo';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeCollectionTab, setActiveCollectionTab] = useState<string>('South Indian Heirlooms');

  // South Indian jewels specifically highlighted (8 top traditional designs)
  const southIndianJewels = DEMO_PRODUCTS.filter(
    (p) => p.collectionGroup === 'South Indian Heirlooms' || p.styles.includes('South Indian Heritage')
  ).slice(0, 8);

  // Hero category cards (showcasing top 8 traditional South Indian adornments)
  const heroCategories = DEMO_CATEGORIES.slice(0, 8);

  // Bestsellers list
  const bestsellers = DEMO_PRODUCTS.filter((p) => p.isBestseller).slice(0, 8);

  // Collection tabs
  const collectionTabs = [
    'South Indian Heirlooms',
    'Traditional Heritage',
    'Modern Essentials',
    'Festive Edit',
    'All',
  ];

  const filteredCollectionProducts = DEMO_PRODUCTS.filter((p) => {
    if (activeCollectionTab === 'All') return true;
    return p.collectionGroup === activeCollectionTab;
  }).slice(0, 8);

  return (
    <div className="space-y-14 sm:space-y-20">
      {/* 1. Hero Section - Right-to-Left Auto-Scrolling 6-Slide Carousel with Offers & Video */}
      <HeroCarousel />

      {/* 2. Tanishq-Style 6 Animated Arched Curations with Auto-Scroll & Starting Prices */}
      <HeroAnimatedCards />

      {/* 3. AI-Generated Jewellery Showcasing Video Reel Experience */}
      <div id="ai-jewel-showcase" className="scroll-mt-20">
        <AiJewelShowcaseVideo onQuickView={(p) => setQuickViewProduct(p)} />
      </div>


      {/* 2. Spotlight: Authentic South Indian Heirlooms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E8E2D9] gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#A88955] font-semibold">
              Heritage Spotlight
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#292722] mt-1">
              South Indian Temple & Muhurtham Suites
            </h2>
            <p className="text-xs sm:text-sm text-[#77736B] font-light mt-1 max-w-xl">
              From Kemp Attigai chokers to Thanjavur Jhimikkis and Nagas elephant Valayal bangles, crafted for sacred elegance.
            </p>
          </div>

          <Link
            to="/collections?style=south+indian+heritage"
            className="text-xs uppercase tracking-wider text-[#A88955] font-semibold hover:underline flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>View All South Indian Jewels</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {southIndianJewels.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 3. Category Discovery Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#A88955] font-semibold">
            Curated Categories
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#292722] mt-1">
            Explore by Sacred Adornment
          </h2>
          <p className="text-xs sm:text-sm text-[#77736B] mt-2 font-light">
            Attigai collars, Jhimikki Kammals, Kasu Malais, and Nagas Valayals sculpted with centuries of devotional mastery.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {heroCategories.map((category) => (
            <Link
              key={category.id}
              to={`/collections/${encodeURIComponent(category.id)}`}
              className="group flex flex-col items-center text-center p-3 sm:p-4 bg-white border border-[#E8E2D9] rounded-xs hover:border-[#A88955] transition-all hover:shadow-md"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 bg-[#FAF8F5] border border-[#E8E2D9]">
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif-luxury text-sm sm:text-base font-medium text-[#292722] group-hover:text-[#A88955] transition-colors">
                {category.name}
              </h3>
              <span className="text-[10px] text-[#77736B] mt-0.5 tracking-wider uppercase font-light">
                {category.featuredCount} Designs
              </span>
            </Link>
          ))}
        </div>
      </section>


      {/* 5. Editorial Lookbook Gallery Grid */}
      <LookbookGallery />

      {/* 5. Featured Collections with Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#E8E2D9]">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#A88955] font-semibold">
              The Edit
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#292722] mt-1">
              Curated Collections
            </h2>
          </div>

          {/* Collection Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {collectionTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCollectionTab(tab)}
                className={`px-3.5 py-1.5 text-xs tracking-wider uppercase transition-all whitespace-nowrap rounded-xs ${
                  activeCollectionTab === tab
                    ? 'bg-[#292722] text-[#F8F6F1] font-medium'
                    : 'bg-white text-[#77736B] border border-[#E8E2D9] hover:text-[#292722] hover:border-[#A88955]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCollectionProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border border-[#292722] text-[#292722] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#292722] hover:text-white transition-all shadow-xs"
          >
            <span>View All Creations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 6. Customer Feedback Results & Testimonials Section */}
      <CustomerFeedbackResults />

      {/* 7. Editorial Philosophy Section */}
      <section id="heritage-story" className="bg-[#F5EFE4] border-y border-[#E8E2D9] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="aspect-[4/5] overflow-hidden rounded-xs border border-[#E8E2D9] shadow-lg bg-white">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80"
                  alt="AUREVYA Master Karigar Crafting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#A88955] font-semibold">
                Our Philosophy
              </span>

              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-light text-[#292722] leading-tight">
                Tradition, Refined for Today.
              </h2>

              <p className="text-sm sm:text-base text-[#77736B] leading-relaxed font-light">
                South Indian temple jewellery and royal Indian suites carry sacred poetry, Thanjavur architectural lines, and deep spiritual affection.
                Yet traditional heirloom jewels often feel too heavy, pulling on the earlobe or weighing down the neck after just a couple of hours.
              </p>

              <p className="text-sm sm:text-base text-[#77736B] leading-relaxed font-light">
                At AUREVYA, our karigars re-engineered the classic Chettinad Attigai, Jhimikkis, and Nagas Valayals.
                We hollow out unseen dome spaces, incorporate silicone post supports, and apply rich 24k micro gold vermeil over hypoallergenic cores.
                The result is authentic South Indian temple splendour that feels weightless and comfortable all day long.
              </p>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#EDE4D8] rounded-xs text-[#A88955] shrink-0">
                    <Feather className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#292722]">Hollow Dome Comfort</h3>
                    <p className="text-xs text-[#77736B] mt-0.5">Engineered to sit comfortably against skin without earlobe pull.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#EDE4D8] rounded-xs text-[#A88955] shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#292722]">Temple Sthapathi Precision</h3>
                    <p className="text-xs text-[#77736B] mt-0.5">Ancient Nakshi repoussé work preserved by hereditary masters.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Bestsellers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#A88955] font-semibold">
            Most Adored
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#292722] mt-1">
            Iconic Bestsellers
          </h2>
          <p className="text-xs sm:text-sm text-[#77736B] mt-2 font-light">
            Treasured by patrons across India. Timeless additions to your personal jewel casket.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
