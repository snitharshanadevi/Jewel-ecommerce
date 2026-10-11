import fs from 'fs';
import path from 'path';

// Curated high-res jewellery photography pools
const JEWELLERY_IMAGE_POOLS = {
  attigai: [
    '/images/chettinad/chettinad_attigai_gold.jpg',
    '/images/chettinad/chettinad_flatlay_gold.jpg',
    '/images/attigai_hero.jpg',
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
  ],
  jhimikki: [
    '/images/chettinad/thanjavur_jhimikki_gold.jpg',
    '/images/chettinad/chettinad_chutti_gold.jpg',
    '/images/chettinad/chettinad_flatlay_gold.jpg',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1611591475817-f584fbe3c1fc?auto=format&fit=crop&w=1000&q=85',
  ],
  manga_malai: [
    '/images/chettinad/manga_malai_gold.jpg',
    '/images/kasu_manga_suite.jpg',
    '/images/chettinad/chettinad_kaluthuru_gold.jpg',
    '/images/chettinad/chettinad_flatlay_gold.jpg',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
  ],
  valayal: [
    '/images/chettinad/nagas_valayal_gold.jpg',
    '/images/chettinad/chettinad_oddiyanam_vanki.jpg',
    '/images/chettinad/chettinad_flatlay_gold.jpg',
    'https://images.unsplash.com/photo-1611591475817-f584fbe3c1fc?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1000&q=85',
  ],
  vanki: [
    '/images/chettinad/chettinad_oddiyanam_vanki.jpg',
    '/images/chettinad/chettinad_chutti_gold.jpg',
    '/images/chettinad/nagas_valayal_gold.jpg',
    '/images/south_indian_bride.jpg',
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
  ],
  choker: [
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=1000&q=85',
  ],
  necklace: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=1000&q=85',
  ],
  rings: [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
  ],
  bangles: [
    'https://images.unsplash.com/photo-1611591475817-f584fbe3c1fc?auto=format&fit=crop&w=1000&q=85',
    '/images/chettinad/nagas_valayal_gold.jpg',
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
  ],
  earrings: [
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',
    '/images/chettinad/thanjavur_jhimikki_gold.jpg',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
  ],
  pendants: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=1000&q=85',
  ],
  bridal: [
    '/images/chettinad/chettinad_kaluthuru_gold.jpg',
    '/images/chettinad/chettinad_attigai_gold.jpg',
    '/images/chettinad/manga_malai_gold.jpg',
    '/images/chettinad/chettinad_oddiyanam_vanki.jpg',
  ]
};

function getImages(poolKey, offset = 0) {
  const pool = JEWELLERY_IMAGE_POOLS[poolKey] || JEWELLERY_IMAGE_POOLS.attigai;
  const result = [];
  for (let i = 0; i < 4; i++) {
    result.push(pool[(offset + i) % pool.length]);
  }
  return result;
}

// Generate the 130 products programmatically
const products = [];

// Helper to add product
function addP(p) {
  products.push(p);
}

// 1. CHEVRON & CHETTINAD ATTIGAI (14 products)
const attigaiItems = [
  { name: 'Chettinad Kemp Ruby Attigai Choker', price: 32400, orig: 38000, desc: 'A close-fitting Chettinad heritage collar necklace set with uncut cabochon kemp rubies and forest emeralds in solid antique 24k gold tone, bordered by hanging freshwater seed pearls.', origin: 'Chettinad & Thanjavur Royal Atelier', weight: '68g' },
  { name: 'Karaikudi Padakkam Kemp Attigai', price: 29800, orig: 34500, desc: 'Traditional Karaikudi merchant family design featuring a central circular pendant flanked by ruby kemp floral bars on antique vermeil.', origin: 'Karaikudi Heritage Guild', weight: '62g' },
  { name: 'Devakottai Double-Row Kemp Attigai', price: 36500, orig: 42000, desc: 'Double-tier cabochon ruby attigai crafted with flexible interlocking gold plates that mold comfortably against the collarbone.', origin: 'Devakottai Sthapathi', weight: '76g' },
  { name: 'Thanjavur Mayil Kemp Attigai Collar', price: 34200, orig: 39500, desc: 'Peacock-headed choker with hand-etched plumage and faceted synthetic tourmalines lined with clustered basra seed pearls.', origin: 'Thanjavur Royal Guild', weight: '71g' },
  { name: 'Kumbakonam Emerald & Ruby Attigai', price: 31500, orig: 36000, desc: 'Classic dual-tone South Indian attigai with vibrant forest emerald centerpieces and deep crimson kemp border drops.', origin: 'Kumbakonam Temple Goldsmiths', weight: '64g' },
  { name: 'Kanadukathan Antique Floral Attigai', price: 28900, orig: 33000, desc: 'Delicate repoussé floral blossoms intertwined with antique 24k gold dipped leaves and glowing ruby gems.', origin: 'Kanadukathan Atelier', weight: '59g' },
  { name: 'Madurai Meenakshi Kemp Attigai', price: 35800, orig: 41000, desc: 'Sacred temple style choker inspired by the Meenakshi Amman temple sanctum with hanging golden mango droplets.', origin: 'Madurai Sthapathi Guild', weight: '74g' },
  { name: 'Pudukkottai Royal Kemp Attigai', price: 33500, orig: 38500, desc: 'Imperial choker worn during traditional Chettinad betrothal ceremonies, set in 24k micro vermeil over heirloom brass alloy.', origin: 'Pudukkottai Karigar House', weight: '69g' },
  { name: 'Chettinad Navaratna Kemp Attigai', price: 38200, orig: 44000, desc: 'Auspicious nine-gemstone setting honoring celestial alignments, bordered with fine antique gold bead work.', origin: 'Chettinad Guild', weight: '79g' },
  { name: 'Chidambaram Golden Lotus Attigai', price: 27500, orig: 32000, desc: 'Sacred inverted lotus crest design surrounded by cabochon red rubies with adjustable pure silk golden braided dori.', origin: 'Chidambaram Temple Workshop', weight: '58g' },
  { name: 'Tirunelveli Antique Kemp Attigai', price: 30900, orig: 35500, desc: 'Deep crimson stone setting with traditional wax backing and antique brushed temple gold finish.', origin: 'Tirunelveli Goldsmiths', weight: '65g' },
  { name: 'Nattukottai Sovereign Kemp Attigai', price: 39500, orig: 46000, desc: 'Heavier imperial choker with solid coin-link collars and triple cluster pearl fringing.', origin: 'Nattukottai Heritage Atelier', weight: '84g' },
  { name: 'Chettinad Solitaire Kemp Attigai Collar', price: 26800, orig: 31000, desc: 'Minimalist interpretation featuring single-line radiant kemp cabochons for contemporary silk saree styling.', origin: 'Chettinad Atelier', weight: '52g' },
  { name: 'Kottayur Filigree Kemp Attigai', price: 31200, orig: 36000, desc: 'Exquisite open-work gold filigree motifs paired with rich crimson stones, offering breathability and luxury grace.', origin: 'Kottayur Goldsmiths', weight: '61g' }
];

