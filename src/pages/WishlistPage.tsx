import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const WishlistPage: React.FC = () => {
  const { wishlistItems, removeFromWishlist, moveToCart, clearWishlist } = useWishlist();

  const breadcrumbs = [{ label: 'Wishlist' }];

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={breadcrumbs} />
        <div className="max-w-xl mx-auto text-center py-20 px-4 bg-white border border-[#E8E2D9] rounded-xs shadow-xs my-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#EDE4D8]/50 rounded-full flex items-center justify-center text-[#A88955]">
            <Heart className="w-8 h-8 stroke-1" />
          </div>
          <h1 className="font-serif-luxury text-3xl font-light text-[#292722]">
            Your Wishlist is Empty
          </h1>
          <p className="text-xs sm:text-sm text-[#77736B] mt-2 mb-8 max-w-sm mx-auto font-light">
            Keep track of heirloom jewels and delicate accents you love. Tap the heart icon on any piece to save it here.
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#A88955] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#8F7241] transition-colors rounded-xs shadow-xs"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex items-center justify-between pb-6 border-b border-[#E8E2D9] mb-8">
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#292722] font-light">
            Saved Jewellery ({wishlistItems.length})
          </h1>
          <p className="text-xs text-[#77736B] mt-1">
            Curated pieces reserved for your upcoming celebrations.
          </p>
        </div>

        <button
          onClick={clearWishlist}
          className="text-xs text-[#77736B] hover:text-[#A63D40] transition-colors uppercase tracking-wider"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map(({ product }) => (
          <div
            key={product.id}
            className="luxury-card relative flex flex-col bg-white border border-[#E8E2D9] rounded-xs overflow-hidden"
          >
            <div className="aspect-square relative overflow-hidden bg-[#FAF8F5]">
              <Link to={`/products/${product.slug}`}>
                <ImageWithFallback
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2.5 right-2.5 p-2 bg-white/90 backdrop-blur-xs text-[#77736B] hover:text-[#A63D40] rounded-full shadow-xs transition-colors"
                aria-label={`Remove ${product.name} from wishlist`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#A88955] font-semibold mb-1">
                  {product.category}
                </p>
                <Link to={`/products/${product.slug}`}>
                  <h3 className="font-serif-luxury text-base font-medium text-[#292722] hover:text-[#A88955] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs font-semibold text-[#292722] mt-1">
                  {formatINR(product.price)}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-[#F0ECE4]">
                <button
                  onClick={() => moveToCart(product)}
                  className="w-full py-2.5 bg-[#A88955] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#8F7241] transition-colors flex items-center justify-center gap-2 rounded-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Move to Shopping Bag
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
