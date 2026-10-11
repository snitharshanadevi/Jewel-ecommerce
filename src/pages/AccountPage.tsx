import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, ShoppingBag, MapPin, ArrowRight, ShieldCheck, FileText, Headphones, Star, Plus, Trash2, Edit2, LogOut } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSupport } from '../context/SupportContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { InvoiceModal } from '../components/common/InvoiceModal';
import { Order, SavedAddress } from '../types';
import { useToast } from '../context/ToastContext';

export const AccountPage: React.FC = () => {
  const { orders } = useOrders();
  const { totalWishlistCount } = useWishlist();
  const { totalItemCount } = useCart();
  const { user, isAuthenticated, openAuthModal, logout, saveAddress } = useAuth();
  const { openSupport } = useSupport();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'consultations' | 'profile'>('orders');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [reviewModalProduct, setReviewModalProduct] = useState<{ id: string; name: string } | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Address edit state
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const breadcrumbs = [{ label: 'My Account' }];

  // If user is not authenticated, show welcoming login banner
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#A88955]/10 text-[#A88955] flex items-center justify-center mx-auto text-2xl font-bold mb-4">
          👑
        </div>
        <span className="text-[10px] uppercase tracking-widest text-[#A88955] font-semibold block">
          AUREVYA ATELIER PRIVILEGE
        </span>
        <h1 className="font-serif-luxury text-3xl text-stone-900 mt-1 font-light">
          Patron Account Portal
        </h1>
        <p className="text-xs text-stone-600 mt-2 mb-6 max-w-md mx-auto leading-relaxed">
          Sign in using your mobile number to view your handcrafted orders, track bespoke deliveries, download official GST invoices, and manage your address casket.
        </p>
        <button
          onClick={() => openAuthModal()}
          className="px-8 py-3.5 bg-[#292722] hover:bg-[#A88955] text-white text-xs uppercase tracking-widest font-semibold transition-all rounded-xl shadow-md"
        >
          Sign In via Mobile OTP (+91)
        </button>
      </div>
    );
  }

  // Filter orders for authenticated user
  const userOrders = orders.filter((o) => {
    if (!user) return true;
    const phoneMatch = o.customer.phone.replace(/\D/g, '') === user.phone.replace(/\D/g, '');
    const emailMatch = user.email && o.customer.email.toLowerCase() === user.email.toLowerCase();
    return phoneMatch || emailMatch;
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      showToast('Please provide a title and your feedback comments.', 'error');
      return;
    }

    setIsSubmittingReview(true);
    setTimeout(() => {
      setIsSubmittingReview(false);
      setReviewModalProduct(null);
      setReviewTitle('');
      setReviewComment('');
      showToast('Thank you! Your verified patronage review has been submitted to the atelier curators.', 'success');
    }, 600);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;
    saveAddress(editingAddress);
    setIsAddressModalOpen(false);
    setEditingAddress(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* Account Hero Banner */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#EDE4D8] border border-[#E8E2D9] flex items-center justify-center text-[#A88955] font-serif text-2xl font-bold">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#A88955] font-semibold">
                Atelier Client Circle &bull; Verified Patron
              </span>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#292722]">
                {user?.fullName || 'Ananya Sharma'}
              </h1>
              <p className="text-xs text-[#77736B]">
                {user?.email || 'ananya.sharma@example.com'} &bull; +91 {user?.phone || '9876543210'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/wishlist"
              className="px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] text-xs text-[#292722] hover:border-[#A88955] rounded-xl flex items-center gap-2 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-[#A88955]" />
              <span>Wishlist ({totalWishlistCount})</span>
            </Link>

            <Link
              to="/cart"
              className="px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] text-xs text-[#292722] hover:border-[#A88955] rounded-xl flex items-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#A88955]" />
              <span>Bag ({totalItemCount})</span>
            </Link>

            <button
              onClick={logout}
              className="px-3.5 py-2 text-stone-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Logout from session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex border-b border-[#E8E2D9] mb-8 text-xs uppercase tracking-wider overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 border-b-2 shrink-0 ${
            activeTab === 'orders'
              ? 'border-[#A88955] text-[#292722]'
              : 'border-transparent text-[#77736B] hover:text-[#292722]'
          }`}
        >
          <Package className="w-4 h-4" /> Order History ({userOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 border-b-2 shrink-0 ${
            activeTab === 'addresses'
              ? 'border-[#A88955] text-[#292722]'
              : 'border-transparent text-[#77736B] hover:text-[#292722]'
          }`}
        >
          <MapPin className="w-4 h-4" /> Saved Addresses ({user?.savedAddresses?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 border-b-2 shrink-0 ${
            activeTab === 'profile'
              ? 'border-[#A88955] text-[#292722]'
              : 'border-transparent text-[#77736B] hover:text-[#292722]'
          }`}
        >
          <User className="w-4 h-4" /> Patron Profile & Security
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {userOrders.length === 0 ? (
            <div className="bg-white border border-[#E8E2D9] rounded-2xl p-12 text-center space-y-3">
              <Package className="w-10 h-10 text-[#77736B] mx-auto stroke-1" />
              <h2 className="font-serif-luxury text-xl text-[#292722]">No Orders Recorded</h2>
              <p className="text-xs text-[#77736B]">Explore our collection to place your first handcrafted jewellery order.</p>
              <Link
                to="/collections"
                className="inline-block px-6 py-2.5 bg-[#A88955] text-white text-xs uppercase tracking-wider font-semibold rounded-xl mt-2"
              >
                Browse Heirloom Jewels
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-serif-luxury text-lg font-semibold text-[#292722]">
                        {order.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-[#3D6847]/10 text-[#3D6847]'
                            : order.status === 'cancelled'
                            ? 'bg-[#A63D40]/10 text-[#A63D40]'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        {order.payment.method.toUpperCase()} &bull; Paid in full
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#77736B]">
                      <span>Placed on: {formatDate(order.createdAt)}</span>
                      <span>&bull;</span>
                      <span>Total: <strong className="text-[#292722]">{formatCurrency(order.pricing.total)}</strong></span>
                      <span>&bull;</span>
                      <span>Delivery: {order.estimatedDeliveryDate}</span>
                    </div>

                    {/* Pieces row */}
                    <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-[#FAF8F5] border border-[#E8E2D9] px-2.5 py-1.5 rounded-xl text-xs shrink-0">
                          <img src={item.image} alt="" className="w-8 h-8 object-cover rounded-lg" />
                          <div>
                            <span className="text-[#292722] font-medium block truncate max-w-[140px]">{item.productName}</span>
                            <span className="text-[10px] text-stone-500">Qty: {item.quantity}</span>
                          </div>
                          <button
                            onClick={() => setReviewModalProduct({ id: item.productId, name: item.productName })}
                            className="ml-1 text-[10px] text-[#A88955] hover:underline font-semibold"
                            title="Write review"
                          >
                            Review ★
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-stone-600" />
                      <span>Invoice</span>
                    </button>

                    <Link
                      to={`/track-order?orderId=${order.id}&contact=${order.customer.phone}`}
                      className="px-5 py-2.5 bg-[#A88955] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#8F7241] transition-colors rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => openSupport({ orderReference: order.id })}
                      className="p-2.5 border border-stone-200 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-50"
                      title="Concierge order inquiry"
                    >
                      <Headphones className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-stone-900">
              Address Casket
            </h2>
            <button
              onClick={() => {
                setEditingAddress({
                  id: `addr-${Date.now()}`,
                  label: 'Home',
                  recipientName: user?.fullName || 'Ananya Sharma',
                  recipientPhone: user?.phone || '9876543210',
                  addressLine: '',
                  addressLine2: '',
                  city: '',
                  state: '',
                  pincode: '',
                  isDefault: false,
                });
                setIsAddressModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#292722] text-[#F8F6F1] text-xs font-semibold uppercase tracking-wider hover:bg-[#A88955] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user?.savedAddresses?.map((addr) => (
              <div key={addr.id} className="p-5 bg-white border border-[#E8E2D9] rounded-2xl shadow-xs space-y-2 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">{addr.recipientName}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {addr.label || 'Home'}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setEditingAddress(addr);
                      setIsAddressModalOpen(true);
                    }}
                    className="text-stone-400 hover:text-stone-900 p-1"
                    title="Edit address"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {addr.addressLine}
                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                  <br />
                  {addr.city}, {addr.state} — {addr.pincode}
                </p>
                {addr.landmark && (
                  <p className="text-[11px] text-stone-500">Landmark: {addr.landmark}</p>
                )}
                <p className="text-[11px] text-stone-700 pt-1">
                  Mobile: +91 {addr.recipientPhone}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#292722] pb-3 border-b border-[#E8E2D9]">
            Patron Profile & Security Credentials
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-400 block mb-1">Patron Full Name:</span>
              <p className="font-semibold text-stone-900 text-sm">{user?.fullName || 'Ananya Sharma'}</p>
            </div>
            <div>
              <span className="text-stone-400 block mb-1">Verified Mobile:</span>
              <p className="font-semibold text-stone-900 text-sm font-mono">+91 {user?.phone || '9876543210'}</p>
            </div>
            <div>
              <span className="text-stone-400 block mb-1">Primary Email Address:</span>
              <p className="font-semibold text-stone-900 text-sm">{user?.email || 'ananya.sharma@example.com'}</p>
            </div>
            <div>
              <span className="text-stone-400 block mb-1">Circle Membership Tier:</span>
              <p className="font-semibold text-[#A88955] text-sm">Privilege Atelier Circle</p>
            </div>
          </div>

          <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl flex items-start gap-3 text-xs text-stone-600">
            <ShieldCheck className="w-5 h-5 text-[#3D6847] shrink-0 mt-0.5" />
            <p>
              Your session is securely authenticated via simulated mobile OTP. Real banking passwords, cards, and OTPs are never stored on device.
            </p>
          </div>
        </div>
      )}

      {/* Tax Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={!!selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

      {/* Review Submission Modal */}
      {reviewModalProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setReviewModalProduct(null)}
        >
          <div
            className="w-full max-w-md bg-[#FAF5EB] rounded-2xl shadow-2xl border border-[#E8E2D9] p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#A88955] font-semibold">
                  VERIFIED PATRON OPINION
                </span>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  Review &ldquo;{reviewModalProduct.name}&rdquo;
                </h3>
              </div>
              <button onClick={() => setReviewModalProduct(null)} className="text-stone-400 hover:text-stone-900">
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl ${star <= reviewRating ? 'text-[#A88955]' : 'text-stone-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Exquisite craftsmanship, looked stunning for my Muhurtham!"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#E8E2D9] rounded-xl focus:ring-1 focus:ring-[#A88955] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Impression</label>
                <textarea
                  rows={3}
                  placeholder="Share details on weight, comfort on earlobes/neck, finish and packaging..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#E8E2D9] rounded-xl focus:ring-1 focus:ring-[#A88955] outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full py-3 bg-[#292722] hover:bg-[#A88955] text-white text-xs uppercase font-semibold tracking-wider rounded-xl transition-colors shadow-sm"
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Verified Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {isAddressModalOpen && editingAddress && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsAddressModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#FAF5EB] rounded-2xl shadow-2xl border border-[#E8E2D9] p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Edit Address
              </h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="text-stone-400 hover:text-stone-900">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={editingAddress.recipientName || ''}
                  onChange={(e) => setEditingAddress({ ...editingAddress, recipientName: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-[#E8E2D9] rounded-xl outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Address Line 1</label>
                <input
                  type="text"
                  value={editingAddress.addressLine}
                  onChange={(e) => setEditingAddress({ ...editingAddress, addressLine: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-[#E8E2D9] rounded-xl outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editingAddress.city}
                    onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                    className="w-full text-xs p-2.5 bg-white border border-[#E8E2D9] rounded-xl outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={editingAddress.pincode}
                    onChange={(e) => setEditingAddress({ ...editingAddress, pincode: e.target.value })}
                    className="w-full text-xs p-2.5 bg-white border border-[#E8E2D9] rounded-xl outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#292722] hover:bg-[#A88955] text-white text-xs uppercase font-semibold tracking-wider rounded-xl transition-colors"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
