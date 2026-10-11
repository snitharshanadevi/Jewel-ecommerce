import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const MESSAGES = [
  {
    text: 'Complimentary Insured Pan-India Express Delivery on All Orders',
    link: '/track-order',
  },
  {
    text: 'Muhurtham Edit: Use Code AUREVYA10 for 10% Off Wedding Heirlooms',
    link: '/collections?category=Attigai',
  },
  {
    text: 'Thanjavur Jhimikkis: Save ₹2,500 on 2 Pairs with Code TRADITION',
    link: '/collections?category=Jhimikki%20Kammal',
  },
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const message = MESSAGES[currentIndex];

  return (
    <div className="bg-[#292722] text-[#F8F6F1] py-1.5 px-4 text-center transition-all select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[11px] sm:text-xs tracking-wider uppercase font-light">
        <Sparkles className="w-3 h-3 text-[#CBB27E] shrink-0" />
        <Link
          to={message.link}
          className="hover:text-[#CBB27E] transition-colors truncate"
        >
          {message.text}
        </Link>
      </div>
    </div>
  );
};