attigaiItems.forEach((item, i) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  addP({
    id: `aur-att-${(i + 1).toString().padStart(3, '0')}`,
    name: item.name,
    slug,
    category: 'Attigai',
    price: item.price,
    originalPrice: item.orig,
    description: item.desc,
    story: `Handcrafted in hereditary Chettinad tradition by master goldsmiths. Auspicious adornment for sacred Muhurthams and grand celebrations.`,
    styles: ['Traditional', 'South Indian Heritage', 'Bridal'],
    material: 'kemp stone',
    occasions: ['Wedding', 'Festive', 'Puja & Muhurtham'],
    availability: i % 4 === 0 ? 'limited-stock' : 'in-stock',
    images: getImages('attigai', i),
    dimensions: 'Length 19 cm (adjustable silk cord), Width 3.5 cm',
    approxWeight: item.weight,
    isBestseller: i < 4,
    isNewArrival: i >= 10,
    isFeatured: i === 0 || i === 3,
    collectionGroup: 'South Indian Heirlooms',
    rating: Number((4.8 + (i % 3) * 0.1).toFixed(1)),
    reviewsCount: 28 + (i * 5),
    craftDetails: 'Handcrafted with 24k micro gold vermeil over brass alloy and genuine red-green kemp cabochons.',
    southIndianOrigin: item.origin
  });
});

// 2. THANJAVUR JHIMIKKI KAMMAL & EARRINGS (16 products)
const jhimikkiItems = [
  { name: 'Thanjavur Mayil Peedam Jhimikki Kammal', price: 19800, orig: 23500, desc: 'Sculpted peacock crest stud with traditional bell-shaped hanging jhumka dome, lined with rice pearl tassels and kemp stones.', origin: 'Thanjavur Royal Guild', weight: '24g' },
  { name: 'Chettinad Ruby Kemp Chandbali Jhimikki', price: 21500, orig: 25000, desc: 'Crescent moon motif merged with hollow bell dome, encrusted with cabochon rubies and suspended pearl clusters.', origin: 'Chettinad Heritage Guild', weight: '26g' },
  { name: 'Madurai Gajalakshmi Temple Jhimikkis', price: 23200, orig: 27000, desc: 'Twin elephant relief stud over an ornate hanging gold bell with medical-grade silicone cushion backings for earlobe comfort.', origin: 'Madurai Sthapathi Guild', weight: '28g' },
  { name: 'Karaikudi Antique Guttapusalu Jhimikki', price: 24500, orig: 29000, desc: 'Heirloom bunches of micro pearls suspended from an antique gold dome with ruby kemp flower stud.', origin: 'Karaikudi Heritage Guild', weight: '30g' },
  { name: 'Kumbakonam Triple-Tier Royal Jhimikki', price: 26800, orig: 32000, desc: 'Three concentric cascading bells that sway rhythmically with motion, lightweight hollow dome construction.', origin: 'Kumbakonam Workshop', weight: '32g' },
  { name: 'Thanjavur Mango Paisley Jhimikki Kammal', price: 18500, orig: 22000, desc: 'Auspicious mango-motif top stud holding a bell drop with genuine green emerald kemp stones.', origin: 'Thanjavur Atelier', weight: '22g' },
  { name: 'Tiruchirappalli Kemp Drop Jhimikki', price: 17200, orig: 20500, desc: 'Graceful single-tier jhumka with antique gold vermeil and cluster pearl fringing.', origin: 'Tiruchirappalli Artisans', weight: '20g' },
  { name: 'Devakottai Sovereign Coin Jhimikki', price: 19900, orig: 23800, desc: 'Lakshmi embossed coin stud holding a traditional fluted jhimikki dome.', origin: 'Devakottai Workshop', weight: '25g' },
  { name: 'Kanadukathan Blossom Kemp Jhimikki', price: 16800, orig: 19900, desc: 'Delicate floral stud with compact lightweight bell dome, ideal for both festive and temple wear.', origin: 'Kanadukathan Karigars', weight: '19g' },
  { name: 'Chidambaram Sacred Bell Jhimikkis', price: 22400, orig: 26500, desc: 'Inspired by Chidambaram temple bells with delicate micro-filigree vents and red spinel drops.', origin: 'Chidambaram Guild', weight: '27g' },
  { name: 'Pudukkottai Sun & Moon Dual Jhimikki', price: 25000, orig: 29500, desc: 'Symbolic Surya and Chandra studs carrying bell jhumkas with hanging pearl droplets.', origin: 'Pudukkottai Atelier', weight: '29g' },
  { name: 'Chettinad Navaratna Tiered Jhimikkis', price: 27900, orig: 33000, desc: 'Nine planetary gemstones embedded into a three-tier antique gold jhumka framework.', origin: 'Chettinad Sthapathis', weight: '33g' },
  { name: 'Nagercoil Temple Kemp Jhimikki', price: 18900, orig: 22500, desc: 'Classic Kerala-Tamil border temple goldsmithing with vibrant crimson kemp stones.', origin: 'Nagercoil Goldsmith Guild', weight: '23g' },
  { name: 'Salem Lightweight Daily Jhimikkis', price: 14500, orig: 17500, desc: 'Featherlight 16g dome engineered specifically for extended everyday wear without earlobe pull.', origin: 'Salem Karigar Guild', weight: '16g' },
  { name: 'Coimbatore Antique Matte Gold Jhimikkis', price: 20400, orig: 24200, desc: 'Brushed matte 24k gold dip with cabochon rubies and elegant bell acoustics.', origin: 'Coimbatore Atelier', weight: '24g' },
  { name: 'Tirunelveli Kemp Stud with Mattal Extension', price: 28500, orig: 34000, desc: 'Jhimikkis accompanied by pearl-string ear chains (Mattal) that pin securely into hair.', origin: 'Tirunelveli Guild', weight: '36g' }
];

