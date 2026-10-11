export type JewelleryCategory =
  | 'Earrings'
  | 'Jhumkas'
  | 'Necklaces'
  | 'Chokers'
  | 'Bangles'
  | 'Bracelets'
  | 'Rings'
  | 'Pendants'
  | 'Temple Jewellery'
  | 'Kundan Jewellery'
  | 'Bridal Sets'
  | 'Minimal Jewellery'
  | 'Attigai'
  | 'Manga Malai'
  | 'Kasu Malai'
  | 'Jhimikki Kammal'
  | 'South Indian Valayal'
  | 'Vanki & Hip Belts';

export type JewelleryStyle =
  | 'Traditional'
  | 'Contemporary'
  | 'Fusion'
  | 'Bridal'
  | 'Everyday'
  | 'Festive'
  | 'South Indian Heritage';

export type MaterialFinish =
  | 'gold-tone'
  | 'silver-tone'
  | 'oxidised'
  | 'pearl'
  | 'gemstone'
  | 'kemp stone';

export type JewelleryOccasion =
  | 'Wedding'
  | 'Festive'
  | 'Party'
  | 'Daily Wear'
  | 'Cocktail'
  | 'Gifting'
  | 'Puja & Muhurtham';

export interface ProductVariant {
  id: string;
  name: string;
  type: 'size' | 'finish' | 'tone';
  inStock: boolean;
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  productName: string;
  productSlug: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: JewelleryCategory;
  price: number;
  originalPrice?: number;
  description: string;
  story?: string;
  styles: JewelleryStyle[];
  material: MaterialFinish;
  occasions: JewelleryOccasion[];
  availability: 'in-stock' | 'limited-stock' | 'made-to-order';
  images: string[];
  dimensions?: string;
  approxWeight?: string;
  variants?: ProductVariant[];
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  collectionGroup?: 'Traditional Heritage' | 'Modern Essentials' | 'Festive Edit' | 'Everyday Elegance' | 'Bridal Couture' | 'South Indian Heirlooms';
  rating: number;
  reviewsCount: number;
  craftDetails?: string;
  southIndianOrigin?: string; // e.g. "Thanjavur Temple Goldsmithing", "Chettinad Heritage", "Madurai Nagas Work"
}

export interface CartItem {
  id: string; // unique key: productId + variant
  productId: string;
  product: Product;
  selectedVariant?: string;
  quantity: number;
  unitPrice: number;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface DeliveryAddress {
  addressLine: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  deliveryInstructions?: string;
}

export interface SavedAddress extends DeliveryAddress {
  id: string;
  label?: 'Home' | 'Work' | 'Other';
  recipientName?: string;
  recipientPhone?: string;
  isDefault?: boolean;
}

export interface CustomerUser {
  id: string;
  phone: string;
  fullName?: string;
  email?: string;
  savedAddresses: SavedAddress[];
  createdAt: string;
}

export interface OrderPricing {
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  taxableAmount?: number;
  gstAmount?: number;
  total: number;
}

export type PaymentMethod = 'cod' | 'upi' | 'card' | 'netbanking';

export type PaymentLifecycleState =
  | 'creating'
  | 'awaiting_payment'
  | 'verifying'
  | 'successful'
  | 'failed'
  | 'cancelled'
  | 'verification_pending';

export interface PaymentDetails {
  method: PaymentMethod;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  transactionId: string;
  isDemo: boolean;
  paidAt?: string;
  upiAppUsed?: string;
  lifecycleState?: PaymentLifecycleState;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderStatusStep {
  key: OrderStatus;
  label: string;
  timestamp: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface NotificationDispatchStatus {
  sms: 'pending' | 'dispatched' | 'simulated_sent' | 'not_configured';
  email: 'pending' | 'dispatched' | 'simulated_sent' | 'not_configured';
  whatsapp: 'pending' | 'dispatched' | 'simulated_sent' | 'not_configured';
}

export interface Order {
  id: string; // e.g. AUR-2026-94821
  invoiceNumber?: string;
  createdAt: string;
  customer: CustomerDetails;
  deliveryAddress: DeliveryAddress;
  items: {
    productId: string;
    productName: string;
    slug: string;
    image: string;
    unitPrice: number;
    quantity: number;
    selectedVariant?: string;
  }[];
  pricing: OrderPricing;
  payment: PaymentDetails;
  status: OrderStatus;
  statusTimeline: OrderStatusStep[];
  estimatedDeliveryDate: string;
  canCancel: boolean;
  notifications?: NotificationDispatchStatus;
}

export interface FilterState {
  searchQuery: string;
  categories: JewelleryCategory[];
  styles: JewelleryStyle[];
  materials: MaterialFinish[];
  occasions: JewelleryOccasion[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'newest' | 'price-low' | 'price-high' | 'name-asc';
}

export interface VideoConsultationBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  topic: 'Bridal Trousseau Styling' | 'Custom Fitting & Sizing' | 'South Indian Temple Heirlooms' | 'Everyday Minimal Fine Jewels';
  date: string;
  timeSlot: string;
  preferredLanguage: 'English' | 'Tamil' | 'Hindi' | 'Telugu';
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
  isDemo: boolean;
  createdAt: string;
}

export interface AiMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedProducts?: Product[];
  quickReplies?: string[];
  actionType?: 'view_product' | 'add_to_cart' | 'contact_support' | 'book_consultation';
  actionPayload?: any;
}
