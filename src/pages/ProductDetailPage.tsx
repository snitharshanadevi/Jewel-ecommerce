import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  CheckCircle2,
  Sparkles,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { DEMO_PRODUCTS } from '../data/demoProducts';
import { formatINR, calculateDiscountPercent } from '../utils/formatters';
import { checkPincodeDelivery, PincodeCheckResult } from '../utils/pincodeChecker';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSupport } from '../context/SupportContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductCard } from '../components/common/ProductCard';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

const RECENTLY_VIEWED_KEY = 'aurevya_recent_viewed_v1';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openSupport } = useSupport();

  const product = DEMO_PRODUCTS.find((p) => p.slug === slug);

  // States
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState<PincodeCheckResult | null>(null);
  const [activeTab, setActiveTab] = useState<'craft' | 'shipping' | 'care'>('craft');
  const [recentlyViewed, setRecentlyViewed] = useState<typeof DEMO_PRODUCTS>([]);

  // Initialize selected image & variant
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]);
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0].name);
      } else {
        setSelectedVariant(undefined);
      }
      setQuantity(1);
      setPincodeResult(null);

      // Track recently viewed
      try {
        const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
        let list: string[] = stored ? JSON.parse(stored) : [];
        list = [product.id, ...list.filter((id) => id !== product.id)].slice(0, 5);
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));

        const recentItems = DEMO_PRODUCTS.filter(
          (p) => list.includes(p.id) && p.id !== product.id
        );
        setRecentlyViewed(recentItems);
      } catch (e) {
        console.error('Error tracking recently viewed', e);
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif-luxury text-3xl text-[#292722]">Jewel Not Found</h2>
        <p className="text-xs text-[#77736B] mt-2 mb-6">
          The requested jewellery creation may have been archived or relocated.
        </p>
        <Link
          to="/collections"
          className="px-6 py-3 bg-[#A88955] text-white text-xs uppercase tracking-widest font-semibold"
        >
          Explore All Jewellery
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercent(product.price, product.originalPrice);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    navigate('/checkout');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeInput.trim()) {
      const result = checkPincodeDelivery(pincodeInput);
      setPincodeResult(result);
    }
  };

  // Related products from same category or same collection group
  const relatedProducts = DEMO_PRODUCTS.filter(
    (p) => (p.category === product.category || p.collectionGroup === product.collectionGroup) && p.id !== product.id
  ).slice(0, 4);

  const breadcrumbs = [
    { label: 'Collections', to: '/collections' },
    { label: product.category, to: `/collections/${encodeURIComponent(product.category)}` },
    { label: product.name },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={breadcrumbs} />

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4">
        {/* Gallery Column (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full bg-[#FAF8F5] border border-[#E8E2D9] overflow-hidden rounded-xs">
            <ImageWithFallback
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {product.isBestseller && (
                <span className="bg-[#292722] text-[#F8F6F1] text-[10px] uppercase tracking-widest px-2.5 py-1 font-medium rounded-xs">
                  Bestseller
                </span>
              )}
              {product.isNewArrival && (
                <span className="bg-[#A88955] text-white text-[10px] uppercase tracking-widest px-2.5 py-1 font-medium rounded-xs">
                  New Arrival
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-[#EDE4D8] text-[#292722] text-[10px] tracking-wider px-2 py-0.5 font-bold rounded-xs">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-xs text-[#292722] hover:text-[#A88955] shadow-sm transition-all focus:outline-none"
              aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart
                className={`w-5 h-5 ${isFavorited ? 'fill-[#A88955] text-[#A88955]' : 'stroke-[1.5]'}`}
              />
            </button>
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex flex-wrap gap-3 pt-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 bg-white border rounded-xs overflow-hidden transition-all ${
                    selectedImage === img
                      ? 'border-[#A88955] ring-2 ring-[#A88955]/30 shadow-xs'
                      : 'border-[#E8E2D9] hover:border-[#A88955] opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information Column (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-[#77736B] uppercase tracking-[0.2em] mb-1">
              <span>{product.category}</span>
              <span className="text-[#A88955] font-medium">{product.availability.replace('-', ' ')}</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#292722] leading-tight">
              {product.name}
            </h1>

            {product.southIndianOrigin && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 bg-[#EDE4D8]/50 border border-[#E8E2D9] rounded-xs text-[11px] text-[#A88955] font-medium">
                <Sparkles className="w-3 h-3" />
                <span>Heirloom Origin: {product.southIndianOrigin}</span>
              </div>
            )}

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 mt-2 text-xs text-[#77736B]">
              <div className="flex items-center gap-1 text-[#A88955]">
                <Star className="w-4 h-4 fill-[#A88955]" />
                <span className="font-bold text-[#292722]">{product.rating.toFixed(1)}</span>
              </div>
              <span>&bull;</span>
              <span>{product.reviewsCount} verified atelier ratings</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-white border border-[#E8E2D9] rounded-xs">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#292722]">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-[#77736B] line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs bg-[#EDE4D8] text-[#292722] px-2 py-0.5 font-semibold rounded-xs">
                  Save {formatINR(product.originalPrice! - product.price)} ({discountPercent}%)
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#77736B] mt-1">
              Inclusive of all taxes &bull; Complimentary insured delivery
            </p>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#77736B] leading-relaxed font-light">
            {product.description}
          </p>

          {/* Variant Selection if available */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="uppercase tracking-wider font-semibold text-[#292722]">
                  Select {product.variants[0].type.toUpperCase()}:
                </span>
                <span className="text-[#77736B]">{selectedVariant}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.name)}
                    className={`text-xs px-4 py-2 border rounded-xs transition-all ${
                      selectedVariant === v.name
                        ? 'border-[#A88955] bg-[#FAF8F5] text-[#292722] font-semibold ring-1 ring-[#A88955]'
                        : 'border-[#E8E2D9] text-[#77736B] hover:border-[#A88955]'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#292722]">
                Quantity:
              </span>
              <div className="flex items-center border border-[#E8E2D9] bg-white rounded-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 text-sm text-[#292722] hover:bg-[#FAF8F5]"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-semibold text-[#292722] min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="px-3.5 py-1.5 text-sm text-[#292722] hover:bg-[#FAF8F5]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-[#A88955] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#8F7241] transition-colors flex items-center justify-center gap-2 shadow-xs rounded-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 bg-[#292722] text-[#F8F6F1] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-xs rounded-xs"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Atelier Concierge & Video Styling Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => openSupport({ prefilledQuery: `I am inquiring about the ${product.name} (Ref: AUR-${product.id.toUpperCase()})` })}
                className="flex-1 py-2.5 px-3 rounded-xl border border-[#E8E2D9] bg-white hover:border-[#A88955] text-stone-800 flex items-center justify-center gap-1.5 transition-colors font-medium shadow-2xs"
              >
                <span>💬 Chat with Stylist on WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => openSupport({ initialTab: 'video', topic: 'South Indian Temple Heirlooms' })}
                className="flex-1 py-2.5 px-3 rounded-xl border border-[#E8E2D9] bg-white hover:border-[#A88955] text-stone-800 flex items-center justify-center gap-1.5 transition-colors font-medium shadow-2xs"
              >
                <span>📹 Book 1-on-1 Video Styling</span>
              </button>
            </div>
          </div>

          {/* Postal Code Delivery Checker (Demo) */}
          <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#292722] flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#A88955]" />
                Estimate Delivery Date
              </span>
              <span className="text-[10px] text-[#A88955] uppercase font-bold tracking-wider">
                Demo Simulator
              </span>
            </div>

            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value)}
                placeholder="Enter 6-digit PIN code (e.g. 110001, 400001)"
                maxLength={6}
                className="flex-1 bg-white border border-[#E8E2D9] px-3 py-2 text-xs text-[#292722] rounded-xs focus:outline-none focus:border-[#A88955]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white border border-[#292722] text-[#292722] text-xs uppercase tracking-wider font-semibold hover:bg-[#292722] hover:text-white transition-colors rounded-xs"
              >
                Check
              </button>
            </form>

            {pincodeResult && (
              <div
                className={`text-xs p-2.5 rounded-xs ${
                  pincodeResult.isValid
                    ? 'bg-[#3D6847]/10 text-[#3D6847] border border-[#3D6847]/20'
                    : 'bg-[#A63D40]/10 text-[#A63D40] border border-[#A63D40]/20'
                }`}
              >
                <p className="font-medium">{pincodeResult.message}</p>
              </div>
            )}
          </div>

          {/* Atelier Specs & Tabs */}
          <div className="border-t border-[#E8E2D9] pt-6 space-y-4">
            <div className="flex border-b border-[#E8E2D9] text-xs uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('craft')}
                className={`pb-2 px-3 font-semibold transition-colors border-b-2 ${
                  activeTab === 'craft'
                    ? 'border-[#A88955] text-[#292722]'
                    : 'border-transparent text-[#77736B] hover:text-[#292722]'
                }`}
              >
                Craft & Dimensions
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-2 px-3 font-semibold transition-colors border-b-2 ${
                  activeTab === 'shipping'
                    ? 'border-[#A88955] text-[#292722]'
                    : 'border-transparent text-[#77736B] hover:text-[#292722]'
                }`}
              >
                Shipping & Returns
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-2 px-3 font-semibold transition-colors border-b-2 ${
                  activeTab === 'care'
                    ? 'border-[#A88955] text-[#292722]'
                    : 'border-transparent text-[#77736B] hover:text-[#292722]'
                }`}
              >
                Jewellery Care
              </button>
            </div>

            <div className="text-xs text-[#77736B] leading-relaxed pt-2">
              {activeTab === 'craft' && (
                <div className="space-y-2">
                  <p>
                    <strong className="text-[#292722]">Material & Polish:</strong>{' '}
                    {product.material.replace('-', ' ')} with durable protective finish.
                  </p>
                  {product.dimensions && (
                    <p>
                      <strong className="text-[#292722]">Dimensions:</strong> {product.dimensions}
                    </p>
                  )}
                  {product.approxWeight && (
                    <p>
                      <strong className="text-[#292722]">Approximate Weight:</strong>{' '}
                      {product.approxWeight}
                    </p>
                  )}
                  {product.craftDetails && (
                    <p>
                      <strong className="text-[#292722]">Artisan Notes:</strong>{' '}
                      {product.craftDetails}
                    </p>
                  )}
                  <p className="text-[11px] text-[#77736B]/80 italic pt-1">
                    *Sample weights and dimensions are indicative handcrafted estimates.
                  </p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-2">
                  <p>
                    <strong>Delivery:</strong> Dispatched in 24-48 business hours via insured courier.
                  </p>
                  <p>
                    <strong>Packaging:</strong> Arrives in signature velvet jewel box with wax seal.
                  </p>
                  <p>
                    <strong>Returns:</strong> 7-day hassle-free privilege for items in unworn condition with intact security tags.
                  </p>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-2">
                  <p>Store your jewel individually in the provided soft pouch.</p>
                  <p>Keep away from moisture, hairspray, perfumes, and direct chemicals.</p>
                  <p>Gently wipe with a soft microfiber cloth after wear to preserve luster.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Jewellery Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 pt-12 border-t border-[#E8E2D9]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#A88955] font-semibold">
              Complementary Pieces
            </span>
            <h2 className="font-serif-luxury text-3xl font-light text-[#292722] mt-1">
              Complete Your Suite
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#E8E2D9]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif-luxury text-2xl font-light text-[#292722]">
              Recently Viewed
            </h2>
            <Link to="/collections" className="text-xs text-[#A88955] hover:underline uppercase tracking-wider">
              Browse More
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {recentlyViewed.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
