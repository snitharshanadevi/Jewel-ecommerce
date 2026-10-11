import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Minimize2,
  Sun,
  Flame,
  Lamp,
  ShoppingBag,
  Eye,
  Check,
  ChevronRight,
  Info,
  X,
  Layers,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { DEMO_PRODUCTS } from '../../data/demoProducts';
import { Product } from '../../types';
import { formatINR } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

interface AiJewelShowcaseVideoProps {
  onQuickView?: (product: Product) => void;
}

type LightingMode = 'temple' | 'daylight' | 'candlelight';

interface HotspotItem {
  id: string;
  productId: string;
  label: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  category: string;
  hallmark: string;
  image: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
}

interface ShowcaseReel {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  type: 'ai-simulation' | 'video';
  mediaSrc: string;
  posterSrc?: string;
  duration: number; // seconds
  prompt: string;
  model: string;
  fps: string;
  resolution: string;
  aspectRatio: string;
  hotspots: HotspotItem[];
}

const SHOWCASE_REELS: ShowcaseReel[] = [
  {
    id: 'chettinad-bride-4k',
    badge: 'AI NEURAL CINEMA 4K',
    title: 'Chettinad Palace Muhurtham Bridal Suite',
    subtitle: '24K Kemp Attigai, Thanjavur Jhimikkis & Kasu Manga Malai in Sacred Temple Light',
    type: 'ai-simulation',
    mediaSrc: '/images/ai_jewel_cinematic_showcase.jpg',
    duration: 15,
    prompt:
      'Ultra-photorealistic 16:9 cinematic commercial frame of a royal South Indian Tamil bride in an opulent crimson Kanjeevaram silk saree adorned with 24k gold Kemp Attigai choker, Thanjavur Jhimikkis, and Manga Malai inside a Chettinad palace temple, soft morning golden hour light cascading through hand-carved granite pillars, photorealistic specular reflections on gemstones, 60fps steadycam gimbal movement.',
    model: 'Aurevya-Diffusion v4.8 (Bridal Heirlooms LORA)',
    fps: '60 FPS Continuous Motion',
    resolution: '3840 × 2160 (4K UHD)',
    aspectRatio: '16:9 Cinema Scope',
    hotspots: [
      {
        id: 'hs-attigai',
        productId: 'aur-att-001',
        label: 'Chettinad Kemp Ruby Attigai',
        subtitle: '24k Micro Vermeil Collar Choker',
        price: 32400,
        originalPrice: 38000,
        category: 'Attigai',
        hallmark: '916 BIS Hallmark • Natural Kemp Inlays',
        image: '/images/chettinad/chettinad_attigai_gold.jpg',
        xPercent: 50.5,
        yPercent: 43.0,
      },
      {
        id: 'hs-jhimikki',
        productId: 'aur-jhm-001',
        label: 'Thanjavur Mayil Jhimikki Kammal',
        subtitle: 'Hollow Bell Umbrellas with Pearl Drops',
        price: 19800,
        originalPrice: 23500,
        category: 'Jhimikki Kammal',
        hallmark: 'Hollow Dome Comfort • Basra Seed Pearls',
        image: '/images/chettinad/thanjavur_jhimikki_gold.jpg',
        xPercent: 64.0,
        yPercent: 32.5,
      },
      {
        id: 'hs-malai',
        productId: 'aur-mal-001',
        label: 'Imperial Manga Malai Long Haram',
        subtitle: 'Auspicious Mango Paisley Motif Garland',
        price: 46500,
        originalPrice: 54000,
        category: 'Manga Malai',
        hallmark: 'Repoussé Gold Core • 24-Inch Muhurtham Drop',
        image: '/images/chettinad/manga_malai_gold.jpg',
        xPercent: 50.0,
        yPercent: 64.0,
      },
    ],
  },
  {
    id: 'macro-kemp-raytrace',
    badge: 'AI MACRO RAYTRACE 4K',
    title: '24K Kemp Attigai Macro Specular Craft',
    subtitle: 'Ultra-Macro Raytracing of Cabochon Rubies, Basra Seed Pearls & Solid Gold Vermeil',
    type: 'ai-simulation',
    mediaSrc: '/images/ai_jewel_macro_gold_craft.jpg',
    duration: 12,
    prompt:
      'Ultra-photorealistic commercial macro frame of handcrafted South Indian traditional 24k micro gold vermeil Kemp Attigai necklace lying on deep royal burgundy velvet, showing hand-cut cabochon red rubies, Basra seed pearls, diamond glints, pristine gold texture, razor-sharp optical depth of field, 100mm macro cine lens.',
    model: 'Neural Optical Raytrace Engine v4.8',
    fps: '60 FPS Macro Pan',
    resolution: '3840 × 2160 (4K UHD)',
    aspectRatio: '16:9 Cinema Scope',
    hotspots: [
      {
        id: 'hs-macro-stones',
        productId: 'aur-att-001',
        label: 'Wax-Backed Kemp Cabochons',
        subtitle: 'Hereditary Temple Gemstone Setting',
        price: 32400,
        originalPrice: 38000,
        category: 'Attigai',
        hallmark: '24k Micro Vermeil Over Brass Alloy',
        image: '/images/ai_jewel_macro_gold_craft.jpg',
        xPercent: 49.0,
        yPercent: 46.5,
      },
      {
        id: 'hs-macro-pearls',
        productId: 'aur-att-003',
        label: 'Basra Pearl Hemming',
        subtitle: 'Hand-Knotted Seed Pearl Fringe',
        price: 36500,
        originalPrice: 42000,
        category: 'Attigai',
        hallmark: 'Double-Tier Interlocking Gold Plates',
        image: '/images/chettinad/chettinad_flatlay_gold.jpg',
        xPercent: 62.0,
        yPercent: 65.0,
      },
    ],
  },
  {
    id: 'atelier-karigar-film',
    badge: 'LIVE 1080P MASTER FILM',
    title: 'Master Karigar Goldsmithing Film',
    subtitle: 'Hereditary Thanjavur Goldsmith Hand-Forging 24K Gold Leaf & Repoussé Motifs',
    type: 'video',
    mediaSrc: '/videos/atelier_craft.webm',
    posterSrc: '/images/ai_jewel_macro_gold_craft.jpg',
    duration: 20,
    prompt:
      'Live documentary cinematography of hereditary South Indian goldsmiths in Chettinad, using heirloom anvil techniques, flame soldering, repoussé leaf chasing, and polishing 24K vermeil.',
    model: 'Sony FX6 Cinema Line • Raw 1080p 60FPS',
    fps: '60 FPS Studio Native',
    resolution: '1920 × 1080 Full HD',
    aspectRatio: '16:9 Wide',
    hotspots: [
      {
        id: 'hs-artisan-frame',
        productId: 'aur-att-001',
        label: 'Hand-Chased Attigai Choker',
        subtitle: 'Master Crafted in Thanjavur Royal Atelier',
        price: 32400,
        originalPrice: 38000,
        category: 'Attigai',
        hallmark: '100% Handcrafted • Lifetime Polish Guarantee',
        image: '/images/chettinad/chettinad_attigai_gold.jpg',
        xPercent: 48.0,
        yPercent: 52.0,
      },
    ],
  },
];

