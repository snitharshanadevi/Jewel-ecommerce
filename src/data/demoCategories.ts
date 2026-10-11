import { JewelleryCategory } from '../types';

export const DEMO_CATEGORIES: {
  id: JewelleryCategory;
  name: string;
  tagline: string;
  image: string;
  featuredCount: number;
  origin?: string;
}[] = [
  {
    id: 'Attigai',
    name: 'Heritage Attigai',
    tagline: 'Timeless South Indian close-fitting Kemp & Emerald choker necklaces',
    image: '/images/chettinad/chettinad_attigai_gold.jpg',
    featuredCount: 14,
    origin: 'Chettinad & Thanjavur',
  },
  {
    id: 'Jhimikki Kammal',
    name: 'Jhimikki & Kammal',
    tagline: 'Traditional bell umbrella drops, peacock studs, and temple earwear',
    image: '/images/chettinad/thanjavur_jhimikki_gold.jpg',
    featuredCount: 16,
    origin: 'Madurai & Coimbatore',
  },
  {
    id: 'Manga Malai',
    name: 'Manga Malai Haram',
    tagline: 'Auspicious paisley and mango motif necklaces celebrating fertility and grace',
    image: '/images/chettinad/manga_malai_gold.jpg',
    featuredCount: 14,
    origin: 'Tamil Nadu & Kerala',
  },
  {
    id: 'Kasu Malai',
    name: 'Lakshmi Kasu Malai',
    tagline: 'Sacred embossed coin garlands carrying divine prosperity',
    image: '/images/kasu_manga_suite.jpg',
    featuredCount: 14,
    origin: 'Udupi & Thanjavur',
  },
  {
    id: 'South Indian Valayal',
    name: 'Valayal & Nagas Kadas',
    tagline: 'Hand-engraved temple valayal bangles with floral and elephant motifs',
    image: '/images/chettinad/nagas_valayal_gold.jpg',
    featuredCount: 15,
    origin: 'Nagercoil & Trichy',
  },
  {
    id: 'Vanki & Hip Belts',
    name: 'Vanki & Oddiyanam',
    tagline: 'Inverted-V bridal armlets and sculpted waist adornments',
    image: '/images/chettinad/chettinad_oddiyanam_vanki.jpg',
    featuredCount: 10,
    origin: 'Mysuru & Thanjavur',
  },
  {
    id: 'Temple Jewellery',
    name: 'Temple Jewellery',
    tagline: 'Sacred Nagas and Gopuram art sculpted by hereditary sthapathis',
    image: '/images/chettinad/chettinad_kaluthuru_gold.jpg',
    featuredCount: 18,
    origin: 'South Indian Royalty',
  },
  {
    id: 'Kundan Jewellery',
    name: 'Kundan & Jadau',
    tagline: 'Fine royal glass stone setting perfected over centuries',
    image: 'https://images.unsplash.com/photo-1543290900-7aeec9449297?auto=format&fit=crop&w=800&q=80',
    featuredCount: 18,
  },
  {
    id: 'Bridal Sets',
    name: 'Bridal Couture Suites',
    tagline: 'Complete heirloom wedding suites for muhurtham and reception',
    image: '/images/chettinad/chettinad_flatlay_gold.jpg',
    featuredCount: 15,
  },
  {
    id: 'Minimal Jewellery',
    name: 'Minimal Essentials',
    tagline: 'Featherlight 18k gold-toned pieces for daily modern refinement',
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
    featuredCount: 20,
  },
  {
    id: 'Earrings',
    name: 'Earrings & Studs',
    tagline: 'Solitaire pearls, emerald drops, and everyday studs',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    featuredCount: 24,
  },
  {
    id: 'Rings',
    name: 'Rings & Halos',
    tagline: 'Navratna bands, cocktail emerald halos, and subtle wraps',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    featuredCount: 15,
  },
];
