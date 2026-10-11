import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { Order } from '../types';
import { formatINR } from '../utils/formatters';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { findOrderForTracking, cancelOrder, orders } = useOrders();

  const initialId = searchParams.get('orderId') || '';
  const initialContact = searchParams.get('contact') || '';

  const [orderIdInput, setOrderIdInput] = useState(initialId);
  const [contactInput, setContactInput] = useState(initialContact);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  // Auto-search if URL params present
  useEffect(() => {
    if (initialId) {
      const match = findOrderForTracking(initialId, initialContact) || orders.find((o) => o.id.toUpperCase() === initialId.toUpperCase());
      if (match) {
        setSearchedOrder(match);
        setSearchAttempted(true);
      }
    } else if (orders.length > 0) {
      // Default to the first demo order for instant review
      setSearchedOrder(orders[0]);
      setOrderIdInput(orders[0].id);
      setContactInput(orders[0].customer.phone);
    }
  }, [initialId, initialContact, findOrderForTracking, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCancelMessage(null);
    setSearchAttempted(true);

    if (!orderIdInput.trim()) {
      setSearchedOrder(null);
      return;
    }

    const match = findOrderForTracking(orderIdInput, contactInput) || orders.find((o) => o.id.toUpperCase() === orderIdInput.trim().toUpperCase());
    setSearchedOrder(match || null);
  };

  const handleCancelClick = () => {
    if (!searchedOrder) return;
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const res = cancelOrder(searchedOrder.id);
      setCancelMessage(res.message);
      if (res.success) {
        setSearchedOrder((prev) =>
          prev ? { ...prev, status: 'cancelled', canCancel: false } : null
        );
      }
    }
  };

  const breadcrumbs = [{ label: 'Track Order' }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={breadcrumbs} />

      <div className="pb-6 border-b border-[#E8E2D9] mb-8">
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#292722] font-light">
          Track Your Jewellery Order
        </h1>
        <p className="text-xs sm:text-sm text-[#77736B] mt-1 font-light">
          Monitor your handcrafted suite from atelier inspection to insured doorstep delivery.
        </p>
      </div>

      {/* Order Lookup Form */}
      <div className="bg-white border border-[#E8E2D9] rounded-xs p-6 shadow-xs mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#292722] mb-1">
              Order Reference *
            </label>
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="e.g. AUR-2026-88142"
              className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs uppercase text-[#292722] rounded-xs focus:outline-none focus:border-[#A88955]"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#292722] mb-1">
              Phone / Email *
            </label>
            <input
              type="text"
              value={contactInput}
              onChange={(e) => setContactInput(e.target.value)}
              placeholder="e.g. 9876543210 or ananya@example.com"
              className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs text-[#292722] rounded-xs focus:outline-none focus:border-[#A88955]"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#A88955] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#8F7241] transition-colors rounded-xs flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>
          </div>
        </form>

        <p className="text-[11px] text-[#77736B] mt-3">
          Tip: Try demo order <strong className="text-[#292722] font-semibold">AUR-2026-88142</strong> or your newly placed order ID.
        </p>
      </div>

      {/* Result Display */}
      {searchAttempted && !searchedOrder ? (
        <div className="bg-white border border-[#E8E2D9] rounded-xs p-10 text-center space-y-3">
          <XCircle className="w-10 h-10 text-[#A63D40] mx-auto stroke-1" />
          <h2 className="font-serif-luxury text-2xl text-[#292722]">Order Not Found</h2>
          <p className="text-xs text-[#77736B] max-w-md mx-auto">
            We could not find an order matching reference "{orderIdInput}". Please check for typos or ensure the contact details match.
          </p>
        </div>
      ) : searchedOrder ? (
        <div className="space-y-8">
          {/* Order Header Summary */}
          <div className="bg-white border border-[#E8E2D9] rounded-xs p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-xl sm:text-2xl font-medium text-[#292722]">
                  {searchedOrder.id}
                </span>
                <span
                  className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-xs ${
                    searchedOrder.status === 'delivered'
                      ? 'bg-[#3D6847]/10 text-[#3D6847]'
                      : searchedOrder.status === 'cancelled'
                      ? 'bg-[#A63D40]/10 text-[#A63D40]'
                      : 'bg-[#EDE4D8] text-[#A88955]'
                  }`}
                >
                  {searchedOrder.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-[#77736B] mt-1">
                Recipient: <strong className="text-[#292722]">{searchedOrder.customer.fullName}</strong> &bull; Total: {formatINR(searchedOrder.pricing.total)}
              </p>
            </div>

            {searchedOrder.canCancel && (
              <button
                onClick={handleCancelClick}
                className="px-4 py-2 border border-[#A63D40] text-[#A63D40] hover:bg-[#A63D40] hover:text-white text-xs uppercase tracking-wider font-semibold transition-colors rounded-xs"
              >
                Request Order Cancellation
              </button>
            )}
          </div>

          {cancelMessage && (
            <div className="p-3.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xs text-xs text-[#292722]">
              {cancelMessage}
            </div>
          )}

          {/* Timeline Visualizer */}
          <div className="bg-white border border-[#E8E2D9] rounded-xs p-6 sm:p-8 shadow-xs">
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#292722] mb-8 pb-3 border-b border-[#E8E2D9]">
              Fulfilment Timeline
            </h2>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E2D9]">
              {searchedOrder.statusTimeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Step Icon */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                      step.isCompleted
                        ? 'bg-[#3D6847] text-white ring-4 ring-[#FAF8F5]'
                        : step.isCurrent
                        ? 'bg-[#A88955] text-white ring-4 ring-[#EDE4D8]'
                        : 'bg-white border border-[#E8E2D9] text-[#77736B]'
                    }`}
                  >
                    {step.isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          step.isCurrent
                            ? 'text-[#A88955]'
                            : step.isCompleted
                            ? 'text-[#292722]'
                            : 'text-[#77736B]'
                        }`}
                      >
                        {step.label}
                      </h3>
                      <span className="text-[11px] text-[#77736B] font-mono">{step.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#77736B] mt-1 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-[#E8E2D9] flex items-center justify-between text-[11px] text-[#77736B]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A88955]" />
                Tamper-evident transit insurance active
              </span>
              <span>Courier: BlueDart Secure Express (Demo)</span>
            </div>
          </div>

          {/* Delivery & Items Snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E8E2D9] rounded-xs p-6 text-xs space-y-3">
              <h3 className="uppercase tracking-[0.2em] font-semibold text-[#292722] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#A88955]" /> Destination Address
              </h3>
              <p className="text-[#77736B] leading-relaxed">
                {searchedOrder.deliveryAddress.addressLine}, {searchedOrder.deliveryAddress.city},{' '}
                {searchedOrder.deliveryAddress.state} - {searchedOrder.deliveryAddress.pincode}
              </p>
            </div>

            <div className="bg-white border border-[#E8E2D9] rounded-xs p-6 text-xs space-y-3">
              <h3 className="uppercase tracking-[0.2em] font-semibold text-[#292722] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#A88955]" /> Items ({searchedOrder.items.length})
              </h3>
              <div className="space-y-1.5 text-[#77736B]">
                {searchedOrder.items.map((it, i) => (
                  <p key={i}>
                    &bull; {it.productName} (Qty: {it.quantity})
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