jhimikkiItems.forEach((item, i) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  addP({
    id: `aur-jhm-${(i + 1).toString().padStart(3, '0')}`,
    name: item.name,
    slug,
    category: 'Jhimikki Kammal',
    price: item.price,
    originalPrice: item.orig,
    description: item.desc,
    story: `Engineered with hollow interior domes for 12 hours of ceremonial wear. Includes complimentary medical-grade silicone cushion backings.`,
    styles: ['Traditional', 'South Indian Heritage', 'Bridal'],
    material: 'kemp stone',
    occasions: ['Wedding', 'Festive', 'Puja & Muhurtham'],
    availability: 'in-stock',
    images: getImages('jhimikki', i),
    dimensions: 'Drop length 5.2 cm, Bell Diameter 2.4 cm',
    approxWeight: item.weight,
    isBestseller: i < 5,
    isNewArrival: i >= 12,
    isFeatured: i === 0 || i === 2,
    collectionGroup: 'South Indian Heirlooms',
    rating: Number((4.9 - (i % 2) * 0.1).toFixed(1)),
    reviewsCount: 34 + (i * 4),
    craftDetails: 'Hollow repoussé dome, 24k micron temple gold dip, authentic cabochon kemp inlays.',
    southIndianOrigin: item.origin
  });
});

// 3. MANGA MALAI & KASU MALAI HARAMS (14 products)
const malaiItems = [
  { name: 'Imperial Chettinad Manga Malai Long Haram', price: 46500, orig: 54000, desc: 'Traditional mango-shaped paisley motifs linked in antique 24k gold tone, studded with faceted red kemp cabochons and grand central pendant.', origin: 'Chettinad Heritage Guild', weight: '110g' },
  { name: 'Thanjavur Sacred Lakshmi Kasu Malai', price: 41200, orig: 48000, desc: 'Double-row antique gold coins embossed with Goddess Gajalakshmi, edged with tiny ruby beads and adjustable braided dori.', origin: 'Thanjavur Royal Guild', weight: '98g' },
  { name: 'Madurai Peacock Padakkam Manga Haram', price: 48900, orig: 56500, desc: 'Intricately chased twin peacock locket holding a long cascade of mango elements with hanging pearl bunches.', origin: 'Madurai Sthapathi Guild', weight: '118g' },
  { name: 'Karaikudi Short Manga Malai Choker', price: 34500, orig: 40000, desc: 'Close-collar short version of the auspicious mango necklace, magnificent for layering with a longer Kasu Malai.', origin: 'Karaikudi Heritage Guild', weight: '78g' },
  { name: 'Devakottai Ramar Kasu Malai Heritage Haram', price: 43800, orig: 51000, desc: 'Antique coins featuring Sri Rama Pattabhishekam reliefs bordered by ruby kemp stones and golden pearl clusters.', origin: 'Devakottai Workshop', weight: '104g' },
  { name: 'Kumbakonam Dual-Tone Mango & Emerald Haram', price: 45200, orig: 52500, desc: 'Alternating emerald green and ruby red kemp stones across hand-linked golden mango pendants.', origin: 'Kumbakonam Goldsmiths', weight: '106g' },
  { name: 'Chidambaram Multi-Layer Kasu Haram', price: 52000, orig: 60000, desc: 'Three cascading tiers of Lakshmi gold coins joined by an imperial filigree yoke plate.', origin: 'Chidambaram Temple Guild', weight: '132g' },
  { name: 'Pudukkottai Guttapusalu Manga Malai', price: 49500, orig: 57000, desc: 'Heavy fringe of clustered basra seed pearls along the bottom rim of a classic antique mango chain.', origin: 'Pudukkottai Karigar House', weight: '122g' },
  { name: 'Chettinad Kaluthuru Royal Bridal Necklace', price: 62000, orig: 72000, desc: 'The most prestigious Chettinad bridal heirloom ornament with solid gold geometric thali pendants and cabochon rubies.', origin: 'Chettinad Royal Atelier', weight: '150g' },
  { name: 'Tirunelveli Temple Sanctum Kasu Haram', price: 39800, orig: 46000, desc: 'Single row of 48 stamped Lakshmi coins on antique brushed gold with red tourmaline accents.', origin: 'Tirunelveli Goldsmiths', weight: '92g' },
  { name: 'Kanadukathan Floral Paisley Long Malai', price: 44200, orig: 51500, desc: 'Delicately carved paisley pods interspersed with golden lotus rosettes and emerald cabochons.', origin: 'Kanadukathan Guild', weight: '102g' },
  { name: 'Nattukottai Grand Muhurtham Suite Haram', price: 58000, orig: 68000, desc: 'Opulent double-sided haram with reversible ruby and emerald kemp stone settings for bridal versatility.', origin: 'Nattukottai Atelier', weight: '142g' },
  { name: 'Salem Antique Matted Kasu Malai', price: 37500, orig: 43500, desc: 'Matte antique gold coins with lightweight hollow pressing for comfortable day-long ceremonial wear.', origin: 'Salem Guild', weight: '86g' },
  { name: 'Coimbatore Kemp Lotus Padakkam Long Malai', price: 47200, orig: 54500, desc: 'Grand blooming lotus medallion suspended from a dual-strand mango chain with pearl droplets.', origin: 'Coimbatore Workshop', weight: '112g' }
];

