// Product types
export interface Product {
  id: string;
  image: string;
  name: string;
  rating: {
    stars: number;
    count: number;
  };
  priceCents: number;
  keywords: string[];
  type?: string;
  sizeChartLink?: string;
  instructionsLink?: string;
  warrantyLink?: string;
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  deliveryOptionId: string;
  product?: Product;
}

// Order types
export interface Order {
  id: string;
  orderTime: string;
  orderTimeMs: number;
  totalCostCents: number;
  deliveryDate: string;
  createdAt?: string;
  products: OrderProduct[];
}

export interface OrderProduct {
  productId: string;
  quantity: number;
  estimatedDeliveryTime: string;
  estimatedDeliveryTimeMs: number;
  variation?: string;
  product?: Product;
}

// Delivery types
export interface DeliveryOption {
  id: string;
  deliveryDays: number;
  priceCents: number;
  estimatedDeliveryTimeMs?: number;
}

// Payment Summary type for checkout
export interface PaymentSummaryData {
  totalItems: number;
  productCostCents: number;
  shippingCostCents: number;
  totalCostBeforeTaxCents: number;
  taxCents: number;
  totalCostCents: number;
}

// Component props
export interface HeaderProps {
  cart: CartItem[];
}

export interface HomePageProps {
  cart: CartItem[];
  loadCart: () => Promise<void>;
}

export interface CheckoutPageProps {
  cart: CartItem[];
  loadCart: () => Promise<void>;
}

export interface OrdersPageProps {
  cart: CartItem[];
  loadCart: () => Promise<void>;
}

export interface TrackingPageProps {
  cart: CartItem[];
}

export interface NotFoundPageProps {
  cart: CartItem[];
}

export interface ProductsGridProps {
  products: Product[];
  loadCart: () => Promise<void>;
}

export interface ProductProps {
  product: Product;
  loadCart: () => Promise<void>;
}

// Checkout component props
export interface CheckoutHeaderProps {
  cart: CartItem[];
}

export interface OrderSummaryProps {
  cart: CartItem[];
  deliveryOptions: DeliveryOption[];
  loadCart: () => Promise<void>;
}

export interface PaymentSummaryProps {
  paymentSummary: PaymentSummaryData;
  loadCart: () => Promise<void>;
}

export interface CartItemDetailsProps {
  cartItem: CartItem;
  loadCart: () => Promise<void>;
}

export interface DeliveryOptionsProps {
  cartItem: CartItem;
  deliveryOptions: DeliveryOption[];
  loadCart: () => Promise<void>;
}

export interface DeliveryDateProps {
  cartItem: CartItem;
  deliveryOptions: DeliveryOption[];
}

// Orders component props
export interface OrdersGridProps {
  orders: Order[];
  loadCart: () => Promise<void>;
}

export interface OrderDetailsProps {
  order: Order;
  loadCart: () => Promise<void>;
}

export interface OrdersHeaderProps {
  order: Order;
}