import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, MapPin, ArrowRight, ShieldCheck, FileText, Headphones, MessageSquare, Mail, Smartphone } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useSupport } from '../context/SupportContext';
import { formatCurrency } from '../utils/formatters';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { InvoiceModal } from '../components/common/InvoiceModal';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const { getOrderById, orders } = useOrders();
  const { openSupport } = useSupport();

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const order = getOrderById(orderId) || orders[0];

  const breadcrumbs = [
    { label: 'Shopping Bag', to: '/cart' },
    { label: 'Order Confirmation' },
  ];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif-luxury text-2xl text-[#292722]">Order Not Found</h2>
        <Link to="/" className="text-xs text-[#A88955] hover:underline mt-4 inline-block font-semibold">
          Return to Home
        </Link>
      </div>
    );
  }

  const isCod = order.payment.method === 'cod';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* Confirmation Hero Card */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-10 shadow-xs mb-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-2xl">
          ✓
        </div>

        <span className="text-[11px] uppercase tracking-[0.25em] text-[#A88955] font-semibold">
          {isCod ? 'ORDER PLACED • CASH ON DELIVERY' : 'PAYMENT CONFIRMED • SERVER VERIFIED'}
        </span>

        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#292722] mt-1 font-light">
          Thank You, {order.customer.fullName.split(' ')[0]}
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-lg mx-auto leading-relaxed">
          Your handcrafted jewellery suite is registered under order reference{' '}
          <strong className="text-stone-900 font-mono font-bold">{order.id}</strong>.
          {isCod
            ? ' Payment will be collected at your doorstep upon tamper-evident seal verification.'
            : ' Your payment was verified server-side in our sandbox payment environment.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
          <button
            onClick={() => setIsInvoiceOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#292722] text-[#F8F6F1] text-xs uppercase tracking-wider font-semibold hover:bg-[#A88955] transition-colors flex items-center justify-center gap-2 rounded-xl shadow-xs"
          >
            <FileText className="w-4 h-4 text-[#A88955]" />
            <span>Download Tax Invoice</span>
          </button>

          <Link
            to={`/track-order?orderId=${encodeURIComponent(order.id)}&contact=${encodeURIComponent(order.customer.phone || order.customer.email)}`}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#A88955] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#8F7241] transition-colors flex items-center justify-center gap-2 rounded-xl shadow-xs"
          >
            <span>Track Order Timeline</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => openSupport({ orderReference: order.id })}
            className="w-full sm:w-auto px-5 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 rounded-xl"
          >
            <Headphones className="w-4 h-4 text-stone-600" />
            <span>Order Support</span>
          </button>
        </div>
      </div>

      {/* Backend Notification Dispatch Status */}
      <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-2xl p-5 mb-8 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">
            Automated Customer Notification Status
          </span>
          <span className="text-[10px] uppercase font-bold text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
            Backend Dispatch Adapter
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-stone-900 truncate">SMS Dispatch</p>
              <p className="text-[10px] text-emerald-700 font-medium">Simulated Sent (+91 {order.customer.phone})</p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-stone-900 truncate">Email Tax Invoice</p>
              <p className="text-[10px] text-emerald-700 font-medium">Dispatched to Inbox</p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-stone-900 truncate">WhatsApp Alert</p>
              <p className="text-[10px] text-emerald-700 font-medium">Tracking Link Pushed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Items Summary */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-4 shadow-xs">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#292722] pb-2 border-b border-[#E8E2D9] flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-[#A88955]" />
            Ordered Jewellery Pieces ({order.items.length})
          </h2>

          <div className="divide-y divide-[#E8E2D9]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt=""
                    className="w-12 h-12 object-cover rounded-xl border border-[#E8E2D9]"
                  />
                  <div>
                    <p className="font-serif font-semibold text-[#292722] text-sm">{item.productName}</p>
                    <p className="text-[11px] text-stone-500">
                      Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant}` : ''}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-[#292722]">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8E2D9] space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Gross Subtotal:</span>
              <span className="text-[#292722]">{formatCurrency(order.pricing.subtotal)}</span>
            </div>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Atelier Discount:</span>
                <span>-{formatCurrency(order.pricing.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Insured Shipping:</span>
              <span>{order.pricing.shipping === 0 ? 'Complimentary' : formatCurrency(order.pricing.shipping)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-stone-500">
              <span>Applicable GST (3%):</span>
              <span>{formatCurrency(order.pricing.gstAmount || Math.round((order.pricing.total * 3) / 103))}</span>
            </div>
            <div className="pt-2 border-t border-[#E8E2D9] flex justify-between font-bold text-sm text-[#292722]">
              <span>Final Paid Amount:</span>
              <span className="font-serif text-[#A88955] text-base">{formatCurrency(order.pricing.total)}</span>
            </div>
          </div>
        </div>

        {/* Delivery & Payment Summary */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-6 shadow-xs">
          {/* Delivery Details */}
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#292722] pb-2 border-b border-[#E8E2D9] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#A88955]" />
              Shipping Destination
            </h2>
            <div className="text-xs text-stone-600 pt-2 space-y-1">
              <p className="font-semibold text-stone-900">{order.customer.fullName}</p>
              <p>{order.deliveryAddress.addressLine}</p>
              {order.deliveryAddress.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
              <p>
                {order.deliveryAddress.city}, {order.deliveryAddress.state} — {order.deliveryAddress.pincode}
              </p>
              {order.deliveryAddress.landmark && <p>Landmark: {order.deliveryAddress.landmark}</p>}
              <p className="pt-1 text-stone-900">Phone: +91 {order.customer.phone}</p>
            </div>
          </div>

          {/* Payment & Transit info */}
          <div className="pt-4 border-t border-[#E8E2D9] space-y-3">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#292722]">
              Payment & Dispatch Details
            </h3>

            <div className="bg-[#FAF8F5] p-3.5 border border-[#E8E2D9] rounded-xl text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Mode:</span>
                <span className="font-semibold text-stone-900 uppercase">
                  {order.payment.method} {order.payment.isDemo && '(Sandbox Verified)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Txn Reference:</span>
                <span className="font-mono text-stone-900">{order.payment.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Status:</span>
                <span className={`font-semibold capitalize ${isCod ? 'text-amber-800' : 'text-emerald-700'}`}>
                  {isCod ? 'Pending (Pay on Delivery)' : 'Paid in Full'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Estimated Delivery:</span>
                <span className="font-medium text-stone-900">{order.estimatedDeliveryDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-500">
              <ShieldCheck className="w-4 h-4 text-[#A88955] shrink-0" />
              <span>Includes Certificate of Handcrafted Origin, Hallmarking Guarantee & Care Instructions.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        order={order}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
};
