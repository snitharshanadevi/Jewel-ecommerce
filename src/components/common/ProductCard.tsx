import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { formatINR, calculateDiscountPercent } from '../../utils/formatters';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { ImageWithFallback } from './ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<any>(null);

  const images = product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80'];
  const isFavorited = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercent(product.price, product.originalPrice);

  // Auto-cycle through images on hover
  useEffect(() => {
    if (isHovered && images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1600);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrentImageIndex(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, images.length]);

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSelectDot = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentImageIndex(index);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = product.variants?.[0]?.name;
    addToCart(product, 1, defaultVariant);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div
      className="group luxury-card relative flex flex-col h-full bg-white transition-all duration-300 rounded-sm border border-[#E8E2D9] overflow-hidden hover:shadow-lg hover:shadow-[#292722]/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF8F5]">
        <Link to={`/products/${product.slug}`} className="block w-full h-full relative">
          {images.map((imgSrc, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                idx === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
              }`}
            >
              <ImageWithFallback
                src={imgSrc}
                alt={`${product.name} - view ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          ))}
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isBestseller && (
            <span className="bg-[#292722] text-[#F8F6F1] text-[9px] uppercase tracking-widest px-2 py-0.5 font-medium rounded-xs shadow-xs">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#A88955] text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-medium rounded-xs shadow-xs">
              New
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#EDE4D8] text-[#292722] text-[9px] tracking-wider px-1.5 py-0.5 font-semibold rounded-xs shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isFavorited ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs text-[#292722] hover:text-[#A88955] shadow-xs transition-all z-10 focus:outline-none focus:ring-1 focus:ring-[#A88955]"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isFavorited ? 'fill-[#A88955] text-[#A88955]' : 'stroke-[1.5]'
            }`}
          />
        </button>

        {/* Multi-image Navigation Controls on Hover */}
        {images.length > 1 && (
          <>
            {/* Left / Right Quick Arrow Navigation */}
            <div className="hidden lg:flex items-center justify-between absolute inset-x-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <button
                onClick={handlePrevImage}
                aria-label="Previous jewel photo"
                className="p-1 rounded-full bg-white/85 text-stone-800 hover:text-white hover:bg-[#292722] shadow-md transition-all pointer-events-auto opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNextImage}
                aria-label="Next jewel photo"
                className="p-1 rounded-full bg-white/85 text-stone-800 hover:text-white hover:bg-[#292722] shadow-md transition-all pointer-events-auto opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pagination Dots at Bottom Center */}
            <div className="absolute bottom-2.5 left-1/2 -translate-y-0 -translate-x-1/2 flex items-center gap-1.5 z-10 px-2.5 py-1 bg-stone-900/60 backdrop-blur-xs rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              {images.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={(e) => handleSelectDot(e, dotIdx)}
                  onMouseEnter={(e) => handleSelectDot(e, dotIdx)}
                  className={`h-1 rounded-full transition-all ${
                    dotIdx === currentImageIndex
                      ? 'w-4 bg-[#A88955]'
                      : 'w-1.5 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Show jewel photo ${dotIdx + 1}`}
                />
              ))}
            </div>

            {/* Photo Counter Pill in Top Right when Hovered */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-stone-900/60 text-white text-[9px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
              {currentImageIndex + 1} / {images.length} Views
            </div>
          </>
        )}

        {/* Hover Quick Action Overlay for Desktop */}
        <div className="hidden lg:flex absolute inset-x-2 bottom-10 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {onQuickView && (
            <button
              onClick={handleQuickViewClick}
              className="flex-1 py-2 bg-white/95 backdrop-blur-xs text-[#292722] text-[11px] uppercase tracking-wider font-medium border border-[#E8E2D9] hover:bg-[#292722] hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </button>
          )}
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2 bg-[#A88955] text-white text-[11px] uppercase tracking-wider font-medium hover:bg-[#8F7241] transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Bag
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#77736B] mb-1">
            <span className="uppercase tracking-widest">{product.category}</span>
            {product.rating && (
              <div className="flex items-center gap-1 text-[#A88955]">
                <Star className="w-3 h-3 fill-[#A88955]" />
                <span className="text-[11px] font-medium text-[#292722]">{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <Link to={`/products/${product.slug}`} className="block group-hover:text-[#A88955] transition-colors">
            <h3 className="font-serif-luxury text-base font-medium text-[#292722] line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {product.southIndianOrigin ? (
            <p className="text-[10px] text-[#A88955] font-medium mt-0.5 truncate">
              ✦ {product.southIndianOrigin}
            </p>
          ) : (
            <p className="text-[11px] text-[#77736B] line-clamp-1 mt-0.5 font-light">
              {product.material.replace('-', ' ')} &bull; {product.styles.join(', ')}
            </p>
          )}
        </div>

        <div className="pt-3 mt-2 border-t border-[#F0ECE4] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-[#292722]">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#77736B] line-through font-light">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Icon */}
          <button
            onClick={handleQuickAdd}
            className="lg:hidden p-1.5 text-[#292722] hover:text-[#A88955] bg-[#FAF8F5] border border-[#E8E2D9] rounded-xs"
            aria-label={`Add ${product.name} to shopping bag`}
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
