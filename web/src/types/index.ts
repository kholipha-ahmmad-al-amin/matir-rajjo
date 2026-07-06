export type ProductCategory = 'Terracotta' | 'Ceramic' | 'Porcelain' | 'Stoneware' | 'Earthenware' | 'Decorative';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: ProductCategory | string;
  stock: number;
  isFeatured: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phone: string | null;
  address: string | null;
  role: 'admin' | 'user';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  uid?: string | null;
  createdAt: number;
}

export interface Order {
  id: string;
  userId: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  phone: string;
  createdAt: number;
  updatedAt: number;
}