malaiItems.forEach((item, i) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  addP({
    id: `aur-mal-${(i + 1).toString().padStart(3, '0')}`,
    name: item.name,
    slug,
    category: item.name.includes('Kasu') ? 'Kasu Malai' : 'Manga Malai',
    price: item.price,
    originalPrice: item.orig,
    description: item.desc,
    story: `Worn by generations of South Indian brides during the Muhurtham. Symbol of prosperity, heritage pride, and timeless grace.`,
    styles: ['Traditional', 'South Indian Heritage', 'Bridal'],
    material: 'kemp stone',
    occasions: ['Wedding', 'Festive', 'Puja & Muhurtham'],
    availability: i % 3 === 0 ? 'limited-stock' : 'in-stock',
    images: getImages('manga_malai', i),
    dimensions: 'Length 62 cm (24 inches) with adjustable braided dori, Width 4.2 cm',
    approxWeight: item.weight,
    isBestseller: i < 4,
    isNewArrival: i >= 10,
    isFeatured: i === 0 || i === 8,
    collectionGroup: 'South Indian Heirlooms',
    rating: 5.0,
    reviewsCount: 38 + (i * 6),
    craftDetails: 'Repoussé die-stamped 24k micron temple gold, wax filled cores, authentic kemp rubies.',
    southIndianOrigin: item.origin
  });
});

// 4. SOUTH INDIAN VALAYAL & KADAS (15 products)
const valayalItems = [
  { name: 'Madurai Nagas Gajalakshmi Valayal Bangles (Pair)', price: 28500, orig: 33500, desc: 'Pair of openable antique temple kadas featuring repoussé elephants and Goddess Lakshmi with cabochon rubies.', origin: 'Madurai Sthapathi Guild', weight: '72g' },
  { name: 'Chettinad Ruby Kemp Pachikal Valayal', price: 24800, orig: 29000, desc: 'Square-cut kemp stones embedded in antique gold floral bands with secure screw clasp.', origin: 'Chettinad Heritage Guild', weight: '60g' },
  { name: 'Thanjavur Mayil Peedam Openable Kada', price: 26500, orig: 31000, desc: 'Twin facing peacock heads encrusted with red spinels and antique 24k gold etched plumage.', origin: 'Thanjavur Royal Guild', weight: '65g' },
  { name: 'Karaikudi Filigree Gold Valayal (Set of 4)', price: 32000, orig: 37500, desc: 'Set of four intricate filigree bangles with micro-beaded borders and brushed antique finish.', origin: 'Karaikudi Guild', weight: '84g' },
  { name: 'Kumbakonam Lion Mukha Nagas Kada', price: 29900, orig: 35000, desc: 'Singha mukha facing lion heads symbolising regal courage and sovereign protection.', origin: 'Kumbakonam Goldsmiths', weight: '75g' },
  { name: 'Devakottai Sovereign Coin Valayal', price: 22800, orig: 27000, desc: 'Circular Lakshmi coin links linked along a flexible hinge with antique vermeil dip.', origin: 'Devakottai Workshop', weight: '56g' },
  { name: 'Chidambaram Sacred Temple Bell Valayal', price: 25400, orig: 29800, desc: 'Bangles fringed with hanging miniature gold sound beads that chime softly with movement.', origin: 'Chidambaram Guild', weight: '62g' },
  { name: 'Pudukkottai Broad Bridal Kada', price: 31500, orig: 37000, desc: 'Extra broad 4 cm bridal cuff bracelet hand-chased with sacred temple sanctum scenes.', origin: 'Pudukkottai Atelier', weight: '82g' },
  { name: 'Chettinad Kemp & Emerald Dual Kada', price: 27200, orig: 32000, desc: 'Alternating red and green cabochon gems set into brushed antique 24k gold vermeil.', origin: 'Chettinad Atelier', weight: '68g' },
  { name: 'Tirunelveli Matte Gold Thin Valayal (Set of 6)', price: 29500, orig: 34500, desc: 'Six slim daily wear heirloom bangles designed to be stacked between kadas.', origin: 'Tirunelveli Guild', weight: '74g' },
  { name: 'Kanadukathan Floral Bloom Openable Kada', price: 23900, orig: 28000, desc: 'Raised repoussé blossoms with center-set tourmaline cabochons and concealed spring hinge.', origin: 'Kanadukathan Karigars', weight: '58g' },
  { name: 'Nattukottai Elephant Procession Valayal', price: 33800, orig: 39500, desc: 'Continuous parade of ceremonial temple elephants with raised trunks in antique gold relief.', origin: 'Nattukottai Atelier', weight: '88g' },
  { name: 'Salem Lightweight Daily Kada', price: 18500, orig: 21500, desc: 'Featherlight hollow tube architecture weighing only 38g for effortless luxury wear.', origin: 'Salem Guild', weight: '38g' },
  { name: 'Coimbatore Guttapusalu Pearl Valayal', price: 26800, orig: 31500, desc: 'Lush fringe of tiny seed pearls strung along the outer circumference of a ruby kada.', origin: 'Coimbatore Workshop', weight: '64g' },
  { name: 'Madurai Floral Nagas Screw Kada', price: 28200, orig: 33000, desc: 'Intricate vine carvings with heavy antique screw closure, suitable for wrist size 2.4 to 2.8.', origin: 'Madurai Sthapathi Guild', weight: '70g' }
];

valayalItems.forEach((item, i) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  addP({
    id: `aur-val-${(i + 1).toString().padStart(3, '0')}`,
    name: item.name,
    slug,
    category: 'South Indian Valayal',
    price: item.price,
    originalPrice: item.orig,
    description: item.desc,
    story: `Handcrafted in Madurai and Chettinad using lost-wax repoussé techniques. Finished in 24k matte antique gold tone.`,
    styles: ['Traditional', 'South Indian Heritage', 'Bridal'],
    material: 'kemp stone',
    occasions: ['Wedding', 'Festive', 'Puja & Muhurtham'],
    availability: 'in-stock',
    images: getImages('valayal', i),
    dimensions: 'Internal diameter 60 mm (Size 2.6 standard, openable hinge fits 2.4 to 2.8)',
    approxWeight: item.weight,
    isBestseller: i < 4,
    isNewArrival: i >= 11,
    isFeatured: i === 0 || i === 2,
    collectionGroup: 'South Indian Heirlooms',
    rating: Number((4.8 + (i % 3) * 0.1).toFixed(1)),
    reviewsCount: 22 + (i * 3),
    craftDetails: 'Repoussé carving, 24k micron antique gold wash, concealed side hinge and safety screw.',
    southIndianOrigin: item.origin
  });
});

