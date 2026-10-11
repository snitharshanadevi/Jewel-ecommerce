import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus, OrderStatusStep } from '../types';
import { generateOrderId } from '../utils/formatters';

interface OrderContextType {
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'statusTimeline' | 'canCancel'>) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  cancelOrder: (orderId: string) => { success: boolean; message: string };
  findOrderForTracking: (orderId: string, emailOrPhone: string) => Order | null;
}

const ORDERS_STORAGE_KEY = 'aurevya_orders_v1';

const INITIAL_DEMO_ORDER: Order = {
  id: 'AUR-2026-88142',
  createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 1.5 days ago
  customer: {
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '9876543210',
  },
  deliveryAddress: {
    addressLine: 'Flat 402, Royal Palms Residences, Golf Course Road',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    landmark: 'Opposite DLF Cyber City Phase 5',
  },
  items: [
    {
      productId: 'aur-001',
      productName: 'Padmavati Kundan Choker Suite',
      slug: 'padmavati-kundan-choker-suite',
      image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80',
      unitPrice: 38500,
      quantity: 1,
      selectedVariant: 'Emerald Drop',
    },
  ],
  pricing: {
    subtotal: 38500,
    discount: 3850,
    couponCode: 'AUREVYA10',
    shipping: 0,
    total: 34650,
  },
  payment: {
    method: 'upi',
    status: 'completed',
    transactionId: 'DEMO-UPI-984271892',
    isDemo: true,
    paidAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
  status: 'shipped',
  statusTimeline: [
    {
      key: 'placed',
      label: 'Order Placed',
      timestamp: 'Yesterday, 10:30 AM',
      description: 'Your order was successfully received and registered in our atelier system.',
      isCompleted: true,
      isCurrent: false,
    },
    {
      key: 'confirmed',
      label: 'Confirmed',
      timestamp: 'Yesterday, 11:15 AM',
      description: 'Handcrafted items inspected and allocated by master artisans.',
      isCompleted: true,
      isCurrent: false,
    },
    {
      key: 'packed',
      label: 'Packed',
      timestamp: 'Yesterday, 04:00 PM',
      description: 'Placed inside velvet keepsake jewel box with wax seal & tamper-evident lock.',
      isCompleted: true,
      isCurrent: false,
    },
    {
      key: 'shipped',
      label: 'Shipped',
      timestamp: 'Today, 09:45 AM',
      description: 'Handed over to BlueDart Secure Express. Tracking AWB: BD-AUR-99201.',
      isCompleted: true,
      isCurrent: true,
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      timestamp: 'Pending dispatch',
      description: 'Shipment arrived at destination hub. Courier agent scheduled for delivery.',
      isCompleted: false,
      isCurrent: false,
    },
    {
      key: 'delivered',
      label: 'Delivered',
      timestamp: 'Expected Tomorrow',
      description: 'Delivered directly with OTP verification and tamper-check receipt.',
      isCompleted: false,
      isCurrent: false,
    },
  ],
  estimatedDeliveryDate: 'Tomorrow, by 7:00 PM',
  canCancel: false,
};

function generateTimelineForNewOrder(): OrderStatusStep[] {
  const now = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date());

  return [
    {
      key: 'placed',
      label: 'Order Placed',
      timestamp: now,
      description: 'Order registered in our atelier system. Confirmation email dispatched.',
      isCompleted: true,
      isCurrent: true,
    },
    {
      key: 'confirmed',
      label: 'Confirmed',
      timestamp: 'Within 2 hours',
      description: 'Quality audit by master jewellery curator.',
      isCompleted: false,
      isCurrent: false,
    },
    {
      key: 'packed',
      label: 'Packed',
      timestamp: 'Within 24 hours',
      description: 'Secured in plush velvet presentation box with wax seal.',
      isCompleted: false,
      isCurrent: false,
    },
    {
      key: 'shipped',
      label: 'Shipped',
      timestamp: 'Within 48 hours',
      description: 'Dispatched via insured express logistics.',
      isCompleted: false,
      isCurrent: false,
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      timestamp: 'Day of delivery',
      description: 'Arriving at your doorstep with secure OTP verification.',
      isCompleted: false,
      isCurrent: false,
    },
    {
      key: 'delivered',
      label: 'Delivered',
      timestamp: 'Estimated 3-4 business days',
      description: 'Signature on delivery with certificate of craftsmanship.',
      isCompleted: false,
      isCurrent: false,
    },
  ];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return [INITIAL_DEMO_ORDER];
    } catch {
      return [INITIAL_DEMO_ORDER];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  const createOrder = (
    orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'statusTimeline' | 'canCancel'>
  ): Order => {
    const newId = generateOrderId();
    const createdAt = new Date().toISOString();
    const timeline = generateTimelineForNewOrder();

    const newOrder: Order = {
      ...orderData,
      id: newId,
      invoiceNumber: orderData.invoiceNumber || `AUR-INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt,
      status: 'placed',
      statusTimeline: timeline,
      canCancel: true,
      notifications: orderData.notifications || {
        sms: 'simulated_sent',
        email: 'simulated_sent',
        whatsapp: 'simulated_sent',
      },
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((o) => o.id.toUpperCase() === orderId.trim().toUpperCase());
  };

  const findOrderForTracking = (orderId: string, emailOrPhone: string): Order | null => {
    const cleanId = orderId.trim().toUpperCase();
    const cleanContact = emailOrPhone.trim().toLowerCase();

    const order = orders.find((o) => {
      const idMatch = o.id.toUpperCase() === cleanId;
      if (!idMatch) return false;
      const emailMatch = o.customer.email.toLowerCase() === cleanContact;
      const phoneMatch = o.customer.phone.replace(/\D/g, '') === cleanContact.replace(/\D/g, '');
      return emailMatch || phoneMatch;
    });

    return order || null;
  };

  const cancelOrder = (orderId: string): { success: boolean; message: string } => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) {
      return { success: false, message: 'Order not found.' };
    }

    if (target.status !== 'placed' && target.status !== 'confirmed') {
      return {
        success: false,
        message: 'This order has already been dispatched and cannot be cancelled automatically. Please contact concierge support.',
      };
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'cancelled' as OrderStatus,
            canCancel: false,
            statusTimeline: [
              ...o.statusTimeline,
              {
                key: 'cancelled' as OrderStatus,
                label: 'Order Cancelled',
                timestamp: 'Just now',
                description: 'Customer requested cancellation. Any demo payment hold has been released.',
                isCompleted: true,
                isCurrent: true,
              },
            ],
          };
        }
        return o;
      })
    );

    return { success: true, message: 'Order has been successfully cancelled.' };
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        cancelOrder,
        findOrderForTracking,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
