
export interface PaymentTransaction {
  id: string;
  studentName: string;
  classType: string;
  date: string;
  paymentMethod: string;
  credits: number;
  price: number;
  groupName?: string;
}
