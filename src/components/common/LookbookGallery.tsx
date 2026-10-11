import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Eye, ArrowRight, Heart } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { formatINR } from '../../utils/formatters';

interface LookbookItem {
  id: string;
  image: string;
  alt: string;
  title: string;
  subtitle: string;
  sareeStyle: string;
  featuredJewel: {
    name: string;
    slug: string;
    price: number;
    category: string;
  };
}

export const LookbookGallery: React.FC = () => {
  const [activeItem, setActiveItem] = useState<LookbookItem | null>(null);

  const lookbookItems: LookbookItem[] = [
    {
      id: 'look-1',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      alt: 'South Indian bride wearing Chettinad Attigai and Kanjeevaram silk saree',
      title: 'The Muhurtham Grandeur',
      subtitle: 'Chettinad Kemp Attigai paired with crimson vermilion silk',
      sareeStyle: 'Kanchipuram Silk & Temple Gold',
      featuredJewel: {
        name: 'Chettinad Kemp Ruby Attigai Choker',
        slug: 'chettinad-kemp-ruby-attigai-choker',
        price: 32400,
        category: 'Attigai',
      },
    },
    {
      id: 'look-2',
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',
      alt: 'Close-up of dancing peacock Thanjavur Jhimikki Kammals',
      title: 'The Sangeet Rhythms',
      subtitle: 'Cascading seed pearls and hollow-dome Thanjavur Jhimikkis',
      sareeStyle: 'Organza Tissue Sari & Temple Earwear',
      featuredJewel: {
        name: 'Thanjavur Mayil Peedam Jhimikki Kammal',
        slug: 'thanjavur-mayil-peedam-jhimikki-kammal',
        price: 14800,
        category: 'Jhimikki Kammal',
      },
    },
    {
      id: 'look-3',
      image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=1000&q=85',
      alt: 'Temple Haram layered with Kasu Malai on bride',
      title: 'The Royal Layering',
      subtitle: 'Devi Kasu Malai draped beneath a sculptured temple haar',
      sareeStyle: 'Raw Silk Kurta & Kasu Mala',
      featuredJewel: {
        name: 'Devi Kasu Malai Garland Necklace',
        slug: 'devi-kasu-malai-garland-necklace',
        price: 36500,
        category: 'Kasu Malai',
      },
    },
    {
      id: 'look-4',
      image: 'https://images.unsplash.com/photo-1611591475817-f584fbe3c1fc?auto=format&fit=crop&w=1000&q=85',
      alt: 'Madurai Nagas elephant valayal bangles with bridal mehendi',
      title: 'The Sacred Clink',
      subtitle: 'Madurai Nagas Gaja Valayal with deep relief Nakshi work',
      sareeStyle: 'Bridal Henna & Antique Kadas',
      featuredJewel: {
        name: 'Madurai Nagas Gaja Valayal Pair',
        slug: 'madurai-nagas-gaja-valayal-pair',
        price: 22800,
        category: 'South Indian Valayal',
      },
    },
    {
      id: 'look-5',
      image: 'https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=1000&q=85',
      alt: 'Full bridal jewellery suite with Vanki and Matha Patti',
      title: 'The Complete Heirloom Suite',
      subtitle: 'Inverted-V Vanki armlet paired with bridal choker and hair ornaments',
      sareeStyle: 'Chettinad Heritage Bridal Trousseau',
      featuredJewel: {
        name: 'Rajkumari Nakshi Vanki Armlet',
        slug: 'rajkumari-nakshi-vanki-armlet',
        price: 28500,
        category: 'Vanki & Hip Belts',
      },
    },
    {
      id: 'look-6',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
      alt: 'Amukta Guttapusalu pearl fringe haram styled for wedding reception',
      title: 'The Coromandel Pearls',
      subtitle: 'Dense Guttapusalu seed pearl clusters dancing against temple ruby stones',
      sareeStyle: 'Banarasi Zari & Basra Pearls',
      featuredJewel: {
        name: 'Amukta Guttapusalu Pearl Fringe Haram',
        slug: 'amukta-guttapusalu-pearl-fringe-haram',
        price: 46000,
        category: 'Attigai',
      },
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDE4D8]/60 border border-[#E8E2D9] rounded-xs text-[10px] uppercase tracking-[0.25em] text-[#A88955] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Editorial Lookbook</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-[#292722] leading-tight">
          Adorned in Sacred Gold
        </h2>
        <p className="text-xs sm:text-sm text-[#77736B] font-light leading-relaxed">
          Explore how real brides and connoisseurs style AUREVYA heirloom jewels with Kanjeevaram silks, organza drapes, and festive ensembles. Hover or tap to shop each look.
        </p>
      </div>

      {/* Masonry / Grid of Visual Editorial Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {lookbookItems.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden bg-white border border-[#E8E2D9] rounded-xs shadow-xs hover:border-[#A88955] transition-all duration-500"
          >
            {/* Image Container with Luxury Aspect Ratio */}
            <div className="aspect-[3/4] w-full overflow-hidden relative bg-[#FAF8F5]">
              <ImageWithFallback
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />

              {/* Tag Pill on Top */}
              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="bg-white/90 backdrop-blur-md text-[#292722] text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-xs shadow-xs">
                  {item.sareeStyle}
                </span>
              </div>

              {/* Bottom Content Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5 text-white z-10 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#EDE4D8] font-medium">
                  {item.featuredJewel.category}
                </span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-light text-white mt-0.5 leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-white/80 font-light mt-1 line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>

                {/* Interactive "Shop this piece" Drawer Card inside image */}
                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium text-white truncate max-w-[180px]">
                      {item.featuredJewel.name}
                    </p>
                    <p className="text-xs font-bold text-[#EDE4D8]">
                      {formatINR(item.featuredJewel.price)}
                    </p>
                  </div>

                  <Link
                    to={`/products/${item.featuredJewel.slug}`}
                    className="px-3.5 py-1.5 bg-[#A88955] text-white text-[11px] uppercase tracking-wider font-semibold rounded-xs hover:bg-[#8F7241] transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <span>View Piece</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Quote Banner */}
      <div className="mt-14 p-8 sm:p-12 bg-white border border-[#E8E2D9] rounded-xs text-center max-w-4xl mx-auto shadow-xs">
        <p className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl text-[#292722] italic font-light leading-relaxed">
          "Jewellery in India is not merely an accessory; it is sacred architecture draped over the body, carrying centuries of sthapathi prayer, family devotion, and timeless grace."
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#A88955] font-semibold">
          <span>&mdash; AUREVYA ATELIER CHRONICLES &mdash;</span>
        </div>
      </div>
    </section>
  );
};