// 5. VANKI & ODDIYANAM (HIP BELTS & ARMLETS) (10 products)
const vankiItems = [
  { name: 'South Indian Peacock Nagas Vanki Armlet', price: 24500, orig: 28900, desc: 'V-shaped antique temple armlet adorned with facing peacocks, red kemp cabochons, and adjustable gold chain.', origin: 'Madurai Sthapathi Guild', weight: '58g' },
  { name: 'Chettinad Gajalakshmi Oddiyanam Waist Belt', price: 48500, orig: 56000, desc: 'Ornate temple hip belt embossed with Goddess Lakshmi and elephants, edged with hanging pearl clusters.', origin: 'Chettinad Heritage Guild', weight: '128g' },
  { name: 'Thanjavur Mayil Kemp Vanki Armlet', price: 22800, orig: 26800, desc: 'Classic inverted V-curve armlet sculpted in 24k vermeil with hanging pearl droplets.', origin: 'Thanjavur Royal Guild', weight: '52g' },
  { name: 'Karaikudi Floral Kemp Oddiyanam', price: 44200, orig: 51000, desc: 'Flexible interlocking gold panel waist belt with cabochon rubies and floral engravings.', origin: 'Karaikudi Guild', weight: '115g' },
  { name: 'Devakottai Sovereign Coin Vanki', price: 23900, orig: 27800, desc: 'Lakshmi coins linked into an arm band with central kemp peacock crest.', origin: 'Devakottai Workshop', weight: '54g' },
  { name: 'Chidambaram Temple Bell Oddiyanam', price: 51000, orig: 59000, desc: 'Grand bridal hip belt with chiming micro-bell fringes and radiant kemp tourmalines.', origin: 'Chidambaram Guild', weight: '136g' },
  { name: 'Kumbakonam Dual-Peacock Vanki', price: 25800, orig: 30000, desc: 'Deep relief antique gold plumage with emerald and ruby stone highlights.', origin: 'Kumbakonam Sthapathis', weight: '60g' },
  { name: 'Pudukkottai Slim Modern Oddiyanam', price: 38500, orig: 44500, desc: 'Streamlined 2.5 cm width waist belt engineered for comfortable modern silk saree draping.', origin: 'Pudukkottai Atelier', weight: '96g' },
  { name: 'Madurai Serpent Nagas Vanki', price: 26200, orig: 30800, desc: 'Coiled nagas hood design guarding a cabochon ruby center in brushed 24k temple gold.', origin: 'Madurai Guild', weight: '62g' },
  { name: 'Nattukottai Imperial Bridal Oddiyanam Suite', price: 56000, orig: 65000, desc: 'Masterpiece bridal waist ornament with detachable central pendant that doubles as a necklace.', origin: 'Nattukottai Atelier', weight: '148g' }
];

vankiItems.forEach((item, i) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  addP({
    id: `aur-vnk-${(i + 1).toString().padStart(3, '0')}`,
    name: item.name,
    slug,
    category: 'Vanki & Hip Belts',
    price: item.price,
    originalPrice: item.orig,
    description: item.desc,
    story: `Imperial bridal adornments defining South Indian royal majesty. Adjustable sizing fits gracefully over silk saree drapes.`,
    styles: ['Traditional', 'South Indian Heritage', 'Bridal'],
    material: 'kemp stone',
    occasions: ['Wedding', 'Festive', 'Puja & Muhurtham'],
    availability: i % 2 === 0 ? 'limited-stock' : 'in-stock',
    images: getImages('vanki', i),
    dimensions: item.name.includes('Oddiyanam') ? 'Waist adjustable from 26 to 40 inches' : 'Armlet circumference adjustable from 9 to 14 inches',
    approxWeight: item.weight,
    isBestseller: i === 0 || i === 1,
    isNewArrival: i >= 7,
    isFeatured: i === 1,
    collectionGroup: 'South Indian Heirlooms',
    rating: 5.0,
    reviewsCount: 19 + (i * 3),
    craftDetails: 'Repoussé lost-wax casting, 24k micron antique gold wash, adjustable hook clasp.',
    southIndianOrigin: item.origin
  });
});

// 6. KUNDAN & MEENAKARI JEWELLERY (18 products)
const kundanItems = [
  { name: 'Padmavati Kundan Choker Suite', price: 38500, orig: 44000, cat: 'Kundan Jewellery', desc: 'Handcrafted with uncut glass polki and hanging emerald droplets in 22k gold vermeil with Jaipur meenakari reverse.', weight: '76g' },
  { name: 'Meenakari Floral Bloom Kada', price: 18200, orig: 21000, cat: 'Bangles', desc: 'Vibrant Persian green and ivory hand-painted enamelwork bangle with bezel-set polki stones.', weight: '48g' },
  { name: 'Jodha Bai Royal Kundan Necklace', price: 42000, orig: 48000, cat: 'Kundan Jewellery', desc: 'Multi-strand pearl necklace supporting a grand kundan centerpiece with rubellite drops.', weight: '88g' },
  { name: 'Bikaner Imperial Polki Choker', price: 36000, orig: 41500, cat: 'Chokers', desc: 'Bezel set uncut polki with hanging cultured pearls on mint green enameled foil backing.', weight: '72g' },
  { name: 'Rajwada Emerald Drop Kundan Choker', price: 39500, orig: 45000, cat: 'Chokers', desc: 'Deep Colombian green hydro-emerald drops suspended from tiered kundan bars.', weight: '79g' },
  { name: 'Chandrika Meenakari Jhumkas', price: 16500, orig: 19500, cat: 'Jhumkas', desc: 'Reversible peacock meenakari dome earrings with uncut stone flowers and pearl clusters.', weight: '22g' },
  { name: 'Navratan Royal Kundan Haar', price: 49000, orig: 56000, cat: 'Necklaces', desc: 'Nine sacred gemstones set in imperial kundan foil with pearl spacer beads.', weight: '105g' },
  { name: 'Rani Mahal Filigree Kundan Kada', price: 21500, orig: 25000, cat: 'Bangles', desc: 'Openable screw kada with floral polki crests and crimson reverse enamel.', weight: '54g' },
  { name: 'Gulabi Meenakari Lotus Necklace', price: 33500, orig: 38500, cat: 'Necklaces', desc: 'Banaras pink enamel work with uncut stones and freshwater seed pearls.', weight: '66g' },
  { name: 'Udaipur Royal Polki Passa', price: 17800, orig: 21000, cat: 'Kundan Jewellery', desc: 'Bridal side hair adornment with cascading pearl strands and kundan jhumka drop.', weight: '34g' },
  { name: 'Amer Fort Pearl & Kundan Maang Tikka', price: 12500, orig: 15000, cat: 'Kundan Jewellery', desc: 'Circular forehead ornament with multi-tier hanging pearls and uncut polki stones.', weight: '20g' },
  { name: 'Noor Jahan Emerald Kundan Set', price: 54000, orig: 63000, cat: 'Bridal Sets', desc: 'Complete bridal suite including choker, earrings, maang tikka, and matching haathphool.', weight: '145g' },
  { name: 'Maharani Polki Chandbali Earrings', price: 18900, orig: 22000, cat: 'Earrings', desc: 'Crescent moon earrings with layered polki stones and baroque pearl drops.', weight: '26g' },
  { name: 'Jaipur Floral Kundan Ring', price: 9800, orig: 11800, cat: 'Rings', desc: 'Adjustable statement cocktail ring with blooming polki petals and meenakari underside.', weight: '18g' },
  { name: 'Hawa Mahal Lattice Kundan Choker', price: 35000, orig: 40000, cat: 'Chokers', desc: 'Openwork geometric lattice inspired by Rajput palace windows with jade drops.', weight: '70g' },
  { name: 'Sheesh Mahal Mirror Polki Kada', price: 23000, orig: 27000, cat: 'Bangles', desc: 'Reflective mirror stones framed in antique gold vermeil with ruby cluster finials.', weight: '58g' },
  { name: 'Amber Palace Kundan Haar', price: 45000, orig: 52000, cat: 'Necklaces', desc: 'Grand long necklace with alternating pearl and kundan medallions.', weight: '96g' },
  { name: 'Padmini Polki Emerald Choker', price: 42000, orig: 48000, cat: 'Kundan Jewellery', desc: 'Intricately arranged floral uncut-stone motifs linked with natural green jade beads and hanging pearl drops.', weight: '88g' }
];

