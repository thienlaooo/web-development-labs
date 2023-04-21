export interface Medicine {
  id: number;
  name: string;
  price: number;
  photoUrls: string[];
  quantity: number;
  producer: string;
  inDemand: boolean;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
}

export interface Order {
  id: number;
  customer_id: number;
  status: string;
}