export const AiJewelShowcaseVideo: React.FC<AiJewelShowcaseVideoProps> = ({ onQuickView }) => {
  const { addToCart } = useCart();

  // Active reel state
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const currentReel = SHOWCASE_REELS[activeReelIndex];

  // Playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(true);
  const [lighting, setLighting] = useState<LightingMode>('temple');
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<HotspotItem | null>(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // References
  const containerRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<{ masterGain: GainNode | null; oscList: OscillatorNode[] }>({
    masterGain: null,
    oscList: [],
  });
  const animFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(Date.now());

  // Web Audio Synthesizer: Soothing royal temple tanpura & gold chime drone
  const startAmbientAudio = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Stop previous oscillators if any
      audioNodesRef.current.oscList.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      audioNodesRef.current.oscList = [];

      const ctx = audioContextRef.current;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.5);
      masterGain.connect(ctx.destination);
      audioNodesRef.current.masterGain = masterGain;

      // Create warm harmonic drone (Tanpura C# chord with gentle harmonics: 138.59Hz, 277.18Hz, 415.30Hz)
      const frequencies = [138.59, 207.65, 277.18, 415.3];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle subtle vibrato/lfo
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.2 + idx * 0.1, ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.2, ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        const baseGain = 0.05 / (idx + 1);
        oscGain.gain.setValueAtTime(baseGain, ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();

        audioNodesRef.current.oscList.push(osc);
      });
    } catch {
      // Audio autoplay gracefully handled
    }
  }, []);

  const stopAmbientAudio = useCallback(() => {
    if (audioNodesRef.current.masterGain && audioContextRef.current) {
      const ctx = audioContextRef.current;
      audioNodesRef.current.masterGain.gain.setValueAtTime(
        audioNodesRef.current.masterGain.gain.value,
        ctx.currentTime
      );
      audioNodesRef.current.masterGain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + 0.5
      );
      setTimeout(() => {
        audioNodesRef.current.oscList.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // ignore
          }
        });
        audioNodesRef.current.oscList = [];
      }, 500);
    }
  }, []);

  // Handle Mute / Unmute
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      startAmbientAudio();
      if (videoElementRef.current) {
        videoElementRef.current.muted = false;
      }
    } else {
      setIsMuted(true);
      stopAmbientAudio();
      if (videoElementRef.current) {
        videoElementRef.current.muted = true;
      }
    }
  };

  // Play / Pause toggle
  const togglePlay = () => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (currentReel.type === 'video' && videoElementRef.current) {
        if (next) videoElementRef.current.play();
        else videoElementRef.current.pause();
      }
      return next;
    });
  };

  // Switch Reel
  const handleSelectReel = (index: number) => {
    setActiveReelIndex(index);
    setCurrentTime(0);
    setActiveHotspot(null);
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = 0;
      if (isPlaying) {
        videoElementRef.current.play().catch(() => {});
      }
    }
  };

  // Timeline Scrubber Timer
  useEffect(() => {
    lastTickTimeRef.current = Date.now();

    const interval = setInterval(() => {
      if (!isPlaying) {
        lastTickTimeRef.current = Date.now();
        return;
      }

      const now = Date.now();
      const deltaSec = ((now - lastTickTimeRef.current) / 1000) * playbackSpeed;
      lastTickTimeRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + deltaSec;
        if (next >= currentReel.duration) {
          // Loop current reel smoothly
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, currentReel.duration]);

  // Video element sync when reel is 'video'
  useEffect(() => {
    if (currentReel.type === 'video' && videoElementRef.current) {
      videoElementRef.current.muted = isMuted;
      videoElementRef.current.playbackRate = playbackSpeed;
      if (isPlaying) {
        videoElementRef.current.play().catch(() => {});
      } else {
        videoElementRef.current.pause();
      }
    }
  }, [currentReel.type, isPlaying, isMuted, playbackSpeed]);

  // Canvas particle glints & gold luster animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create 18 jewel glint sparkle particles
    const sparkles = Array.from({ length: 18 }, () => ({
      x: 0.35 * width + Math.random() * 0.35 * width,
      y: 0.25 * height + Math.random() * 0.45 * height,
      size: 1 + Math.random() * 2.5,
      alpha: Math.random(),
      speed: 0.015 + Math.random() * 0.03,
      angle: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isPlaying && currentReel.type === 'ai-simulation') {
        sparkles.forEach((s) => {
          s.alpha += s.speed;
          if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;

          const currentAlpha = Math.max(0, Math.min(1, Math.sin(s.alpha * Math.PI)));
          if (currentAlpha > 0.05) {
            // Draw diamond four-pointed star glint
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(s.angle);

            const glintSize = s.size * (1 + currentAlpha * 1.5);
            ctx.strokeStyle = `rgba(255, 248, 220, ${currentAlpha * 0.85})`;
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(-glintSize * 2, 0);
            ctx.lineTo(glintSize * 2, 0);
            ctx.moveTo(0, -glintSize * 2);
            ctx.lineTo(0, glintSize * 2);
            ctx.stroke();

            // Center glow
            ctx.fillStyle = `rgba(255, 230, 160, ${currentAlpha})`;
            ctx.beginPath();
            ctx.arc(0, 0, glintSize * 0.7, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }
        });
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, currentReel.type]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const s = Math.floor(seconds);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Lighting Filter Styles
  const getLightingStyle = () => {
    switch (lighting) {
      case 'temple':
        return {
          filter: 'sepia(0.20) saturate(1.15) contrast(1.05) brightness(1.02)',
          tintColor: 'rgba(217, 119, 6, 0.08)',
        };
      case 'daylight':
        return {
          filter: 'saturate(1.06) contrast(1.08) brightness(1.04)',
          tintColor: 'rgba(240, 249, 255, 0.03)',
        };
      case 'candlelight':
        return {
          filter: 'sepia(0.38) saturate(1.25) contrast(1.12) brightness(0.96)',
          tintColor: 'rgba(234, 88, 12, 0.12)',
        };
      default:
        return { filter: 'none', tintColor: 'transparent' };
    }
  };

  const lightingStyle = getLightingStyle();

  // Ken Burns Motion Calculation for AI Reels
  const progressPercent = (currentTime / currentReel.duration) * 100;
  // Dynamic scale from 1.03 to 1.14 with slow pan
  const scaleValue = 1.04 + Math.sin((currentTime / currentReel.duration) * Math.PI) * 0.08;
  const panX = Math.sin((currentTime / currentReel.duration) * Math.PI * 2) * 1.5;
  const panY = Math.cos((currentTime / currentReel.duration) * Math.PI * 2) * 1.2;

  // Add to Bag handler
  const handleAddToCart = (item: HotspotItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const product = DEMO_PRODUCTS.find((p) => p.id === item.productId);
    if (product) {
      addToCart(product, 1);
      setAddedProductId(item.id);
      setTimeout(() => setAddedProductId(null), 2500);
    }
  };

  // Trigger Quick View
  const handleQuickView = (item: HotspotItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const product = DEMO_PRODUCTS.find((p) => p.id === item.productId);
    if (product && onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <section className="bg-[#FAF5EB] py-16 sm:py-24 border-y border-[#E8E2D9] relative overflow-hidden">
      {/* Background Subtle Heritage Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#A88955_0.8px,transparent_0.8px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#EDE4D8]/80 border border-[#A88955]/30 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#A88955] font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#A88955] animate-spin-slow" />
            <span>AI Neural Cinema • 4K Adornment Reel</span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-[#292722] leading-tight">
            AI-Generated Sacred Jewellery Showcase
          </h2>

          <p className="text-xs sm:text-sm text-[#77736B] font-light leading-relaxed max-w-2xl mx-auto">
            Experience our 24K Kemp Attigai, Thanjavur Jhimikkis, and Manga Malai rendered in ultra-photorealistic Chettinad palace cinematography. Tap the interactive gold beacons to inspect each heirloom in real time.
          </p>
        </div>

        {/* Master Reel Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
          {SHOWCASE_REELS.map((reel, idx) => {
            const isSelected = activeReelIndex === idx;
            return (
              <button
                key={reel.id}
                onClick={() => handleSelectReel(idx)}
                className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider rounded-xs transition-all ${
                  isSelected
                    ? 'bg-[#292722] text-[#FAF5EB] shadow-md border border-[#292722]'
                    : 'bg-white text-[#5E5A53] hover:text-[#292722] hover:bg-[#FAF8F5] border border-[#E8E2D9]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-[#A88955] animate-ping' : 'bg-[#C2BBB0]'
                  }`}
                />
                <span className="font-medium">{reel.badge}</span>
                <span className="hidden md:inline text-[10px] text-[#A88955] tracking-normal font-normal">
                  ({reel.fps.split(' ')[0]})
                </span>
              </button>
            );
          })}
        </div>

        {/* Video Cinema Container */}
        <div
          ref={containerRef}
          className="relative max-w-5xl mx-auto bg-black rounded-xs overflow-hidden border border-[#D5C9B8] shadow-2xl group select-none"
        >
          {/* Main 16:9 Display Stage */}
          <div className="relative aspect-video w-full bg-[#1A1815] overflow-hidden">
            {/* Visual Media Layer: AI Continuous Simulation OR HTML5 Video */}
            {currentReel.type === 'ai-simulation' ? (
              <div
                className="w-full h-full relative overflow-hidden cursor-pointer"
                onClick={togglePlay}
              >
                <img
                  src={currentReel.mediaSrc}
                  alt={currentReel.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out"
                  style={{
                    transform: isPlaying
                      ? `scale(${scaleValue}) translate(${panX}px, ${panY}px)`
                      : 'scale(1.02)',
                    filter: lightingStyle.filter,
                  }}
                />

                {/* Animated Golden Light Sheen Sweep */}
                {isPlaying && (
                  <div
                    className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-amber-200/15 to-transparent transition-transform duration-1000"
                    style={{
                      transform: `translateX(${(progressPercent - 50) * 2.5}%)`,
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="w-full h-full relative cursor-pointer" onClick={togglePlay}>
                <video
                  ref={videoElementRef}
                  src={currentReel.mediaSrc}
                  poster={currentReel.posterSrc}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ filter: lightingStyle.filter }}
                />
              </div>
            )}

            {/* Tint Overlay for Lighting Simulation */}
            <div
              className="absolute inset-0 pointer-events-none transition-colors duration-500"
              style={{ backgroundColor: lightingStyle.tintColor }}
            />

            {/* Sparkle Glint Canvas Overlay */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            />

            {/* Cinematic Vignette Gradient Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-transparent to-black/40 z-10" />

            {/* TOP BAR HUD: AI Telemetry & Quick Action Badges */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between text-white z-20 pointer-events-auto">
              {/* Left Badge: Live Engine Stats */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/15 text-[10px] sm:text-[11px] font-mono text-[#F4E6C9] tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#A88955] animate-pulse" />
                  <span>{currentReel.badge}</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-xs border border-white/10 text-[9px] uppercase tracking-widest text-white/80">
                  {currentReel.resolution} &bull; {currentReel.fps}
                </span>
              </div>

              {/* Right Utility Buttons */}
              <div className="flex items-center gap-2">
                {/* Hotspot Toggle */}
                <button
                  onClick={() => setShowHotspots(!showHotspots)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider backdrop-blur-md border transition-all ${
                    showHotspots
                      ? 'bg-[#A88955]/30 text-white border-[#A88955]'
                      : 'bg-black/50 text-white/70 border-white/15 hover:text-white'
                  }`}
                  title="Toggle Jewellery Inspection Hotspots"
                >
                  <Eye className="w-3 h-3" />
                  <span className="hidden sm:inline">Pins</span>
                </button>

                {/* AI Prompt Reveal Button */}
                <button
                  onClick={() => setShowPromptModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-[10px] uppercase tracking-wider text-white border border-white/15 hover:border-[#A88955] transition-all"
                  title="View AI Neural Prompt & Diffusion Weights"
                >
                  <Info className="w-3 h-3 text-[#A88955]" />
                  <span className="hidden sm:inline">AI Prompt</span>
                </button>

                {/* Audio Mute/Unmute */}
                <button
                  onClick={toggleMute}
                  className="p-1.5 sm:p-2 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full text-white/90 hover:text-white transition-all border border-white/15"
                  aria-label={isMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
                  title={isMuted ? 'Unmute Ambient Drone' : 'Mute Sound'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#A88955]" />}
                </button>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 sm:p-2 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full text-white/90 hover:text-white transition-all border border-white/15 hidden sm:block"
                  aria-label="Toggle Fullscreen"
                  title="Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Interactive Shoppable Hotspots Layer */}
            {showHotspots &&
              currentReel.hotspots.map((hs) => {
                const isSelected = activeHotspot?.id === hs.id;
                return (
                  <div
                    key={hs.id}
                    className="absolute z-20 transition-all pointer-events-auto"
                    style={{
                      left: `${hs.xPercent}%`,
                      top: `${hs.yPercent}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Glowing Beacon Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(isSelected ? null : hs);
                      }}
                      className="group relative flex items-center justify-center p-2 focus:outline-none"
                      aria-label={`Inspect ${hs.label}`}
                    >
                      {/* Concentric Pulse Rings */}
                      <span className="absolute w-8 h-8 rounded-full bg-[#A88955]/40 animate-ping" />
                      <span className="absolute w-5 h-5 rounded-full bg-[#A88955]/70 animate-pulse" />

                      {/* Center Gold Pin */}
                      <span className="relative w-4 h-4 rounded-full bg-[#FAF5EB] border-2 border-[#A88955] shadow-lg flex items-center justify-center text-[8px] font-bold text-[#292722] group-hover:scale-125 transition-transform">
                        ✦
                      </span>

                      {/* Small floating label pill */}
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:group-hover:flex items-center gap-1 px-2 py-0.5 bg-black/85 backdrop-blur-md border border-[#A88955]/50 rounded-xs text-[10px] text-white whitespace-nowrap shadow-xl">
                        <span>{hs.label}</span>
                        <ChevronRight className="w-3 h-3 text-[#A88955]" />
                      </span>
                    </button>

                    {/* Rich Interactive Popover Card on Click */}
                    {isSelected && (
                      <div
                        className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-64 sm:w-72 bg-[#292722]/95 backdrop-blur-md border border-[#A88955]/40 rounded-xs p-3.5 text-white shadow-2xl z-30 animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/10">
                          <div className="flex items-center gap-2">
                            <img
                              src={hs.image}
                              alt={hs.label}
                              className="w-10 h-10 rounded-xs object-cover border border-[#A88955]/40 bg-black/40"
                            />
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-[#A88955] font-semibold block">
                                {hs.category}
                              </span>
                              <h4 className="font-serif-luxury text-xs sm:text-sm font-medium text-white line-clamp-1">
                                {hs.label}
                              </h4>
                            </div>
                          </div>
                          <button
                            onClick={() => setActiveHotspot(null)}
                            className="text-white/60 hover:text-white p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="py-2 space-y-1">
                          <p className="text-[10px] text-white/70">{hs.subtitle}</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-semibold text-[#F4E6C9]">
                              {formatINR(hs.price)}
                            </span>
                            <span className="text-[10px] text-white/40 line-through">
                              {formatINR(hs.originalPrice)}
                            </span>
                          </div>
                          <p className="text-[9px] text-[#A88955] font-medium tracking-tight">
                            ✓ {hs.hallmark}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                          <button
                            onClick={(e) => handleQuickView(hs, e)}
                            className="flex items-center justify-center gap-1 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xs text-[10px] uppercase tracking-wider font-medium text-white transition-all"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Quick View</span>
                          </button>

                          <button
                            onClick={(e) => handleAddToCart(hs, e)}
                            className="flex items-center justify-center gap-1 py-1.5 bg-[#A88955] hover:bg-[#8F7243] rounded-xs text-[10px] uppercase tracking-wider font-semibold text-[#1F1C18] transition-all"
                          >
                            {addedProductId === hs.id ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Added!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3 h-3" />
                                <span>Add to Bag</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

            {/* Big Center Play/Pause Overlay Indicator (shows on hover or when paused) */}
            {!isPlaying && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-10 cursor-pointer pointer-events-auto"
                onClick={togglePlay}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all shadow-2xl">
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white translate-x-0.5" />
                </div>
              </div>
            )}

            {/* BOTTOM BAR: Reel Title & Timeline Scrubber */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-20 pointer-events-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-2">
                <div className="max-w-xl">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#A88955] font-semibold block">
                    Now Playing &bull; Reel {activeReelIndex + 1} of {SHOWCASE_REELS.length}
                  </span>
                  <h3 className="font-serif-luxury text-base sm:text-xl font-medium text-white">
                    {currentReel.title}
                  </h3>
                  <p className="text-[11px] text-white/80 line-clamp-1 font-light">
                    {currentReel.subtitle}
                  </p>
                </div>

                {/* Right controls: Play/Pause, Speed, Time */}
                <div className="flex items-center gap-3 text-white self-end sm:self-auto">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 hover:text-[#A88955] transition-colors"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  {/* Playback speed selector */}
                  <button
                    onClick={() => {
                      const speeds = [0.75, 1, 1.25];
                      const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                      setPlaybackSpeed(next);
                    }}
                    className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded-xs text-[10px] font-mono tracking-wider border border-white/15"
                    title="Playback Rate"
                  >
                    {playbackSpeed}x
                  </button>

                  <span className="text-[11px] font-mono text-white/80 tracking-wider">
                    {formatTime(currentTime)} / {formatTime(currentReel.duration)}
                  </span>
                </div>
              </div>

              {/* Interactive Timeline Progress Bar */}
              <div
                className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative overflow-hidden group/bar"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  const newTime = ratio * currentReel.duration;
                  setCurrentTime(newTime);
                  if (videoElementRef.current) {
                    videoElementRef.current.currentTime = newTime;
                  }
                }}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#A88955] to-[#E3C68F] transition-all duration-100 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>

          {/* LOWER DECK: AI Studio Lighting Profiles & Telemetry Bar */}
          <div className="bg-[#211F1B] border-t border-[#A88955]/30 p-4 sm:p-5 text-[#FAF5EB]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Studio Relighting Simulator */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-[10px] uppercase tracking-widest text-[#A88955] font-semibold flex items-center gap-1 shrink-0">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Lighting Studio:</span>
                </span>

                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xs border border-white/10 overflow-x-auto w-full md:w-auto">
                  <button
                    onClick={() => setLighting('temple')}
                    className={`flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-wider rounded-xs transition-all whitespace-nowrap ${
                      lighting === 'temple'
                        ? 'bg-[#A88955] text-[#1F1C18] font-semibold shadow-xs'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Lamp className="w-3 h-3" />
                    <span>Temple Gold (3000K)</span>
                  </button>

                  <button
                    onClick={() => setLighting('daylight')}
                    className={`flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-wider rounded-xs transition-all whitespace-nowrap ${
                      lighting === 'daylight'
                        ? 'bg-[#A88955] text-[#1F1C18] font-semibold shadow-xs'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    <span>Studio Daylight (5500K)</span>
                  </button>

                  <button
                    onClick={() => setLighting('candlelight')}
                    className={`flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-wider rounded-xs transition-all whitespace-nowrap ${
                      lighting === 'candlelight'
                        ? 'bg-[#A88955] text-[#1F1C18] font-semibold shadow-xs'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Flame className="w-3 h-3" />
                    <span>Palace Candlelight (2200K)</span>
                  </button>
                </div>
              </div>

              {/* Hallmark Guarantees Pill */}
              <div className="flex items-center gap-4 text-[10px] text-white/70 tracking-wider">
                <span className="flex items-center gap-1 text-[#F4E6C9]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3D6847]" />
                  916 BIS Hallmarked 24K
                </span>
                <span className="hidden sm:inline">&bull;</span>
                <span className="hidden sm:inline flex items-center gap-1 text-[#F4E6C9]">
                  Hollow Repoussé Comfort
                </span>
                <span className="hidden sm:inline">&bull;</span>
                <span className="flex items-center gap-1 text-[#A88955] font-mono">
                  Neural Cine 60fps
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Prompt & Diffusion Telemetry Drawer Modal */}
        {showPromptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#292722] border border-[#A88955] max-w-xl w-full rounded-xs p-6 text-white shadow-2xl relative">
              <button
                onClick={() => setShowPromptModal(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#A88955]" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#A88955] font-semibold">
                  AUREVYA AI Video Synthesizer Telemetry
                </span>
              </div>

              <h3 className="font-serif-luxury text-xl font-medium text-white mb-2">
                Neural Generation Specifications
              </h3>
              <p className="text-xs text-[#EDE4D8]/80 font-light mb-4 leading-relaxed">
                This jewellery showcasing reel was synthesized using our proprietary fine-tuned diffusion model trained exclusively on hereditary Chettinad and Thanjavur royal jewellery archives.
              </p>

              <div className="space-y-3 bg-[#1C1A17] p-4 rounded-xs border border-white/10 text-xs font-mono">
                <div>
                  <span className="text-[#A88955] block text-[10px] uppercase font-sans font-semibold">
                    Generative Prompt:
                  </span>
                  <p className="text-white/90 text-[11px] mt-1 leading-relaxed bg-black/40 p-2.5 rounded-xs border border-white/5">
                    "{currentReel.prompt}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-white/10">
                  <div>
                    <span className="text-white/50 block">Diffusion Model:</span>
                    <span className="text-[#F4E6C9]">{currentReel.model}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">Sampling Resolution:</span>
                    <span className="text-[#F4E6C9]">{currentReel.resolution}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">Temporal Motion:</span>
                    <span className="text-[#F4E6C9]">{currentReel.fps}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">Color Temperature:</span>
                    <span className="text-[#F4E6C9]">
                      {lighting === 'temple' ? '3000K Amber' : lighting === 'daylight' ? '5500K Neutral' : '2200K Candlelight'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setShowPromptModal(false)}
                  className="px-5 py-2 bg-[#A88955] hover:bg-[#8F7243] text-[#1F1C18] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors"
                >
                  Close Telemetry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
