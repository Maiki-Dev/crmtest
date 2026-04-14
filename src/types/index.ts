export type Plan = 'free' | 'pro';

export interface Profile {
  id: string;
  email: string;
  plan: Plan;
  created_at: string;
}

export interface Business {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface Customer {
  id: string;
  business_id: string;
  name: string;
  phone?: string;
  note?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  business_id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
  created_at: string;
}

export interface Message {
  id: string;
  customer_id: string;
  content: string;
  role: 'user' | 'client';
  created_at: string;
}
