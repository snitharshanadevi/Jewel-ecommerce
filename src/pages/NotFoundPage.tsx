import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Breadcrumbs items={[{ label: '404 - Page Not Found' }]} />

      <div className="max-w-xl mx-auto text-center py-20 px-6 bg-white border border-[#E8E2D9] rounded-xs shadow-xs my-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#EDE4D8]/50 rounded-full flex items-center justify-center text-[#A88955]">
          <Compass className="w-8 h-8 stroke-1" />
        </div>

        <span className="text-[11px] uppercase tracking-[0.25em] text-[#A88955] font-semibold">
          Error 404 &bull; Page Not Found
        </span>

        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#292722] font-light mt-1 mb-3">
          This Creation Has Moved
        </h1>

        <p className="text-xs sm:text-sm text-[#77736B] leading-relaxed max-w-md mx-auto mb-8 font-light">
          The page you are looking for may have been archived, renamed, or is temporarily unavailable in our atelier.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#A88955] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#8F7241] transition-colors rounded-xs shadow-xs"
          >
            Return to Home
          </Link>

          <Link
            to="/collections"
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-[#E8E2D9] text-[#292722] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#FAF8F5] transition-colors rounded-xs flex items-center justify-center gap-2"
          >
            <span>Explore Jewellery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
