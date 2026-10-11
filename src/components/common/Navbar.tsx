import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  User,
  Headphones,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useSupport } from '../../context/SupportContext';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { totalItemCount } = useCart();
  const { totalWishlistCount } = useWishlist();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { openSupport } = useSupport();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Clean, proper navigation links including Home
  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'All Jewellery', to: '/collections' },
    { label: 'South Indian', to: '/collections?style=south+indian+heritage' },
    { label: 'Attigai', to: '/collections/Attigai' },
    { label: 'Jhimikkis', to: '/collections/Jhimikki%20Kammal' },
    { label: 'Harams', to: '/collections/Manga%20Malai' },
    { label: 'Valayal', to: '/collections/South%20Indian%20Valayal' },
    { label: 'Bridal', to: '/collections/Bridal%20Sets' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF5EB]/98 backdrop-blur-md border-b border-[#E8E2D9] shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TIER 1: BRAND WORDMARK & ESSENTIAL UTILITIES */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Mobile Menu Toggle & Desktop Subtle Tagline */}
          <div className="flex items-center w-1/4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden text-[#292722] hover:text-[#A88955] transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <span className="hidden lg:inline text-[10px] uppercase tracking-[0.25em] text-[#77736B] font-light">
              South Indian Royal Atelier
            </span>
          </div>

          {/* Center: Brand Wordmark (Regal & Balanced) */}
          <div className="text-center w-2/4 flex justify-center">
            <Link to="/" className="inline-block group focus:outline-none text-center">
              <span className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl tracking-[0.25em] uppercase text-[#292722] font-light group-hover:text-[#A88955] transition-colors block">
                AUREVYA
              </span>
              <span className="block text-[8px] sm:text-[9px] tracking-[0.35em] uppercase text-[#A88955] -mt-1 font-medium">
                Tradition, Refined
              </span>
            </Link>
          </div>

          {/* Right: Minimal Essential Icons */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-3 w-1/4">
            
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#292722] hover:text-[#A88955] transition-colors focus:outline-none"
              aria-label="Search catalogue"
              title="Search"
            >
              <Search className="w-4 h-4 stroke-[1.5]" />
            </button>

            {/* Atelier Concierge */}
            <button
              onClick={() => openSupport()}
              className="p-2 text-[#292722] hover:text-[#A88955] transition-colors focus:outline-none hidden sm:block"
              aria-label="Atelier concierge"
              title="Atelier Concierge"
            >
              <Headphones className="w-4 h-4 stroke-[1.5]" />
            </button>

            {/* User Account */}
            {isAuthenticated ? (
              <Link
                to="/account"
                className="p-2 text-[#292722] hover:text-[#A88955] transition-colors focus:outline-none relative"
                aria-label={`Account of ${user?.fullName || 'Patron'}`}
                title="My Account"
              >
                <User className="w-4 h-4 stroke-[1.5]" />
                <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="p-2 text-[#292722] hover:text-[#A88955] transition-colors focus:outline-none"
                aria-label="Sign In"
                title="Sign In"
              >
                <User className="w-4 h-4 stroke-[1.5]" />
              </button>
            )}

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 text-[#292722] hover:text-[#A88955] transition-colors focus:outline-none relative"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="w-4 h-4 stroke-[1.5]" />
              {totalWishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#A88955] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-medium">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag */}
            <Link
              to="/cart"
              className="p-2 text-[#292722] hover:text-[#A88955] transition-colors focus:outline-none relative"
              aria-label="Shopping bag"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
              {totalItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#292722] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-medium">
                  {totalItemCount}
                </span>
              )}
            </Link>
          </div>

        </div>

        {/* TIER 2: CENTERED CLEAN NAVIGATION BAR WITH HOME BUTTON (DESKTOP) */}
        <div className="hidden lg:block border-t border-[#E8E2D9]/70 py-2.5">
          <nav className="flex items-center justify-center space-x-6 xl:space-x-9 overflow-x-auto scrollbar-none whitespace-nowrap px-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-[0.2em] transition-all py-1 shrink-0 relative ${
                    isActive
                      ? 'text-[#292722] font-semibold'
                      : 'text-[#615C52] hover:text-[#292722] font-normal'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A88955] rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Minimal Expandable Search Drawer */}
        {searchOpen && (
          <div className="py-3 border-t border-[#E8E2D9] animate-in fade-in duration-200">
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search attigai, jhimikki, haram, bridal..."
                autoFocus
                className="w-full bg-white border border-[#E8E2D9] py-2 pl-10 pr-20 text-xs text-[#292722] placeholder-[#77736B] rounded-full focus:outline-none focus:border-[#A88955] shadow-xs"
              />
              <Search className="w-3.5 h-3.5 text-[#77736B] absolute left-3.5 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1 bg-[#A88955] text-white text-[10px] uppercase tracking-wider rounded-full hover:bg-[#8F7241] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Clean Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#292722]/50 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-[#FAF5EB] h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9]">
              <div>
                <span className="font-serif-luxury text-2xl tracking-[0.2em] uppercase text-[#292722] font-light">
                  AUREVYA
                </span>
                <p className="text-[9px] tracking-widest text-[#A88955] uppercase font-medium">
                  Tradition, Refined
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-[#292722] hover:text-[#A88955]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4 space-y-1 overflow-y-auto">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block text-xs uppercase tracking-[0.2em] py-3 border-b border-[#E8E2D9]/40 ${
                      isActive
                        ? 'text-[#A88955] font-semibold'
                        : 'text-[#292722] hover:text-[#A88955] font-normal'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="pt-4 space-y-2">
                <Link
                  to="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-wider text-[#77736B] hover:text-[#292722] py-1.5"
                >
                  Track Order
                </Link>
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-wider text-[#77736B] hover:text-[#292722] py-1.5"
                >
                  My Account
                </Link>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E2D9] text-[10px] text-[#77736B]">
              <p className="text-[#292722] font-medium">Atelier Concierge</p>
              <p>contact@aurevya.com</p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
