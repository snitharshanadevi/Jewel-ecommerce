import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Tag,
  Copy,
  Check,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShieldCheck,
} from 'lucide-react';

export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  video?: string;
  ctaText: string;
  ctaLink: string;
  startingPrice: string;
  offer?: {
    code?: string;
    label: string;
  };
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'attigai-collection',
    badge: 'CHETTINAD HERITAGE EDIT',
    title: 'Sacred Kemp Attigai',
    subtitle: 'Close-Fitting Temple Chokers in 24k Matte Vermeil',
    image: '/images/chettinad/chettinad_attigai_gold.jpg',
    ctaText: 'Explore Attigai',
    ctaLink: '/collections?category=Attigai',
    startingPrice: '₹18,400',
    offer: {
      code: 'AUREVYA10',
      label: '10% Off with Code',
    },
  },
  {
    id: 'bridal-trousseau',
    badge: 'MUHURTHAM BRIDAL 2026',
    title: 'Imperial Bridal Trousseau',
    subtitle: 'Complete 7-Piece Sacred Adornment for the Tamil Bride',
    image: '/images/ai_jewel_cinematic_showcase.jpg',
    video: '/videos/atelier_craft.webm',
    ctaText: 'Explore Bridal Suites',
    ctaLink: '/collections?category=Bridal+Sets',
    startingPrice: '₹52,000',
    offer: {
      label: 'Free Certified 24K Gold Coin',
    },
  },
  {
    id: 'thanjavur-jhimikkis',
    badge: 'ARTISAN CRAFTED EARWEAR',
    title: 'Thanjavur Mayil Jhimikkis',
    subtitle: 'Dancing Bell Umbrellas with Featherlight Ergonomics',
    image: '/images/chettinad/thanjavur_jhimikki_gold.jpg',
    ctaText: 'Shop Jhimikkis',
    ctaLink: '/collections?category=Jhimikki+Kammal',
    startingPrice: '₹12,800',
    offer: {
      code: 'TRADITION',
      label: 'Save ₹2,500 on 2 Pairs with Code',
    },
  },
  {
    id: 'nagas-valayal',
    badge: 'SACRED TEMPLE GOLDSMITHING',
    title: 'Madurai Nagas Valayal',
    subtitle: 'Deep-Relief Elephant & Floral Repoussé Bangles',
    image: '/images/chettinad/nagas_valayal_gold.jpg',
    ctaText: 'Discover Bangles',
    ctaLink: '/collections?category=South+Indian+Valayal',
    startingPrice: '₹16,500',
    offer: {
      label: 'Insured BlueDart Express Pan-India',
    },
  },
  {
    id: 'chettinad-kaluthuru',
    badge: 'ROYAL ARCHIVE RELEASE',
    title: 'Kaluthuru & Manga Malai',
    subtitle: 'The Crown Heirlooms of Tamil Nadu Aristocracy',
    image: '/images/chettinad/manga_malai_gold.jpg',
    ctaText: 'View Long Harams',
    ctaLink: '/collections?category=Manga+Malai',
    startingPrice: '₹28,500',
    offer: {
      code: 'HEIRLOOM2026',
      label: 'Bespoke Goldsmithing with Code',
    },
  },
  {
    id: 'vanki-oddiyanam',
    badge: 'MASTERPIECE ATELIER',
    title: 'Vanki & Bridal Oddiyanam',
    subtitle: 'Sculpted Inverted-V Armlets & Repoussé Waist Belts',
    image: '/images/chettinad/chettinad_oddiyanam_vanki.jpg',
    ctaText: 'Discover Vanki & Belts',
    ctaLink: '/collections?category=Vanki+%26+Hip+Belts',
    startingPrice: '₹22,000',
    offer: {
      code: 'ROYAL2026',
      label: 'Use Code ROYAL2026 for Custom Sizing',
    },
  },
];

// Display slides with infinite looping clones (last cloned at start, first cloned at end)
const DISPLAY_SLIDES = [
  HERO_SLIDES[HERO_SLIDES.length - 1], // Clone of last slide at index 0
  ...HERO_SLIDES,                      // Real slides at indices 1 to 6
  HERO_SLIDES[0],                      // Clone of first slide at index 7
];

