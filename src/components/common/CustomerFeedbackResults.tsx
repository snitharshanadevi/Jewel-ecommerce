import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle2, MessageSquare, ThumbsUp, ArrowRight, X, Sparkles } from 'lucide-react';
import { DEMO_REVIEWS } from '../../data/demoReviews';
import { CustomerReview } from '../../types';

export const CustomerFeedbackResults: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>(DEMO_REVIEWS);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [writeModalOpen, setWriteModalOpen] = useState(false);

  // Form state
  const [authorName, setAuthorName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('Chettinad Kemp Ruby Attigai Choker');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewComment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: authorName.trim(),
      location: location.trim() || 'Chennai, Tamil Nadu',
      rating: selectedRating,
      date: 'Just now',
      title: reviewTitle.trim() || 'Exceptional craftsmanship & royal shine',
      comment: reviewComment.trim(),
      verifiedBuyer: true,
      productName: selectedProduct,
      productSlug: selectedProduct.toLowerCase().replace(/ /g, '-'),
    };

    setReviews([newRev, ...reviews]);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setWriteModalOpen(false);
      setAuthorName('');
      setLocation('');
      setReviewTitle('');
      setReviewComment('');
    }, 1500);
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterCategory === 'All') return true;
    if (filterCategory === 'Attigai' && r.productName.includes('Attigai')) return true;
    if (filterCategory === 'Jhimikki' && (r.productName.includes('Jhimikki') || r.productName.includes('Kammal'))) return true;
    if (filterCategory === 'Valayal' && r.productName.includes('Valayal')) return true;
    if (filterCategory === 'Manga Malai' && r.productName.includes('Manga')) return true;
    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E8E2D9] gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDE4D8]/60 border border-[#E8E2D9] rounded-xs text-[10px] uppercase tracking-[0.25em] text-[#A88955] font-semibold mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Verified Customer Feedback</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-[#292722]">
            Cherished by Discerning Patrons
          </h2>
          <p className="text-xs sm:text-sm text-[#77736B] font-light mt-1 max-w-xl">
            Real feedback from brides, classical dancers, and heirloom collectors across Tamil Nadu, Karnataka, Kerala, and beyond.
          </p>
        </div>

        <button
          onClick={() => setWriteModalOpen(true)}
          className="self-start md:self-auto px-6 py-3 bg-[#292722] text-[#F8F6F1] text-xs uppercase tracking-[0.2em] font-medium hover:bg-black transition-colors rounded-xs flex items-center gap-2 shadow-xs"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Aggregate Score & Metrics Card */}
      <div className="my-10 bg-white border border-[#E8E2D9] rounded-xs p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Score */}
        <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-[#E8E2D9] pb-6 md:pb-0 md:pr-8">
          <div className="flex items-baseline justify-center md:justify-start gap-3">
            <span className="font-serif-luxury text-5xl sm:text-6xl font-light text-[#292722]">4.9</span>
            <span className="text-sm text-[#77736B] font-medium">/ 5.0</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 my-2 text-[#A88955]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#A88955]" />
            ))}
          </div>
          <p className="text-xs text-[#292722] font-semibold">Over 480+ Verified Atelier Orders</p>
          <p className="text-[11px] text-[#77736B] mt-0.5">100% Authenticated by BlueDart & Atelier Concierge</p>
        </div>

        {/* Middle Breakdown Bar */}
        <div className="md:col-span-5 space-y-2 text-xs text-[#77736B]">
          <div className="flex items-center gap-3">
            <span className="w-12 text-[11px] font-medium text-[#292722]">5 Stars</span>
            <div className="flex-1 bg-[#FAF8F5] border border-[#E8E2D9] h-2 rounded-full overflow-hidden">
              <div className="bg-[#A88955] h-full w-[94%] rounded-full" />
            </div>
            <span className="w-8 text-right text-[11px]">94%</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-12 text-[11px] font-medium text-[#292722]">4 Stars</span>
            <div className="flex-1 bg-[#FAF8F5] border border-[#E8E2D9] h-2 rounded-full overflow-hidden">
              <div className="bg-[#A88955]/70 h-full w-[5%] rounded-full" />
            </div>
            <span className="w-8 text-right text-[11px]">5%</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-12 text-[11px] font-medium text-[#292722]">3 Stars</span>
            <div className="flex-1 bg-[#FAF8F5] border border-[#E8E2D9] h-2 rounded-full overflow-hidden">
              <div className="bg-[#A88955]/40 h-full w-[1%] rounded-full" />
            </div>
            <span className="w-8 text-right text-[11px]">1%</span>
          </div>
        </div>

        {/* Right Badges */}
        <div className="md:col-span-3 space-y-3 bg-[#FAF8F5] p-4 border border-[#E8E2D9] rounded-xs text-xs">
          <div className="flex items-center gap-2 text-[#3D6847] font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>98.6% Would Recommend</span>
          </div>
          <p className="text-[11px] text-[#77736B] leading-relaxed">
            Praised most for: "Zero earlobe pain", "Heirloom gold finish", and "Secure velvet packaging".
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 text-xs scrollbar-none">
        {['All', 'Attigai', 'Jhimikki', 'Valayal', 'Manga Malai'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterCategory(tab)}
            className={`px-4 py-2 uppercase tracking-wider rounded-xs transition-all whitespace-nowrap ${
              filterCategory === tab
                ? 'bg-[#292722] text-[#F8F6F1] font-semibold'
                : 'bg-white border border-[#E8E2D9] text-[#77736B] hover:text-[#292722]'
            }`}
          >
            {tab === 'All' ? 'All Reviews' : tab}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white border border-[#E8E2D9] rounded-xs p-6 flex flex-col justify-between hover:border-[#A88955] transition-all shadow-xs"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-[#A88955]">
                  {[...Array(Math.floor(rev.rating))].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#A88955]" />
                  ))}
                </div>
                <span className="text-[11px] text-[#77736B] font-mono">{rev.date}</span>
              </div>

              {/* Title & Comment */}
              <h3 className="font-serif-luxury text-base font-semibold text-[#292722] mb-2 leading-snug">
                "{rev.title}"
              </h3>
              <p className="text-xs text-[#77736B] leading-relaxed font-light">
                {rev.comment}
              </p>
            </div>

            {/* Author & Piece Footer */}
            <div className="mt-6 pt-4 border-t border-[#F0ECE4] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#292722] flex items-center gap-1.5">
                  <span>{rev.author}</span>
                  {rev.verifiedBuyer && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3D6847] shrink-0" />
                  )}
                </p>
                <p className="text-[11px] text-[#77736B]">{rev.location}</p>
                <Link
                  to={`/products/${rev.productSlug}`}
                  className="text-[11px] text-[#A88955] font-medium hover:underline inline-block mt-1 line-clamp-1"
                >
                  Piece: {rev.productName}
                </Link>
              </div>

              {rev.avatar && (
                <img
                  src={rev.avatar}
                  alt={rev.author}
                  className="w-10 h-10 rounded-full object-cover border border-[#E8E2D9] shrink-0"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Write a Review Modal */}
      {writeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#292722]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-lg border border-[#E8E2D9] shadow-2xl rounded-xs p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setWriteModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#77736B] hover:text-[#292722]"
              aria-label="Close review dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-luxury text-2xl font-light text-[#292722] mb-1">
              Share Your Atelier Experience
            </h3>
            <p className="text-xs text-[#77736B] mb-6">
              Your honest feedback helps fellow connoisseurs choose the perfect heirloom piece.
            </p>

            {submittedMessage ? (
              <div className="p-8 text-center bg-[#FAF8F5] border border-[#3D6847]/30 rounded-xs space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#3D6847] mx-auto" />
                <h4 className="font-serif-luxury text-xl text-[#292722]">Thank You for Your Feedback</h4>
                <p className="text-xs text-[#77736B]">Your verified review has been published to the atelier gallery.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#292722] mb-1">
                    Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setSelectedRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= selectedRating
                              ? 'fill-[#A88955] text-[#A88955]'
                              : 'text-[#E8E2D9]'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-[#77736B] ml-2">({selectedRating} Stars)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-[#292722] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Priyadarshini Iyer"
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#A88955]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-[#292722] mb-1">
                      City / State *
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Madurai, Tamil Nadu"
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#A88955]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#292722] mb-1">
                    Jewel Piece *
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#A88955]"
                  >
                    <option value="Chettinad Kemp Ruby Attigai Choker">Chettinad Kemp Ruby Attigai Choker</option>
                    <option value="Thanjavur Mayil Peedam Jhimikki Kammal">Thanjavur Mayil Peedam Jhimikki Kammal</option>
                    <option value="Kalyani Kemp Manga Malai Haram">Kalyani Kemp Manga Malai Haram</option>
                    <option value="Madurai Nagas Gaja Valayal Pair">Madurai Nagas Gaja Valayal Pair</option>
                    <option value="Surya Chandra Kemp Kammal Studs">Surya Chandra Kemp Kammal Studs</option>
                    <option value="Amukta Guttapusalu Pearl Fringe Haram">Amukta Guttapusalu Pearl Fringe Haram</option>
                    <option value="Padmavati Kundan Choker Suite">Padmavati Kundan Choker Suite</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#292722] mb-1">
                    Review Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Radiant temple gold shine without ear pull"
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#A88955]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#292722] mb-1">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe how the piece felt to wear, packaging, and craftsmanship details..."
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#A88955]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#A88955] text-white uppercase tracking-[0.2em] font-semibold hover:bg-[#8F7241] transition-colors rounded-xs shadow-xs"
                  >
                    Submit Verified Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
