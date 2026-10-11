import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiMessage, Product } from '../../types';
import { AiAssistantService, INITIAL_AI_MESSAGE } from '../../services/aiAssistantService';
import { useCart } from '../../context/CartContext';
import { useSupport } from '../../context/SupportContext';
import { formatCurrency } from '../../utils/formatters';

export const AiJewelleryAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([INITIAL_AI_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { openSupport } = useSupport();

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    setHasError(false);
    const userMsg: AiMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await AiAssistantService.processUserQuery(text, messages);
      setMessages((prev) => [...prev, response]);
    } catch {
      setHasError(true);
      const errorMsg: AiMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I apologize, our styling assistant encountered a momentary service interruption. Please try asking again or connect directly with our human concierge team.',
        timestamp: 'Just now',
        quickReplies: ['Try Again', 'Connect with WhatsApp Concierge', 'Book Video Consultation'],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (pill: string) => {
    if (pill === 'Connect with WhatsApp Concierge') {
      openSupport({ initialTab: 'concierge' });
    } else if (pill === 'Book Video Consultation' || pill === 'Book a Video Consultation') {
      openSupport({ initialTab: 'video' });
    } else if (pill === 'Try Again') {
      handleSendMessage('Recommend South Indian bridal jewellery');
    } else {
      handleSendMessage(pill);
    }
  };

  const handleAddToCartConfirm = (product: Product) => {
    addToCart(product, 1);
    setAddedItemName(product.name);
    setTimeout(() => setAddedItemName(null), 3000);
  };

  const handleViewProduct = (slug: string) => {
    navigate(`/product/${slug}`);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AUREVYA Atelier AI Jewellery Concierge"
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#292722] hover:bg-[#1f1e1a] text-[#F8F6F1] rounded-full shadow-2xl border border-[#A88955]/40 transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A88955] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#A88955]"></span>
            </span>
            <div className="text-left">
              <p className="text-[10px] tracking-widest uppercase text-[#A88955] font-semibold leading-none">
                AI CONCIERGE
              </p>
              <p className="font-serif text-xs font-medium text-white tracking-wide">
                Ask Atelier Stylist
              </p>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#A88955]/20 flex items-center justify-center text-xs">
              ✨
            </div>
          </button>
        ) : null}
      </div>

      {/* Floating Assistant Window */}
      {isOpen && (
        <div
          role="region"
          aria-label="AUREVYA AI Jewellery Assistant"
          className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-[#FAF5EB] rounded-2xl shadow-2xl border border-[#E8E2D9] flex flex-col overflow-hidden animate-slide-up print:hidden"
        >
          {/* Header */}
          <div className="bg-[#292722] text-[#F8F6F1] px-5 py-3.5 flex items-center justify-between border-b border-[#A88955]/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#A88955] text-stone-900 flex items-center justify-center text-sm font-bold shadow-xs">
                ✨
              </div>
              <div>
                <h3 className="font-serif text-sm font-semibold tracking-wide text-white">
                  AUREVYA Atelier Concierge
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-stone-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Grounded in Active Catalogue</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => openSupport({ initialTab: 'concierge' })}
                title="Escalate to Human Stylist"
                className="px-2 py-1 text-[11px] rounded bg-[#A88955]/20 hover:bg-[#A88955]/30 text-[#A88955] transition-colors"
              >
                Human Support
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Minimize assistant"
                className="w-7 h-7 rounded-full flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Feedback Banner if an item was added */}
          {addedItemName && (
            <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs text-emerald-800 flex items-center justify-between animate-fade-in">
              <span>✓ Added &ldquo;{addedItemName}&rdquo; to your shopping bag.</span>
              <button
                onClick={() => navigate('/cart')}
                className="font-semibold underline text-emerald-900 hover:text-emerald-700 ml-2"
              >
                View Bag
              </button>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1 mb-1 text-[10px] text-stone-400">
                  <span>{msg.sender === 'user' ? 'You' : 'Atelier Stylist'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#292722] text-[#F8F6F1] rounded-tr-xs'
                      : 'bg-white text-stone-800 border border-[#E8E2D9] shadow-xs rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Grounded Product Recommendations Carousel/Cards */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="mt-3 space-y-2.5 pt-2.5 border-t border-stone-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#A88955]">
                        Curated Recommendations:
                      </p>
                      {msg.suggestedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-3 p-2 bg-[#FAF5EB] rounded-xl border border-[#E8E2D9] hover:border-[#A88955] transition-all"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover bg-white shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-serif font-semibold text-stone-900 text-xs truncate">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-stone-500 truncate">
                              {p.category} {p.southIndianOrigin ? `• ${p.southIndianOrigin}` : ''}
                            </p>
                            <p className="font-semibold text-stone-900 text-xs mt-0.5">
                              {formatCurrency(p.price)}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              onClick={() => handleViewProduct(p.slug)}
                              className="px-2 py-1 text-[10px] font-semibold bg-white border border-stone-200 text-stone-800 rounded-md hover:bg-stone-50 transition-colors"
                            >
                              Inspect
                            </button>
                            <button
                              onClick={() => handleAddToCartConfirm(p)}
                              className="px-2 py-1 text-[10px] font-semibold bg-[#292722] text-[#F8F6F1] rounded-md hover:bg-[#A88955] transition-colors"
                            >
                              Add to Bag
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Reply Pills */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="mt-3 pt-2 flex flex-wrap gap-1.5 border-t border-stone-100">
                      {msg.quickReplies.map((pill, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickReply(pill)}
                          className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#A88955]/10 text-stone-800 hover:bg-[#A88955]/20 hover:text-stone-900 transition-colors"
                        >
                          {pill}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex flex-col items-start animate-fade-in">
                <div className="bg-white p-3 rounded-2xl rounded-tl-xs border border-[#E8E2D9] text-xs text-stone-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A88955] animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-[#A88955] animate-bounce delay-100"></span>
                  <span className="w-2 h-2 rounded-full bg-[#A88955] animate-bounce delay-200"></span>
                  <span className="text-[11px]">Consulting jewellery archive...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-[#E8E2D9]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about Attigai, bridal sets, weight, or budget..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 text-xs text-stone-900 bg-[#FAF5EB] border border-[#E8E2D9] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#A88955]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send query"
                className="w-9 h-9 rounded-xl bg-[#292722] hover:bg-[#A88955] text-white flex items-center justify-center disabled:opacity-40 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
            <div className="mt-1 flex items-center justify-between text-[10px] text-stone-400 px-1">
              <span>Verified against active stock</span>
              <button
                type="button"
                onClick={() => openSupport({ initialTab: 'concierge' })}
                className="hover:text-stone-700 underline"
              >
                Need human assistance?
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
