
import { Category, ClassType } from "@/types/classType";

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "India",
    enabled: true,
    createdAt: "2024-01-01"
  },
  {
    id: "2", 
    name: "US",
    enabled: true,
    createdAt: "2024-01-02"
  }
];

export const mockClassTypes: ClassType[] = [
  // India
  { 
    id: "1", 
    name: "Pvt 40 min", 
    paymentLink: "https://pay.artgharana.com/pvt40-india", 
    enabled: true, 
    categoryId: "1", 
    defaultCredits: 4, 
    defaultPrice: 1800,
    paymentMethod: 'upi',
    currency: 'INR',
    duration: 40,
    sessionType: 'private'
  },
  { 
    id: "2", 
    name: "Pvt 60 min", 
    paymentLink: "https://pay.artgharana.com/pvt60-india", 
    enabled: true, 
    categoryId: "1", 
    defaultCredits: 4, 
    defaultPrice: 2500,
    paymentMethod: 'upi',
    currency: 'INR',
    duration: 60,
    sessionType: 'private'
  },
  { 
    id: "3", 
    name: "Group 60 min", 
    paymentLink: "https://pay.artgharana.com/group60-india", 
    enabled: true, 
    categoryId: "1", 
    defaultCredits: 4, 
    defaultPrice: 2000,
    paymentMethod: 'bank_transfer',
    currency: 'INR',
    duration: 60,
    sessionType: 'group'
  },
  
  // US
  { 
    id: "4", 
    name: "Pvt 40 min", 
    paymentLink: "https://pay.artgharana.com/pvt40-us", 
    enabled: true, 
    categoryId: "2", 
    defaultCredits: 4, 
    defaultPrice: 100,
    paymentMethod: 'credit_card',
    currency: 'USD',
    duration: 40,
    sessionType: 'private'
  },
  { 
    id: "5", 
    name: "Pvt 60 min", 
    paymentLink: "https://pay.artgharana.com/pvt60-us", 
    enabled: true, 
    categoryId: "2", 
    defaultCredits: 4, 
    defaultPrice: 150,
    paymentMethod: 'paypal',
    currency: 'USD',
    duration: 60,
    sessionType: 'private'
  },
  { 
    id: "6", 
    name: "Group 60 min", 
    paymentLink: "https://pay.artgharana.com/group60-us", 
    enabled: true, 
    categoryId: "2", 
    defaultCredits: 4, 
    defaultPrice: 120,
    paymentMethod: 'credit_card',
    currency: 'USD',
    duration: 60,
    sessionType: 'group'
  }
];
