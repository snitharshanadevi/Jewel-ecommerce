import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { formatINR, calculateDiscountPercent } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ImageWithFallback } from './ImageWithFallback';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product?.variants?.[0]?.name
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product ? product.images[0] : '');

  // Reset state when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.[0]?.name);
      setQuantity(1);
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  // Handle Escape key and body scroll locking
  React.useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const discountPercent = calculateDiscountPercent(product.price, product.originalPrice);
  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#292722]/50 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-3xl border border-[#E8E2D9] shadow-2xl rounded-xs overflow-hidden animate-in fade-in zoom-in-95 duration-200 cursor-default"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#77736B] hover:text-[#292722] bg-white/80 rounded-full transition-colors focus:outline-none"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Images */}
          <div className="p-6 bg-[#FAF8F5] flex flex-col items-center justify-center">
            <div className="w-full aspect-square overflow-hidden bg-white border border-[#E8E2D9] mb-3">
              <ImageWithFallback
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 border overflow-hidden ${
                      selectedImage === img ? 'border-[#A88955] ring-1 ring-[#A88955]' : 'border-[#E8E2D9]'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#A88955] font-semibold mb-1">
                {product.category}
              </p>
              <h2 id="quick-view-title" className="font-serif-luxury text-2xl font-medium text-[#292722] mb-2 leading-tight">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xl font-bold text-[#292722]">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#77736B] line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs bg-[#EDE4D8] text-[#292722] px-2 py-0.5 font-semibold rounded-xs">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <p className="text-xs text-[#77736B] leading-relaxed line-clamp-3 mb-4">
                {product.description}
              </p>

              {/* Variants if any */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs uppercase tracking-wider text-[#292722] font-semibold mb-2">
                    Select {product.variants[0].type.toUpperCase()}:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v.name)}
                        className={`text-xs px-3 py-1.5 border transition-all ${
                          selectedVariant === v.name
                            ? 'border-[#A88955] bg-[#FAF5EB] text-[#292722] font-semibold ring-1 ring-[#A88955]'
                            : 'border-[#E8E2D9] text-[#77736B] hover:border-[#A88955]'
                        }`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6 flex items-center gap-3">
                <label className="text-xs uppercase tracking-wider text-[#292722] font-semibold">
                  Qty:
                </label>
                <div className="flex items-center border border-[#E8E2D9] bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm text-[#292722] hover:bg-[#FAF8F5]"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold text-[#292722] min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="px-3 py-1 text-sm text-[#292722] hover:bg-[#FAF8F5]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-[#A88955] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#8F7241] transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Shopping Bag
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-3 border border-[#E8E2D9] text-[#292722] hover:text-[#A88955] hover:border-[#A88955] transition-colors"
                  aria-label="Wishlist toggle"
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorited ? 'fill-[#A88955] text-[#A88955]' : ''}`}
                  />
                </button>
              </div>

              <Link
                to={`/products/${product.slug}`}
                onClick={onClose}
                className="w-full text-center py-2 text-xs uppercase tracking-wider text-[#77736B] hover:text-[#292722] flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Full Atelier Details & Dimensions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