kundanItems.forEach((item, i) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  addP({
    id: `aur-knd-${(i + 1).toString().padStart(3, '0')}`,
    name: item.name,
    slug,
    category: item.cat,
    price: item.price,
    originalPrice: item.orig,
    description: item.desc,
    story: `Royal heritage craftsmanship originating from the historic ateliers of Jaipur and Bikaner.`,
    styles: ['Traditional', 'Bridal', 'Festive'],
    material: 'gemstone',
    occasions: ['Wedding', 'Festive', 'Party'],
    availability: 'in-stock',
    images: getImages('choker', i),
    dimensions: 'Adjustable luxury sizing with braided gold silk dori',
    approxWeight: item.weight,
    isBestseller: i < 5,
    isNewArrival: i >= 13,
    isFeatured: i === 0 || i === 1,
    collectionGroup: 'Traditional Heritage',
    rating: Number((4.8 + (i % 3) * 0.1).toFixed(1)),
    reviewsCount: 26 + (i * 3),
    craftDetails: '22k gold vermeil, synthetic uncut polki, authentic meenakari reverse enamel.'
  });
});

// 7. RINGS & MINIMAL JEWELLERY (20 products)
const ringsMinimal = [
  { name: 'Vaidehi Kemp Lotus Statement Ring', price: 9200, orig: 11000, cat: 'Rings', desc: 'Blooming lotus crest with red kemp cabochon and adjustable 24k vermeil band.', weight: '14g' },
  { name: 'Surya Mukhi Sunflower Cocktail Ring', price: 10500, orig: 12500, cat: 'Rings', desc: 'Radiant sunburst petals studded with uncut stones and green emerald center.', weight: '16g' },
  { name: 'Mayil Peacock Feather Gold Ring', price: 8800, orig: 10500, cat: 'Rings', desc: 'Engraved peacock plume curling gracefully around the finger with red spinel eye.', weight: '12g' },
  { name: 'Navratna Imperial Royal Ring', price: 12800, orig: 15000, cat: 'Rings', desc: 'Nine planetary gemstones arranged in an auspicious circular mandala.', weight: '18g' },
  { name: 'Chettinad Sovereign Coin Ring', price: 8500, orig: 9900, cat: 'Rings', desc: 'Antique Lakshmi gold coin set in micro-beaded filigree frame.', weight: '11g' },
  { name: 'Nagas Elephant Carved Ring', price: 9600, orig: 11500, cat: 'Rings', desc: 'Deep relief Gajalakshmi elephant motif in 24k matte antique gold.', weight: '15g' },
  { name: 'Tara Solitaire Polki Gold Ring', price: 7900, orig: 9200, cat: 'Rings', desc: 'Single uncut polki diamond replica held in delicate kundan prongs.', weight: '9g' },
  { name: 'Chandrika Crescent Pearl Ring', price: 8200, orig: 9800, cat: 'Rings', desc: 'Crescent moon motif with basra seed pearls and red tourmaline.', weight: '10g' },
  { name: 'Ananya Minimal Gold Studs', price: 6500, orig: 7800, cat: 'Minimal Jewellery', desc: 'Subtle daily wear gold-tone studs with brushed matte finish and secure push backs.', weight: '6g' },
  { name: 'Parijat Petite Pearl Pendant', price: 7200, orig: 8500, cat: 'Minimal Jewellery', desc: 'Single lustrous freshwater drop pearl suspended from a delicate 18k vermeil chain.', weight: '7g' },
  { name: 'Aarohi Dainty Floral Kemp Studs', price: 7800, orig: 9200, cat: 'Minimal Jewellery', desc: 'Everyday red kemp stone stud earrings with hypoallergenic silicone backings.', weight: '8g' },
  { name: 'Sita Featherlight Gold Kada', price: 12500, orig: 14800, cat: 'Minimal Jewellery', desc: 'Minimalist solid cuff bracelet with twisted rope border and tapered ends.', weight: '22g' },
  { name: 'Roshni Petite Polki Pendant Necklace', price: 9400, orig: 11200, cat: 'Minimal Jewellery', desc: 'Uncut stone teardrop pendant on sleek 16-inch golden chain with 2-inch extender.', weight: '10g' },
  { name: 'Leela Slim Stacking Ring Set', price: 8900, orig: 10500, cat: 'Rings', desc: 'Set of three stackable textured gold-tone bands with micro kemp stones.', weight: '11g' },
  { name: 'Kavya Geometric Bar Pendant', price: 8100, orig: 9600, cat: 'Minimal Jewellery', desc: 'Clean architectural bar pendant with engraved temple chevron details.', weight: '8g' },
  { name: 'Maya Delicate Filigree Bangle', price: 14200, orig: 16800, cat: 'Minimal Jewellery', desc: 'Openwork featherlight bangle suitable for desk-to-dinner luxury elegance.', weight: '24g' },
  { name: 'Ishita Minimal Kemp Nose Pin', price: 3400, orig: 4200, cat: 'Minimal Jewellery', desc: 'Traditional South Indian press-on nose pin with radiant single ruby stone.', weight: '3g' },
  { name: 'Divya Dual-Drop Pearl Earrings', price: 8600, orig: 10200, cat: 'Minimal Jewellery', desc: 'Linear drop earrings featuring two graduating freshwater pearls.', weight: '9g' },
  { name: 'Tanvi Sleek Gold Chain with Coin Charm', price: 9800, orig: 11500, cat: 'Minimal Jewellery', desc: 'Dainty paperclip link chain bearing a miniature Lakshmi gold token.', weight: '12g' },
  { name: 'Advika Sculpted Wave Gold Ring', price: 7500, orig: 8800, cat: 'Rings', desc: 'Organic curved wave band crafted in warm 24k brushed gold tone.', weight: '8g' }
];

