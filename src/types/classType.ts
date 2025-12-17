export interface Category {
  id: string;
  name: string;
  is_active: boolean;
  createdAt: string;
}

export interface ClassType {
  id?: string;
  name: string;
  paymentLink?: string;
  category?: string;
  credit: number;
  defaultPrice?: number;
  price?: number;
  paymentMethod?: PaymentMethodType;
  payment_gateway?: number;
  currency?: CurrencyType;
  currency_name?: string;
  payment_gateway_name?: string;
  category_name?: string;
  duration: number; // in minutes
  sessionType?: SessionType;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type PaymentMethodType =
  | "credit_card"
  | "bank_transfer"
  | "cash"
  | "upi"
  | "paypal";
export type CurrencyType = "USD" | "INR" | "CAD" | "EUR" | "GBP";
export type SessionType = "private" | "group";
