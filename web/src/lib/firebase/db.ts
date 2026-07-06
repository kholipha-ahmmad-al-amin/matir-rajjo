import { db } from "./client";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  onSnapshot,
  QueryConstraint,
  DocumentSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { Product, ContactMessage, Order } from "@/types";

const PRODUCTS_COLLECTION = "products";
const CONTACTS_COLLECTION = "contacts";
const ORDERS_COLLECTION = "orders";

function isProductData(data: unknown): data is Omit<Product, "id"> {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.name === "string" &&
    typeof d.description === "string" &&
    typeof d.price === "number" &&
    typeof d.imageUrl === "string" &&
    typeof d.category === "string" &&
    typeof d.createdAt === "number"
  );
}

function sanitizeProductData(doc: DocumentSnapshot): Product | null {
  const data = doc.data();
  if (!data) return null;
  return {
    id: doc.id,
    name: String(data.name ?? ""),
    description: String(data.description ?? ""),
    price: Number(data.price ?? 0),
    imageUrl: String(data.imageUrl ?? ""),
    category: String(data.category ?? "Terracotta"),
    stock: Number(data.stock ?? 0),
    isFeatured: Boolean(data.isFeatured ?? false),
    createdAt: Number(data.createdAt ?? Date.now()),
    updatedAt: Number(data.updatedAt ?? data.createdAt ?? Date.now()),
  } satisfies Product;
}

export async function getProducts(opts?: {
  categoryFilter?: string;
  searchQuery?: string;
  pageSize?: number;
  lastDoc?: DocumentSnapshot;
}): Promise<{ products: Product[]; lastDoc: DocumentSnapshot | null }> {
  const constraints: QueryConstraint[] = [];
  const pageSize = opts?.pageSize ?? 50;

  if (opts?.categoryFilter && opts.categoryFilter !== "all") {
    constraints.push(where("category", "==", opts.categoryFilter));
  }
  constraints.push(orderBy("createdAt", "desc"));
  constraints.push(limit(pageSize));

  if (opts?.lastDoc) {
    constraints.push(startAfter(opts.lastDoc));
  }

  const q = query(collection(db, PRODUCTS_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  let products = snapshot.docs.map((d) => sanitizeProductData(d)).filter(Boolean) as Product[];

  // Client-side search filter (Firestore doesn't support native full-text search)
  if (opts?.searchQuery) {
    const qLower = opts.searchQuery.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(qLower) ||
        p.description.toLowerCase().includes(qLower) ||
        p.category.toLowerCase().includes(qLower)
    );
  }

  const lastVisible = snapshot.docs[snapshot.docs.length - 1] ?? null;
  return { products, lastDoc: lastVisible };
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return sanitizeProductData(docSnap);
}

export async function addProduct(
  product: Omit<Product, "id">
): Promise<string> {
  if (!isProductData(product)) {
    throw new Error("Invalid product data: missing required fields");
  }
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...product,
    stock: product.stock ?? 0,
    isFeatured: product.isFeatured ?? false,
    updatedAt: Date.now(),
  });
  return docRef.id;
}

export async function updateProduct(
  id: string,
  product: Partial<Omit<Product, "id">>
): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, { ...product, updatedAt: Date.now() });
}

export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where("isFeatured", "==", true),
    orderBy("createdAt", "desc"),
    limit(6)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => sanitizeProductData(d)).filter(Boolean) as Product[];
}

// ─── Contacts ────────────────────────────────────────────────────────────

function sanitizeContactMessage(doc: DocumentSnapshot): ContactMessage | null {
  const data = doc.data();
  if (!data) return null;
  return {
    id: doc.id,
    name: String(data.name ?? ""),
    email: String(data.email ?? ""),
    phone: String(data.phone ?? ""),
    message: String(data.message ?? ""),
    uid: data.uid ? String(data.uid) : null,
    createdAt: Number(data.createdAt ?? Date.now()),
  } satisfies ContactMessage;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const q = query(collection(db, CONTACTS_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => sanitizeContactMessage(d)).filter(Boolean) as ContactMessage[];
}

export async function addContactMessage(
  data: Omit<ContactMessage, "id">
): Promise<string> {
  const docRef = await addDoc(collection(db, CONTACTS_COLLECTION), data);
  return docRef.id;
}

// ─── Orders ──────────────────────────────────────────────────────────────

function sanitizeOrderData(doc: DocumentSnapshot): Order | null {
  const data = doc.data();
  if (!data) return null;
  const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
  const rawStatus = String(data.status ?? "pending");
  return {
    id: doc.id,
    userId: String(data.userId ?? ""),
    items: Array.isArray(data.items) ? data.items : [],
    totalAmount: Number(data.totalAmount ?? 0),
    status: (validStatuses.includes(rawStatus as any) ? rawStatus : "pending") as Order["status"],
    shippingAddress: String(data.shippingAddress ?? ""),
    phone: String(data.phone ?? ""),
    createdAt: Number(data.createdAt ?? Date.now()),
    updatedAt: Number(data.updatedAt ?? data.createdAt ?? Date.now()),
  } satisfies Order;
}

// ─── Real-time subscriptions ────────────────────────────────────────────

/** Subscribe to all orders (admin). Returns an unsubscribe function. */
export function subscribeOrders(
  onData: (orders: Order[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs
        .map((d) => sanitizeOrderData(d))
        .filter(Boolean) as Order[];
      onData(orders);
    },
    (error) => {
      console.error("Orders subscription error", error);
      onError?.(error);
    }
  );
}

/** Subscribe to a specific user's orders. Returns an unsubscribe function. */
export function subscribeUserOrders(
  userId: string,
  onData: (orders: Order[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs
        .map((d) => sanitizeOrderData(d))
        .filter(Boolean) as Order[];
      onData(orders);
    },
    (error) => {
      console.error("User orders subscription error", error);
      onError?.(error);
    }
  );
}

/** Subscribe to contact messages (admin). Returns an unsubscribe function. */
export function subscribeContactMessages(
  onData: (messages: ContactMessage[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, CONTACTS_COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs
        .map((d) => sanitizeContactMessage(d))
        .filter(Boolean) as ContactMessage[];
      onData(messages);
    },
    (error) => {
      console.error("Messages subscription error", error);
      onError?.(error);
    }
  );
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => sanitizeOrderData(d)).filter(Boolean) as Order[];
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => sanitizeOrderData(d)).filter(Boolean) as Order[];
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, id);
  await updateDoc(docRef, { status, updatedAt: Date.now() });
}