export const HeroCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [progressKey, setProgressKey] = useState(0);

  // Video / Photo toggle mode
  const [mediaMode, setMediaMode] = useState<'carousel' | 'video'>('carousel');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const touchStartXRef = useRef<number | null>(null);
  const SLIDE_DURATION = 3000; // 3 seconds delay

  // Auto-slide effect every 3 seconds (right-to-left swipe)
  useEffect(() => {
    if (isPaused || mediaMode === 'video') return;

    const timer = setInterval(() => {
      handleNextSlide();
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [activeIndex, isPaused, mediaMode, isTransitioning]);

  // Ensure live video starts playing when switching to video mode
  useEffect(() => {
    if (mediaMode === 'video' && videoRef.current) {
      videoRef.current.muted = isVideoMuted;
      videoRef.current.defaultMuted = isVideoMuted;
      videoRef.current.play().catch(() => {});
    }
  }, [mediaMode, isVideoMuted]);

  const handleNextSlide = () => {
    if (!isTransitioning) return;
    setActiveIndex((prev) => prev + 1);
    setProgressKey((prev) => prev + 1);
  };

  const handlePrevSlide = () => {
    if (!isTransitioning) return;
    setActiveIndex((prev) => prev - 1);
    setProgressKey((prev) => prev + 1);
  };

  const handleGoToSlide = (idx: number) => {
    setIsTransitioning(true);
    setActiveIndex(idx + 1);
    setProgressKey((prev) => prev + 1);
  };

  // Infinite loop snap handler on transition completion
  const handleTransitionEnd = () => {
    if (activeIndex >= DISPLAY_SLIDES.length - 1) {
      // Arrived at clone of first slide -> snap back seamlessly to real slide 0 (index 1)
      setIsTransitioning(false);
      setActiveIndex(1);
    } else if (activeIndex <= 0) {
      // Arrived at clone of last slide -> snap back seamlessly to real last slide (index 6)
      setIsTransitioning(false);
      setActiveIndex(HERO_SLIDES.length);
    }
  };

  // Re-enable smooth transition after an instant snap
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play();
        setIsVideoPlaying(true);
      }
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 40) {
      handleNextSlide();
    } else if (diff < -40) {
      handlePrevSlide();
    }
    touchStartXRef.current = null;
  };

  // Active slide index (0 to 5) for counter, dots, and hallmark info
  const currentSlideIndex = (activeIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
  const currentSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-6 sm:pt-4 sm:pb-8">
      
      {/* MINIMAL LUXURY CARD HERO BANNER (TANISHQ STYLE) */}
      <div
        className="relative rounded-2xl sm:rounded-3xl border border-[#E8E2D9] shadow-xl overflow-hidden min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex items-center bg-black select-none group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* 1. SLIDING HORIZONTAL TRACK (RIGHT-TO-LEFT LUXURY SWIPE) */}
        <div
          className="flex w-full h-full min-h-[460px] sm:min-h-[520px] lg:min-h-[560px]"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transition: isTransitioning
              ? 'transform 750ms cubic-bezier(0.22, 1, 0.36, 1)'
              : 'none',
          }}
        >
          {DISPLAY_SLIDES.map((slide, idx) => (
            <div
              key={`${slide.id}-${idx}`}
              className="relative w-full h-full min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] shrink-0 flex items-center bg-black overflow-hidden"
            >
              {/* Slide Background Image or Autoplay Video */}
              {slide.video ? (
                <video
                  src={slide.video}
                  poster={slide.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              ) : (
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading={idx === 1 ? 'eager' : 'lazy'}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              )}

              {/* Vignette Gradients */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent lg:to-black/10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 pointer-events-none" />

              {/* Slide Content */}
              <div className="relative z-20 max-w-xl pl-12 sm:pl-16 lg:pl-20 pr-6 py-10 sm:py-14 text-white space-y-3.5 sm:space-y-4">
                
                {/* Delicate Eyebrow Badge */}
                <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#EAD8B7] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A88955]" />
                  <span>{slide.badge}</span>
                </div>

                {/* Clean, Majestic Serif Title */}
                <div className="space-y-1">
                  <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.08] tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="text-sm sm:text-lg font-serif-luxury text-[#EAD8B7] italic font-light">
                    {slide.subtitle}
                  </p>
                </div>

                {/* Single Clean Gold Action Button + Inline Subtle Offer Tag */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3.5">
                  <Link
                    to={slide.ctaLink}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3 bg-[#A88955] hover:bg-[#8F7241] text-white text-xs uppercase tracking-[0.2em] font-medium transition-all rounded-xs shadow-md self-start"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {slide.offer && (
                    <div className="inline-flex items-center gap-2 text-xs text-stone-300 font-light">
                      <Tag className="w-3 h-3 text-[#EAD8B7] shrink-0" />
                      <span>{slide.offer.label}</span>
                      {slide.offer.code && (
                        <button
                          type="button"
                          onClick={() => handleCopyCode(slide.offer!.code!)}
                          className="px-2 py-0.5 rounded-xs bg-white/15 hover:bg-white/25 border border-[#EAD8B7]/40 text-[10px] font-mono tracking-wider text-[#EAD8B7] transition-all"
                          title="Click to copy coupon code"
                        >
                          {copiedCode === slide.offer.code ? (
                            <span className="text-emerald-300 font-bold">Copied! ✓</span>
                          ) : (
                            'Copy Code'
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* 2. OPTIONAL LIVE FILM VIDEO OVERLAY */}
        {mediaMode === 'video' && (
          <div className="absolute inset-0 z-25 bg-black animate-in fade-in duration-300">
            <video
              ref={videoRef}
              poster="/images/chettinad/chettinad_flatlay_gold.jpg"
              autoPlay
              loop
              muted={isVideoMuted}
              playsInline
              preload="auto"
              className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
            >
              <source src="/videos/atelier_craft.webm" type="video/webm" />
              <source src="https://vjs.zencdn.net/v/oceans.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 pointer-events-none" />

            <div className="absolute left-12 sm:left-16 lg:left-20 bottom-16 sm:bottom-20 z-20 max-w-xl pr-6 text-white space-y-2">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#EAD8B7]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Atelier Documentary</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-4xl font-light">Sacred Goldsmithing & Karigar Precision</h2>
              <p className="text-xs sm:text-sm text-stone-300 font-light">Witness our hereditary sthapathis hand-crafting 24k vermeil heirlooms.</p>
            </div>
          </div>
        )}

        {/* 3. TOP RIGHT FLOATING CONTROLS (MINIMAL & CLEAN) */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-8 z-30 flex items-center gap-2 sm:gap-3">
          {mediaMode === 'video' && (
            <div className="flex items-center gap-1 p-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-full">
              <button
                type="button"
                onClick={toggleVideoMute}
                aria-label={isVideoMuted ? 'Unmute' : 'Mute'}
                className="p-1.5 rounded-full text-white hover:bg-white/20 transition-all"
              >
                {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={toggleVideoPlay}
                aria-label={isVideoPlaying ? 'Pause' : 'Play'}
                className="p-1.5 rounded-full text-white hover:bg-white/20 transition-all"
              >
                {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              </button>
            </div>
          )}

          <div className="inline-flex items-center p-0.5 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-[10px] sm:text-[11px] font-medium text-stone-300">
            <button
              type="button"
              onClick={() => setMediaMode('carousel')}
              className={`px-3 py-1 rounded-full transition-all ${
                mediaMode === 'carousel'
                  ? 'bg-white text-[#292722] font-semibold shadow-xs'
                  : 'hover:text-white'
              }`}
            >
              Stills ({HERO_SLIDES.length})
            </button>
            <button
              type="button"
              onClick={() => setMediaMode('video')}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                mediaMode === 'video'
                  ? 'bg-white text-[#292722] font-semibold shadow-xs'
                  : 'hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Film</span>
            </button>
          </div>

          <div className="hidden sm:inline-flex items-center px-2.5 py-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-xs font-mono font-medium text-stone-200">
            0{currentSlideIndex + 1} / 0{HERO_SLIDES.length}
          </div>
        </div>

        {/* 4. FLOATING PREVIOUS & NEXT CHEVRON BUTTONS ON MARGINS (NO OVERLAP) */}
        <button
          type="button"
          onClick={handlePrevSlide}
          aria-label="Previous banner slide"
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-white hover:text-black text-white border border-white/20 shadow-lg backdrop-blur-md transition-all z-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleNextSlide}
          aria-label="Next banner slide"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-white hover:text-black text-white border border-white/20 shadow-lg backdrop-blur-md transition-all z-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* 5. FLOATING SLIDE INDICATOR DOTS AT BOTTOM (MINIMAL) */}
        <div className="absolute bottom-4 sm:bottom-5 left-12 sm:left-16 right-6 z-30 flex items-center justify-between pointer-events-none">
          
          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleGoToSlide(idx)}
                className={`relative h-1 rounded-full transition-all duration-300 ${
                  idx === currentSlideIndex
                    ? 'w-8 sm:w-12 bg-[#A88955]'
                    : 'w-2 sm:w-3 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              >
                {idx === currentSlideIndex && !isPaused && mediaMode === 'carousel' && (
                  <span
                    key={progressKey}
                    className="absolute inset-0 bg-[#EAD8B7] rounded-full animate-progress"
                    style={{
                      animation: `heroProgress ${SLIDE_DURATION}ms linear infinite`,
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-stone-300 font-light">
            <ShieldCheck className="w-3 h-3 text-[#EAD8B7]" />
            <span>916 BIS Certified Vermeil &bull; From {currentSlide.startingPrice}</span>
          </div>

        </div>

      </div>

    </section>
  );
};
