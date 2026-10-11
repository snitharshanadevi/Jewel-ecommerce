import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnnouncementBar } from '../common/AnnouncementBar';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { AuthModal } from '../common/AuthModal';
import { SupportPanel } from '../common/SupportPanel';
import { AiJewelleryAssistant } from '../common/AiJewelleryAssistant';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF5EB] text-[#292722]">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />

      {/* Global Modals & Concierge Drawers */}
      <AuthModal />
      <SupportPanel />
      <AiJewelleryAssistant />
    </div>
  );
};
