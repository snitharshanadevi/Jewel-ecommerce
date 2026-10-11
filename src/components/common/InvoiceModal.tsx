import React from 'react';
import { Order } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'long',
  }).format(new Date(order.createdAt));

  // 3% GST breakdown (1.5% CGST + 1.5% SGST)
  const gstAmount = order.pricing.gstAmount || Math.round((order.pricing.total * 3) / 103);
  const taxableAmount = order.pricing.taxableAmount || (order.pricing.total - gstAmount);
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 print:border-none print:shadow-none print:m-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar (Hidden during print) */}
        <div className="bg-[#292722] text-[#F8F6F1] px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A88955]"></span>
            <span className="font-serif text-lg tracking-wider">Tax Invoice & Authenticity Certificate</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A88955] text-white text-xs font-semibold hover:bg-[#8f7447] transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close invoice"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 md:p-10 text-[#292722] bg-white font-sans text-xs">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-stone-200 gap-4">
            <div>
              <h1 id="invoice-title" className="font-serif text-3xl tracking-widest text-[#292722] font-semibold">
                AUREVYA
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-[#A88955] font-medium mt-0.5">
                Tradition, Refined for Today
              </p>
              <p className="text-[11px] text-stone-500 mt-2">
                Aurevya Atelier Private Limited<br />
                Atelier Heritage House, 14 K.R. Road, Alwarpet<br />
                Chennai, Tamil Nadu 600018<br />
                GSTIN: 33AAACA9812K1Z9
              </p>
            </div>
            <div className="text-left md:text-right bg-stone-50 p-4 rounded-xl border border-stone-100">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-1">
                Tax Invoice (Original)
              </span>
              <p className="text-sm font-bold text-stone-900 mt-1">
                Invoice No: {order.invoiceNumber || `AUR-INV-${order.id}`}
              </p>
              <p className="text-stone-600 text-[11px]">Order Ref: {order.id}</p>
              <p className="text-stone-600 text-[11px]">Invoice Date: {invoiceDate}</p>
              <p className="text-stone-600 text-[11px]">State Code: 33 (Tamil Nadu)</p>
            </div>
          </div>

          {/* Billing & Shipping Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-stone-200">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400 mb-1.5">
                Billed & Shipped To
              </p>
              <p className="font-bold text-stone-900 text-sm">{order.customer.fullName}</p>
              <p className="text-stone-600 mt-0.5">{order.deliveryAddress.addressLine}</p>
              {order.deliveryAddress.addressLine2 && (
                <p className="text-stone-600">{order.deliveryAddress.addressLine2}</p>
              )}
              <p className="text-stone-600">
                {order.deliveryAddress.city}, {order.deliveryAddress.state} — {order.deliveryAddress.pincode}
              </p>
              <p className="text-stone-600 mt-1">Mobile: +91 {order.customer.phone}</p>
              <p className="text-stone-600">Email: {order.customer.email}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400 mb-1.5">
                Payment & Fulfillment
              </p>
              <p className="text-stone-800">
                <strong>Method:</strong> {order.payment.method.toUpperCase()} {order.payment.isDemo && '(Sandbox Verified)'}
              </p>
              <p className="text-stone-800 mt-0.5">
                <strong>Txn Reference:</strong> {order.payment.transactionId}
              </p>
              <p className="text-stone-800 mt-0.5">
                <strong>Payment Status:</strong> Paid in Full
              </p>
              <p className="text-stone-800 mt-0.5">
                <strong>Logistics:</strong> Insured BlueDart Secure Courier (Tamper Proof)
              </p>
            </div>
          </div>

          {/* Line Items */}
          <div className="py-6 border-b border-stone-200">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-200 text-[10px] uppercase tracking-wider text-stone-500">
                  <th className="py-2 font-semibold">Item & Description</th>
                  <th className="py-2 font-semibold">HSN</th>
                  <th className="py-2 text-center font-semibold">Qty</th>
                  <th className="py-2 text-right font-semibold">Rate</th>
                  <th className="py-2 text-right font-semibold">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="text-xs">
                    <td className="py-3 pr-2">
                      <p className="font-semibold text-stone-900">{item.productName}</p>
                      {item.selectedVariant && (
                        <p className="text-[11px] text-stone-500">Variant: {item.selectedVariant}</p>
                      )}
                      <p className="text-[10px] text-stone-400">Hallmark / Authenticity Tag: AUR-{item.productId.toUpperCase()}</p>
                    </td>
                    <td className="py-3 text-stone-500 text-[11px]">7113</td>
                    <td className="py-3 text-center text-stone-800 font-medium">{item.quantity}</td>
                    <td className="py-3 text-right text-stone-700">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 text-right font-semibold text-stone-900">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary / Tax Calculation */}
          <div className="py-6 flex flex-col md:flex-row justify-between items-start gap-6 border-b border-stone-200">
            <div className="text-[11px] text-stone-500 max-w-sm">
              <p className="font-semibold text-stone-700 mb-1">Authenticity & Quality Guarantee:</p>
              <p>
                Each AUREVYA heirloom piece undergoes meticulous multi-point inspection. Accompanied by
                our Certificate of Authenticity confirming premium anti-tarnish finish and micron gold plating.
              </p>
            </div>

            <div className="w-full md:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal (Gross)</span>
                <span>{formatCurrency(order.pricing.subtotal)}</span>
              </div>
              {order.pricing.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Atelier Privilege Discount</span>
                  <span>- {formatCurrency(order.pricing.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Insured Express Shipping</span>
                <span>{order.pricing.shipping === 0 ? 'Complimentary' : formatCurrency(order.pricing.shipping)}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-[11px] pt-1 border-t border-dashed border-stone-200">
                <span>Taxable Value</span>
                <span>{formatCurrency(taxableAmount)}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-[11px]">
                <span>CGST (1.5%)</span>
                <span>{formatCurrency(cgst)}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-[11px]">
                <span>SGST (1.5%)</span>
                <span>{formatCurrency(sgst)}</span>
              </div>
              <div className="flex justify-between text-stone-900 font-bold text-sm pt-2 border-t border-stone-300">
                <span>Total Amount Paid</span>
                <span className="font-serif text-base text-[#A88955]">{formatCurrency(order.pricing.total)}</span>
              </div>
            </div>
          </div>

          {/* Signoff */}
          <div className="pt-6 flex justify-between items-end text-[10px] text-stone-400">
            <div>
              <p>This is a computer-generated invoice and requires no physical signature.</p>
              <p>For any queries, contact concierge@aurevya.com or +91 98765 43210.</p>
            </div>
            <div className="text-right">
              <p className="font-serif italic text-stone-600 text-xs">Aurevya Atelier Seal of Authenticity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
