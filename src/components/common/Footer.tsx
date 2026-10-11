import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones, ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newsletterError, setNewsletterError] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !/^\S+@\S+\.\S+$/.test(newsletterEmail)) {
      setNewsletterStatus('error');
      setNewsletterError('Please enter a valid email address.');
      return;
    }

    setNewsletterStatus('success');
    setNewsletterError('');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-white border-t border-[#E8E2D9] text-[#292722] mt-24">
      {/* Trust & Service Highlights */}
      <div className="border-b border-[#E8E2D9] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center sm:text-left">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#EDE4D8]/50 rounded-full shrink-0 text-[#A88955]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide uppercase text-[#292722]">Complimentary Shipping</h4>
                <p className="text-xs text-[#77736B] mt-1">Free insured express shipping across India on orders above ₹4,000.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#EDE4D8]/50 rounded-full shrink-0 text-[#A88955]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide uppercase text-[#292722]">Artisanal Craftsmanship</h4>
                <p className="text-xs text-[#77736B] mt-1">Each jewel is inspected, numbered, and packed in velvet keepsake boxes.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#EDE4D8]/50 rounded-full shrink-0 text-[#A88955]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide uppercase text-[#292722]">7-Day Return Privilege</h4>
                <p className="text-xs text-[#77736B] mt-1">Simple exchange or return for undamaged items in intact security seals.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#EDE4D8]/50 rounded-full shrink-0 text-[#A88955]">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide uppercase text-[#292722]">Dedicated Concierge</h4>
                <p className="text-xs text-[#77736B] mt-1">Personal styling advice and order assistance available Monday to Saturday.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif-luxury text-2xl tracking-[0.25em] uppercase text-[#292722] font-semibold">
              AUREVYA
            </span>
            <p className="text-xs tracking-widest uppercase text-[#A88955] font-medium">
              Tradition, Refined for Today
            </p>
            <p className="text-sm text-[#77736B] leading-relaxed max-w-sm">
              We bridge centuries-old Indian royal ornamentation with modern minimalist grace. Thoughtfully proportioned jewellery designed for everyday poise and life’s grand celebrations.
            </p>
            <div className="text-xs text-[#77736B] pt-2 space-y-1">
              <p>Atelier: Heritage Arts Quarter, Jaipur &bull; Mumbai</p>
              <p>Email: concierge@aurevya.com</p>
            </div>
          </div>

          {/* Quick Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#292722] mb-4">Collections</h4>
            <ul className="space-y-2.5 text-xs text-[#77736B]">
              <li><Link to="/collections/Chokers" className="hover:text-[#A88955] transition-colors">Regal Chokers</Link></li>
              <li><Link to="/collections/Jhumkas" className="hover:text-[#A88955] transition-colors">Heritage Jhumkas</Link></li>
              <li><Link to="/collections/Temple%20Jewellery" className="hover:text-[#A88955] transition-colors">Temple Jewellery</Link></li>
              <li><Link to="/collections/Kundan%20Jewellery" className="hover:text-[#A88955] transition-colors">Kundan & Jadau</Link></li>
              <li><Link to="/collections/Bridal%20Sets" className="hover:text-[#A88955] transition-colors">Bridal Suites</Link></li>
              <li><Link to="/collections/Minimal%20Jewellery" className="hover:text-[#A88955] transition-colors">Minimal Essentials</Link></li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#292722] mb-4">Concierge</h4>
            <ul className="space-y-2.5 text-xs text-[#77736B]">
              <li><Link to="/track-order" className="hover:text-[#A88955] transition-colors">Track Your Order</Link></li>
              <li><Link to="/account" className="hover:text-[#A88955] transition-colors">Order History</Link></li>
              <li><Link to="/wishlist" className="hover:text-[#A88955] transition-colors">Saved Pieces</Link></li>
              <li><Link to="/cart" className="hover:text-[#A88955] transition-colors">Shopping Bag</Link></li>
              <li><a href="#care-instructions" onClick={(e) => { e.preventDefault(); alert('Jewellery Care Guide: Store each piece separately in dry velvet pouches. Avoid contact with perfumes, moisture, and chlorine to maintain luster.'); }} className="hover:text-[#A88955] transition-colors">Jewellery Care Guide</a></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#292722] mb-4">The Atelier Edit</h4>
            <p className="text-xs text-[#77736B] leading-relaxed mb-4">
              Receive private invitations to seasonal edits, artisan notes, and celebratory collections.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (newsletterStatus === 'error') setNewsletterStatus('idle');
                  }}
                  placeholder="Enter your email"
                  aria-label="Newsletter email address"
                  className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs text-[#292722] placeholder-[#77736B] rounded-xs focus:outline-none focus:border-[#A88955]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#A88955] text-white rounded-xs hover:bg-[#8F7241] transition-colors flex items-center justify-center"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {newsletterStatus === 'error' && (
                <p className="text-[11px] text-[#A63D40]">{newsletterError}</p>
              )}

              {newsletterStatus === 'success' && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#3D6847] bg-[#EDE4D8]/30 p-2 rounded-xs">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Welcome to the Atelier circle. (Demo mode confirmed)</span>
                </div>
              )}
            </form>
            <p className="text-[10px] text-[#77736B] mt-2">
              Demonstration mode: Your email is not uploaded to external marketing lists.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#E8E2D9] flex flex-col sm:flex-row items-center justify-between text-xs text-[#77736B] gap-4">
          <p>© {new Date().getFullYear()} AUREVYA Fine Jewellery. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-[#292722]">Crafted in India</span>
            <span>&bull;</span>
            <span className="hover:text-[#292722]">Light Theme Luxury Edition</span>
            <span>&bull;</span>
            <span className="hover:text-[#292722]">Demo Portfolio Store</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