ringsMinimal.forEach((item, i) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  addP({
    id: `aur-min-${(i + 1).toString().padStart(3, '0')}`,
    name: item.name,
    slug,
    category: item.cat,
    price: item.price,
    originalPrice: item.orig,
    description: item.desc,
    story: `Modern essentials refined with heritage Indian accents. Designed for everyday luxury and effortless grace.`,
    styles: ['Contemporary', 'Everyday'],
    material: 'gold-tone',
    occasions: ['Daily Wear', 'Gifting', 'Party'],
    availability: 'in-stock',
    images: getImages('rings', i),
    dimensions: item.cat === 'Rings' ? 'Adjustable open-end ring shank (Fits sizes 5 to 9)' : 'Standard lightweight sizing',
    approxWeight: item.weight,
    isBestseller: i < 4,
    isNewArrival: i >= 14,
    isFeatured: i === 0 || i === 8,
    collectionGroup: 'Modern Essentials',
    rating: Number((4.7 + (i % 3) * 0.1).toFixed(1)),
    reviewsCount: 18 + (i * 4),
    craftDetails: 'Anti-tarnish 18k-24k gold vermeil, hypoallergenic base, hand-finished polish.'
  });
});

// 8. BRIDAL SUITES & TEMPLE HARAMS (15 products)
const bridalSets = [
  { name: 'Complete Chettinad Muhurtham Bridal Suite', price: 98000, orig: 115000, desc: 'Masterpiece 7-piece wedding set: Kemp Attigai Choker, Manga Malai Haram, Thanjavur Jhimikkis, Nagas Kadas (Pair), and Vanki armlet.', weight: '340g' },
  { name: 'Imperial Chidambaram Temple Bridal Trousseau', price: 89000, orig: 104000, desc: 'Sacred temple jewellery ensemble including Kasu Malai, layered choker, ear-cuff jhumkas, and Oddiyanam waist belt.', weight: '310g' },
  { name: 'Royal Thanjavur Mayil Heritage Wedding Set', price: 92000, orig: 108000, desc: 'Peacock motif collection: matching choker, long haram, heavy jhimikkis with mattal, and hair brooches.', weight: '325g' },
  { name: 'Devakottai Sovereign Heirloom Bridal Set', price: 85000, orig: 99000, desc: 'Classic Chettinad betrothal suite with repoussé coin jewelry and double-strand kemp necklace.', weight: '290g' },
  { name: 'Madurai Meenakshi Sanctum Trousseau', price: 95000, orig: 112000, desc: 'Antique nagas craft suite featuring elephant bangles, choker, long chain, and hair clips.', weight: '335g' },
  { name: 'Kumbakonam Kemp & Emerald Grand Muhurtham Set', price: 88000, orig: 102000, desc: 'Dual-tone wedding ensemble with ruby and emerald stone layering.', weight: '295g' },
  { name: 'Karaikudi Pearl & Gold Bridal Suite', price: 79000, orig: 92000, desc: 'Guttapusalu style wedding suite with lush pearl clusters and antique gold vermeil.', weight: '275g' },
  { name: 'Pudukkottai Royal Court Bridal Set', price: 82000, orig: 96000, desc: 'Classic South Indian marriage set with matching maang tikka, choker, and haram.', weight: '280g' },
  { name: 'Nattukottai Sovereign Queen Wedding Suite', price: 105000, orig: 125000, desc: 'The ultimate royal bridal suite presented in a velvet-lined rosewood heirloom casket.', weight: '380g' },
  { name: 'Chidambaram Golden Sanctum Temple Set', price: 76000, orig: 89000, desc: 'Compact 4-piece temple suite featuring choker, earrings, kada, and maang tikka.', weight: '240g' },
  { name: 'Tirunelveli Traditional Muhurtham Set', price: 72000, orig: 85000, desc: 'Pure traditional Tamil wedding set with Kasu necklace and jhimikki kammal.', weight: '220g' },
  { name: 'Kanadukathan Bridal Bloom Suite', price: 78000, orig: 91000, desc: 'Floral temple motif set with necklace, earrings, and bangles in 24k vermeil.', weight: '250g' },
  { name: 'Salem Lightweight Wedding Ensemble', price: 64000, orig: 75000, desc: 'Hollow core engineered bridal jewelry providing grand visual scale with half the physical weight.', weight: '185g' },
  { name: 'Coimbatore Heritage Royal Set', price: 81000, orig: 95000, desc: 'Rich antique finish wedding suite with certified micro gold vermeil dip.', weight: '270g' },
  { name: 'Madurai Sthapathi Imperial Crown Suite', price: 99000, orig: 118000, desc: 'Hand-hammered lost-wax masterwork crafted over 120 artisan hours.', weight: '350g' }
];

