import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, CheckCircle2, Film } from 'lucide-react';

export const VideoDemoShowcase: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeChapter, setActiveChapter] = useState(0);

  // Enforce autoplay on mount with muted attribute per browser standards
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay gracefully handled
          });
      }
    }
  }, []);

  const chapters = [
    {
      title: '01. Temple Chasing',
      desc: 'Hand-sculpting the sacred peacock and mango motifs into 24k gold-tone sheet metal.',
      time: 0,
    },
    {
      title: '02. Kemp Stone Setting',
      desc: 'Artisanal wax-backed prong setting of cabochon red rubies and emerald drops.',
      time: 5,
    },
    {
      title: '03. Basra Pearl Threading',
      desc: 'Double-knotted micro-seed pearls strung along the lower hem for rhythmic sway.',
      time: 10,
    },
    {
      title: '04. Velvet Seal Inspection',
      desc: 'Final inspection under magnifying loupe and placement in keepsake velvet box.',
      time: 15,
    },
  ];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (time: number, index: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setActiveChapter(index);
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <section className="bg-[#FAF5EB] border-y border-[#E8E2D9] py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDE4D8]/60 border border-[#E8E2D9] rounded-xs text-[10px] uppercase tracking-[0.25em] text-[#A88955] font-semibold">
            <Film className="w-3.5 h-3.5" />
            <span>The Atelier Film</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-[#292722] leading-tight">
            The Making of Sacred Adornment
          </h2>
          <p className="text-xs sm:text-sm text-[#77736B] font-light leading-relaxed">
            Witness how hereditary Thanjavur and Chettinad karigars hand-sculpt each Attigai, Jhimikki Kammal, and Nagas Valayal with featherlight modern balance.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="relative max-w-5xl mx-auto bg-black rounded-xs overflow-hidden border border-[#E8E2D9] shadow-2xl">
          <div className="relative aspect-video w-full bg-[#1A1815] overflow-hidden">
            <video
              ref={videoRef}
              poster="/images/chettinad/chettinad_flatlay_gold.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover opacity-90 transition-opacity"
            >
              <source src="/videos/atelier_craft.webm" type="video/webm" />
              <source src="https://vjs.zencdn.net/v/oceans.mp4" type="video/mp4" />
            </video>

            {/* Video Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Bar Overlay */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white/90 z-10 pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#A88955] animate-ping" />
                <span className="text-[11px] uppercase tracking-widest font-semibold font-serif-luxury text-white">
                  AUREVYA ATELIER CINEMATIC REEL
                </span>
              </div>

              <button
                onClick={toggleMute}
                className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white/90 hover:text-white hover:bg-black/60 transition-all border border-white/10"
                aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Center Play/Pause Floating Button */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all z-10 shadow-xl"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 sm:w-7 sm:h-7" />
              ) : (
                <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white translate-x-0.5" />
              )}
            </button>

            {/* Bottom Current Chapter Subtitle */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10 pointer-events-none text-white">
              <div className="max-w-md">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#A88955] font-semibold">
                  Active Craft Stage
                </p>
                <p className="font-serif-luxury text-base sm:text-lg font-medium text-white">
                  {chapters[activeChapter].title}
                </p>
                <p className="text-[11px] text-white/80 line-clamp-1 font-light">
                  {chapters[activeChapter].desc}
                </p>
              </div>

              <div className="text-[10px] text-white/70 uppercase tracking-widest font-mono">
                HD 1080p &bull; 60 FPS
              </div>
            </div>
          </div>

          {/* Chapter Selector Navigation Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 bg-[#292722] text-[#FAF5EB] divide-y md:divide-y-0 md:divide-x divide-[#E8E2D9]/15">
            {chapters.map((chap, idx) => (
              <button
                key={idx}
                onClick={() => handleSeek(chap.time, idx)}
                className={`p-4 text-left transition-all ${
                  activeChapter === idx
                    ? 'bg-[#A88955]/20 text-white border-b-2 md:border-b-0 md:border-t-2 border-[#A88955]'
                    : 'text-[#EDE4D8]/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A88955]">
                  {chap.title}
                </p>
                <p className="text-[10px] text-[#EDE4D8]/80 line-clamp-2 mt-1 font-light leading-snug">
                  {chap.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Hallmark Guarantees Row */}
        <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-start gap-3 bg-white p-4 border border-[#E8E2D9] rounded-xs">
            <CheckCircle2 className="w-4 h-4 text-[#3D6847] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#292722]">24k Micron Gold Dip</h4>
              <p className="text-[11px] text-[#77736B] mt-0.5">Durable vermeil finish resistant to moisture and dulling.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-4 border border-[#E8E2D9] rounded-xs">
            <CheckCircle2 className="w-4 h-4 text-[#3D6847] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#292722]">Authentic Kemp Stones</h4>
              <p className="text-[11px] text-[#77736B] mt-0.5">Hand-cut cabochons reflecting deep crimson temple fire.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-4 border border-[#E8E2D9] rounded-xs">
            <CheckCircle2 className="w-4 h-4 text-[#3D6847] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#292722]">Hollow Dome Comfort</h4>
              <p className="text-[11px] text-[#77736B] mt-0.5">Engineered for lightweight wear during 12-hour weddings.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
