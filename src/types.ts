export type NavTab = 
  | 'home'
  | 'calc'
  | 'scientific'
  | 'cash'
  | 'gst'
  | 'emi'
  | 'discount'
  | 'invoice'
  | 'expense'
  | 'converter'
  | 'age'
  | 'bmi'
  | 'loan'
  | 'history'
  | 'settings';

export interface CalculationEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
  type: string;
  userId: string;
}

export interface ExpenseEntry {
  id: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: Date;
  note?: string;
  userId: string;
}

export interface CashRecordEntry {
  id: string;
  notes: Record<string, number>;
  total: number;
  date: Date;
  userId: string;
}

export interface BmiEntry {
  id: string;
  height: number;
  weight: number;
  bmi: number;
  status: string;
  date: Date;
}

export interface InvoiceEntry {
  id?: string;
  customerName: string;
  shopName: string;
  items: InvoiceItem[];
  total: number;
  date: Date;
  userId: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  tax: number;
}
