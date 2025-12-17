
import { PaymentTransaction } from '@/types/payment';

export const mockPaymentTransactions: PaymentTransaction[] = [
  {
    id: "1",
    studentName: "Arya Sharma",
    classType: "Pvt 60 min",
    date: "2024-01-15",
    paymentMethod: "Credit Card",
    credits: 8,
    price: 1200,
    groupName: "INDIA"
  },
  {
    id: "2",
    studentName: "Rohan Patel",
    classType: "Pvt 40 min",
    date: "2024-01-14",
    paymentMethod: "Bank Transfer",
    credits: 6,
    price: 800,
    groupName: "Global"
  },
  {
    id: "3",
    studentName: "Priya Gupta",
    classType: "Group 60 min",
    date: "2024-01-13",
    paymentMethod: "Credit Card",
    credits: 12,
    price: 75,
    groupName: "USA"
  },
  {
    id: "4",
    studentName: "Vikram Singh",
    classType: "Pvt 60 min",
    date: "2024-01-12",
    paymentMethod: "PayPal",
    credits: 10,
    price: 85,
    groupName: "Canada"
  },
  {
    id: "5",
    studentName: "Meera Joshi",
    classType: "Group 40 min",
    date: "2024-01-11",
    paymentMethod: "Cash",
    credits: 5,
    price: 45,
    groupName: "UK"
  },
  {
    id: "6",
    studentName: "Raj Kumar",
    classType: "Pvt 40 min",
    date: "2024-01-10",
    paymentMethod: "Credit Card",
    credits: 4,
    price: 550,
    groupName: "INDIA"
  },
  {
    id: "7",
    studentName: "Anita Desai",
    classType: "Group 60 min",
    date: "2024-01-09",
    paymentMethod: "Bank Transfer",
    credits: 8,
    price: 900,
    groupName: "Global"
  },
  {
    id: "8",
    studentName: "Kiran Reddy",
    classType: "Pvt 60 min",
    date: "2024-01-08",
    paymentMethod: "UPI",
    credits: 6,
    price: 1000,
    groupName: "INDIA"
  },
  {
    id: "9",
    studentName: "Emily Johnson",
    classType: "Pvt 40 min",
    date: "2024-01-07",
    paymentMethod: "Credit Card",
    credits: 5,
    price: 60,
    groupName: "USA"
  },
  {
    id: "10",
    studentName: "James Wilson",
    classType: "Group 60 min",
    date: "2024-01-06",
    paymentMethod: "Bank Transfer",
    credits: 10,
    price: 80,
    groupName: "Canada"
  }
];
