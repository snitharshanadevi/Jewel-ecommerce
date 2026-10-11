import { DEMO_PRODUCTS } from '../data/demoProducts';
import { Product, AiMessage } from '../types';

/**
 * AUREVYA Intelligent Jewellery Concierge Engine
 * Grounded in the active AUREVYA catalogue and approved atelier guidelines.
 */

export const INITIAL_AI_MESSAGE: AiMessage = {
  id: 'msg-init',
  sender: 'assistant',
  text: 'Vanakkam & Welcome to AUREVYA Atelier Concierge. I am your personal jewellery styling assistant. How may I assist you today?',
  timestamp: 'Just now',
  quickReplies: [
    'South Indian Temple Jewels',
    'Find Bridal Muhurtham Suite',
    'Gift Under ₹15,000',
    'Care & Shipping Guidelines',
  ],
};

export const AiAssistantService = {
  async processUserQuery(query: string, chatHistory: AiMessage[]): Promise<AiMessage> {
    // Simulate intelligent assistant typing latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const q = query.toLowerCase().trim();
    const timestamp = 'Just now';
    const id = `ai-${Date.now()}`;

    // 1. South Indian Jewels Query
    if (q.includes('south indian') || q.includes('attigai') || q.includes('jhimikki') || q.includes('kammal') || q.includes('manga malai') || q.includes('valayal')) {
      const matched = DEMO_PRODUCTS.filter(
        (p) => p.collectionGroup === 'South Indian Heirlooms' || p.category === 'Attigai' || p.category === 'Jhimikki Kammal' || p.category === 'Manga Malai' || p.category === 'South Indian Valayal'
      ).slice(0, 3);

      return {
        id,
        sender: 'assistant',
        text: 'Our South Indian Heirlooms are sculpted by hereditary Thanjavur and Chettinad masters using authentic kemp stones, hollow-dome featherlight domes, and 24k micron temple gold dips. Here are our most celebrated creations for you:',
        timestamp,
        suggestedProducts: matched,
        quickReplies: [
          'Tell me about Chettinad Attigai',
          'Are Jhimikkis heavy on earlobes?',
          'Book a Video Consultation',
        ],
      };
    }

    // 2. Bridal & Wedding Suite Query
    if (q.includes('bridal') || q.includes('wedding') || q.includes('muhurtham') || q.includes('marriage')) {
      const matched = DEMO_PRODUCTS.filter(
        (p) => p.occasions.includes('Wedding') || p.category === 'Bridal Sets' || p.category === 'Attigai'
      ).slice(0, 3);

      return {
        id,
        sender: 'assistant',
        text: 'For wedding ceremonies and sacred Muhurthams, we recommend layering an imperial close-fitting choker or Attigai with a longer Kasu Malai or Mango Haram, complemented by Nakshi Nagas bangles and Vanki armlets:',
        timestamp,
        suggestedProducts: matched,
        quickReplies: [
          'View Complete Bridal Set',
          'Speak with Bridal Stylist on WhatsApp',
          'Book Video Consultation',
        ],
      };
    }

    // 3. Budget Specific Queries (Under 10k or 15k)
    if (q.includes('budget') || q.includes('15000') || q.includes('10000') || q.includes('under') || q.includes('affordable') || q.includes('gift')) {
      const budgetMatched = DEMO_PRODUCTS.filter((p) => p.price <= 15000).slice(0, 3);

      return {
        id,
        sender: 'assistant',
        text: 'Here are our most beloved handcrafted jewels under ₹15,000, perfect for celebratory gifting or building your personal treasure casket:',
        timestamp,
        suggestedProducts: budgetMatched,
        quickReplies: [
          'Show Jewels Under ₹10,000',
          'Show Rings & Pendants',
          'Apply Promo Code',
        ],
      };
    }

    // 4. Earlobe Weight & Comfort Question
    if (q.includes('heavy') || q.includes('weight') || q.includes('earlobe') || q.includes('hurt') || q.includes('pain')) {
      const jhumkas = DEMO_PRODUCTS.filter((p) => p.category === 'Jhimikki Kammal' || p.category === 'Jhumkas').slice(0, 2);
      return {
        id,
        sender: 'assistant',
        text: 'Every AUREVYA jhumka is engineered with hollow interior domes and includes complimentary medical-grade silicone cushion backings. For instance, our Thanjavur Jhimikkis weigh only 22g per pair — designed for 12 hours of ceremonial wear without earlobe pull.',
        timestamp,
        suggestedProducts: jhumkas,
        quickReplies: [
          'Show Thanjavur Jhimikkis',
          'Show Lightweight Studs',
        ],
      };
    }

    // 5. Shipping & Returns Policy
    if (q.includes('shipping') || q.includes('delivery') || q.includes('return') || q.includes('cod') || q.includes('pincode')) {
      return {
        id,
        sender: 'assistant',
        text: 'AUREVYA Policy Highlights:\n• Complimentary insured express courier via BlueDart on all orders over ₹4,000 (flat ₹250 below ₹4,000).\n• Transit time is 2 to 4 business days with tamper-evident security seal.\n• Cash on Delivery available across major Indian pincodes.\n• 7-Day Privilege Exchange & Returns for unworn pieces with intact seals.',
        timestamp,
        quickReplies: [
          'Check My Pincode',
          'Explore Collections',
          'Contact WhatsApp Support',
        ],
      };
    }

    // 6. Care Instructions
    if (q.includes('care') || q.includes('clean') || q.includes('tarnish') || q.includes('polish')) {
      return {
        id,
        sender: 'assistant',
        text: 'Atelier Care Guide:\n1. Keep jewels away from moisture, deodorants, perfumes, and hairsprays.\n2. Gently wipe with a soft dry microfiber cloth after every wear.\n3. Store each piece separately in the provided velvet keepsake pouch to prevent scratching.',
        timestamp,
        quickReplies: [
          'Browse New Arrivals',
          'Talk to Concierge',
        ],
      };
    }

    // Default intelligent fallback with matched products
    const defaultSuggestions = DEMO_PRODUCTS.filter((p) => p.isBestseller).slice(0, 3);
    return {
      id,
      sender: 'assistant',
      text: `I would be delighted to guide you. Are you searching for a particular adornment (such as an Attigai, Jhimikkis, Kasu Malai, or Kada bangles), or looking for a specific occasion like a Muhurtham wedding?`,
      timestamp,
      suggestedProducts: defaultSuggestions,
      quickReplies: [
        'South Indian Heirlooms',
        'Bridal Jewellery',
        'Everyday Minimal',
        'Book Video Consultation',
      ],
    };
  },
};