bridalSets.forEach((item, i) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  addP({
    id: `aur-brd-${(i + 1).toString().padStart(3, '0')}`,
    name: item.name,
    slug,
    category: 'Bridal Sets',
    price: item.price,
    originalPrice: item.orig,
    description: item.desc,
    story: `The pinnacle of South Indian bridal heritage. Includes Certificate of Authenticity and custom velvet jewel chest.`,
    styles: ['Bridal', 'Traditional', 'South Indian Heritage'],
    material: 'kemp stone',
    occasions: ['Wedding', 'Puja & Muhurtham'],
    availability: i % 2 === 0 ? 'limited-stock' : 'in-stock',
    images: getImages('bridal', i),
    dimensions: 'Complete coordinated suite sizing with adjustable dori cords and bangle size choice (2.4 to 2.8)',
    approxWeight: item.weight,
    isBestseller: i < 3,
    isNewArrival: i >= 10,
    isFeatured: i === 0 || i === 1,
    collectionGroup: 'Bridal Couture',
    rating: 5.0,
    reviewsCount: 42 + (i * 7),
    craftDetails: 'Handcrafted by hereditary master sthapathis, 24k micron temple gold, authentic kemp cabochons.'
  });
});

// 9. NECKLACES & PENDANTS (15 products)
const necklaces = [
  { name: 'Gajalakshmi Temple Medallion Pendant', price: 16800, orig: 19800, cat: 'Pendants', desc: 'Embossed Goddess of Wealth medallion framed in pearl tassels on antique gold rope chain.', weight: '32g' },
  { name: 'Thanjavur Mayil Feather Necklace', price: 24500, orig: 28900, cat: 'Necklaces', desc: 'Graduating peacock plume necklace with ruby kemp stones and adjustable silk dori.', weight: '54g' },
  { name: 'Chettinad Lotus Crest Pendant Necklace', price: 18900, orig: 22000, cat: 'Necklaces', desc: 'Blooming lotus medallion suspended from a classic double-strand gold bead chain.', weight: '38g' },
  { name: 'Madurai Elephant Procession Necklace', price: 27500, orig: 32000, cat: 'Necklaces', desc: 'Continuous collar of miniature repoussé elephants in 24k brushed temple gold.', weight: '60g' },
  { name: 'Karaikudi Floral Cluster Pendant', price: 15400, orig: 18200, cat: 'Pendants', desc: 'Intricately arranged ruby kemp blossoms with hanging freshwater pearl drop.', weight: '28g' },
  { name: 'Devakottai Sovereign Coin Pendant', price: 12800, orig: 15200, cat: 'Pendants', desc: 'Authentic temple gold token framed in delicate micro-filigree beads.', weight: '22g' },
  { name: 'Chidambaram Golden Bell Necklace', price: 23200, orig: 27500, cat: 'Necklaces', desc: 'Rhythmic chiming bell pendants linked along an antique vermeil choker.', weight: '48g' },
  { name: 'Kumbakonam Dual-Tone Navaratna Necklace', price: 29800, orig: 35000, cat: 'Necklaces', desc: 'Nine planetary gemstones set into heritage South Indian bezel prongs.', weight: '62g' },
  { name: 'Pudukkottai Guttapusalu Pearl Necklace', price: 26500, orig: 31000, cat: 'Necklaces', desc: 'Lush fringe of tiny seed pearls suspended from a ruby kemp bar necklace.', weight: '56g' },
  { name: 'Tirunelveli Temple Sanctum Pendant', price: 14900, orig: 17500, cat: 'Pendants', desc: 'Architectural temple gopuram outline with centered cabochon emerald.', weight: '26g' },
  { name: 'Kanadukathan Paisley Pod Necklace', price: 21800, orig: 25500, cat: 'Necklaces', desc: 'Alternating mango elements and ruby cabochons on comfortable flexible chain.', weight: '46g' },
  { name: 'Salem Lightweight Daily Temple Necklace', price: 16500, orig: 19500, cat: 'Necklaces', desc: 'Featherlight 28g necklace engineered for elegant puja and everyday occasions.', weight: '28g' },
  { name: 'Coimbatore Antique Gold Medallion', price: 19200, orig: 22800, cat: 'Pendants', desc: 'Heavy brushed circular pendant featuring intricate Vedic geometric mandalas.', weight: '35g' },
  { name: 'Nattukottai Grand Pearl Strand Necklace', price: 31000, orig: 36500, cat: 'Necklaces', desc: 'Five strands of natural rice pearls joined by imperial antique gold side bars.', weight: '68g' },
  { name: 'Madurai Sthapathi Filigree Pendant', price: 17500, orig: 20500, cat: 'Pendants', desc: 'Delicate open-work gold wire filigree with central sparkling red spinel.', weight: '30g' }
];

necklaces.forEach((item, i) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  addP({
    id: `aur-nck-${(i + 1).toString().padStart(3, '0')}`,
    name: item.name,
    slug,
    category: item.cat,
    price: item.price,
    originalPrice: item.orig,
    description: item.desc,
    story: `Handcrafted in Tamil Nadu heritage workshops. Classic South Indian temple goldsmithing at its finest.`,
    styles: ['Traditional', 'South Indian Heritage', 'Festive'],
    material: 'kemp stone',
    occasions: ['Festive', 'Puja & Muhurtham', 'Party'],
    availability: 'in-stock',
    images: getImages('necklace', i),
    dimensions: 'Chain length 45 cm (18 inches) with 5 cm extender cord',
    approxWeight: item.weight,
    isBestseller: i < 4,
    isNewArrival: i >= 11,
    isFeatured: i === 0,
    collectionGroup: 'South Indian Heirlooms',
    rating: Number((4.8 + (i % 3) * 0.1).toFixed(1)),
    reviewsCount: 20 + (i * 4),
    craftDetails: '24k micro gold vermeil, authentic cabochon kemp inlays, hand-strung pearls.'
  });
});

console.log(`Successfully generated ${products.length} products!`);

// Write to src/data/demoProducts.ts
const fileHeader = `import { Product } from '../types';

/**
 * AUREVYA Master Jewellery Catalogue
 * Comprehensive collection of ${products.length} handcrafted South Indian Heirlooms,
 * Chettinad Attigai, Thanjavur Jhimikkis, Manga Malai, Kasu Malai, Nagas Valayal,
 * Kundan & Polki Bridal Suites, and Minimal Fine Jewellery.
 */

export const DEMO_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync('src/data/demoProducts.ts', fileHeader, 'utf-8');
console.log('src/data/demoProducts.ts has been updated successfully!');
