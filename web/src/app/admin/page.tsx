"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  updateOrderStatus,
  subscribeOrders,
  subscribeContactMessages,
} from "@/lib/firebase/db";
import { Product, ContactMessage, Order } from "@/types";
import { useRouter } from "next/navigation";
import {
  Package,
  MessageSquare,
  ShoppingBag,
  Plus,
  Edit3,
  Trash2,
  X,
  Loader2,
  LogOut,
  CheckCircle2,
} from "lucide-react";

type AdminTab = "products" | "messages" | "orders";

export default function AdminPage() {
  const { user, loading, logout } = useAuthStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTab>("products");

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Terracotta");
  const [stock, setStock] = useState("10");
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Messages state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [subscriptionRetry, setSubscriptionRetry] = useState(0);
  const [reconnectedToast, setReconnectedToast] = useState("");
  const hadSubError = useRef(false);

  // ─── Auth guard ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // ─── Fetch products (one-time) ───────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const { products } = await getProducts({ pageSize: 100 });
      setProducts(products);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") fetchProducts();
  }, [user, fetchProducts]);

  // ─── Real-time subscriptions with retry and reconnection toast ───────
  useEffect(() => {
    if (user?.role !== "admin") return;

    setOrdersLoading(true);
    setMessagesLoading(true);
    setOrdersError(null);
    setMessagesError(null);

    const unsubOrders = subscribeOrders(
      (data) => {
        setOrders(data);
        setOrdersLoading(false);
        setOrdersError(null);
        // Show toast if we were in error state before this success
        if (hadSubError.current) {
          hadSubError.current = false;
          setReconnectedToast("সার্ভারে পুনরায় সংযুক্ত হয়েছে!");
          setTimeout(() => setReconnectedToast(""), 4000);
        }
      },
      () => {
        setOrdersLoading(false);
        setOrdersError("অর্ডার লোড করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
        hadSubError.current = true;
      }
    );

    const unsubMessages = subscribeContactMessages(
      (data) => {
        setMessages(data);
        setMessagesLoading(false);
        setMessagesError(null);
        // Show toast if we were in error state before this success
        if (hadSubError.current) {
          hadSubError.current = false;
          setReconnectedToast("সার্ভারে পুনরায় সংযুক্ত হয়েছে!");
          setTimeout(() => setReconnectedToast(""), 4000);
        }
      },
      () => {
        setMessagesLoading(false);
        setMessagesError("মেসেজ লোড করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
        hadSubError.current = true;
      }
    );

    return () => {
      unsubOrders();
      unsubMessages();
    };
  }, [user, subscriptionRetry]);

  // ─── Reset form ──────────────────────────────────────────────────────
  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("Terracotta");
    setStock("10");
    setImageUrl("");
    setIsFeatured(false);
    setEditingProduct(null);
    setShowAddForm(false);
  };

  // ─── Edit product ────────────────────────────────────────────────────
  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
    setCategory(product.category);
    setStock(String(product.stock ?? 0));
    setImageUrl(product.imageUrl);
    setIsFeatured(product.isFeatured ?? false);
    setShowAddForm(true);
  };

  // ─── Submit create/update ────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !imageUrl) return;

    setIsSubmitting(true);
    try {
      const productData = {
        name,
        description,
        price: Number(price),
        category,
        stock: Number(stock),
        isFeatured,
        imageUrl,
        createdAt: editingProduct ? editingProduct.createdAt : Date.now(),
        updatedAt: Date.now(),
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("প্রোডাক্ট সংরক্ষণে সমস্যা হয়েছে।");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Delete product ──────────────────────────────────────────────────
  const handleDelete = async (productId: string) => {
    if (!window.confirm("আপনি কি নিশ্চিত? এই প্রোডাক্টটি ডিলিট হবে।")) return;
    try {
      await deleteProduct(productId);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("ডিলিট করতে সমস্যা হয়েছে।");
    }
  };

  // ─── Update order status ─────────────────────────────────────────────
  const handleOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      await updateOrderStatus(orderId, status);
      // No need to refetch - real-time subscription auto-updates
    } catch (err) {
      console.error(err);
    }
  };

  // ─── Loading state ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-amber-800" />
      </div>
    );
  }

  // ─── Not logged in ───────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-amber-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-amber-100">
          <h1 className="text-3xl font-bold mb-2 text-amber-950">অ্যাডমিন লগইন</h1>
          <p className="text-amber-700 mb-8">অ্যাডমিন প্যানেলে প্রবেশ করতে লগইন করুন।</p>
          <Button
            onClick={() => useAuthStore.getState().loginWithGoogle()}
            className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-6 text-lg rounded-xl shadow-md"
          >
            Google দিয়ে লগইন করুন
          </Button>
          <button
            onClick={() => router.push("/")}
            className="mt-6 text-amber-700 hover:text-amber-900 underline font-medium"
          >
            হোম পেজে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  // ─── Not admin ───────────────────────────────────────────────────────
  if (user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-red-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md border border-red-100">
          <h1 className="text-3xl font-bold mb-4 text-red-600">অ্যাক্সেস ডিনাইড</h1>
          <p className="mb-6 text-gray-700">
            শুধুমাত্র <span className="font-bold text-red-500">matirrajjo@gmail.com</span> ইমেইল থেকে প্রবেশযোগ্য।
          </p>
          <div className="flex flex-col gap-3">
            <Button variant="outline" onClick={() => logout()} className="border-gray-300">
              অন্য একাউন্ট দিয়ে চেষ্টা করুন
            </Button>
            <Button onClick={() => router.push("/")} className="bg-amber-800 hover:bg-amber-900">
              হোম পেজে ফিরে যান
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-amber-900 text-amber-50 p-6 shadow-md mb-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">মাটির রাজ্য অ্যাডমিন প্যানেল</h1>
          <div className="flex items-center gap-4">
            <span className="opacity-90 font-medium text-sm">{user.email}</span>
            <Button
              variant="secondary"
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="bg-amber-100 text-amber-900 hover:bg-white"
            >
              <LogOut size={16} className="mr-1" /> লগ আউট
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Reconnection Toast */}
        <AnimatePresence>
          {reconnectedToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 z-30 bg-green-50 border border-green-200 text-green-800 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-sm font-bold"
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              {reconnectedToast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-1.5 w-fit">
          {[
            { id: "products" as AdminTab, label: "প্রোডাক্ট", icon: Package },
            { id: "orders" as AdminTab, label: "অর্ডার", icon: ShoppingBag },
            { id: "messages" as AdminTab, label: "মেসেজ", icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-amber-900 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {tab.label}
                {tab.id === "messages" && messages.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {messages.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ===== PRODUCTS TAB ===== */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Product List */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-amber-900">সব প্রোডাক্ট</h2>
                  <Button
                    onClick={() => {
                      resetForm();
                      setShowAddForm(true);
                    }}
                    className="bg-amber-800 hover:bg-amber-900 text-white rounded-xl"
                  >
                    <Plus size={16} className="mr-1" /> নতুন প্রোডাক্ট
                  </Button>
                </div>

                {productsLoading ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-800" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <Package size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">এখনও কোনো প্রোডাক্ট যুক্ত হয়নি</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-4 hover:bg-amber-50/50 transition-colors"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                          <p className="text-sm text-gray-500">
                            ৳{product.price} · {product.category} · Stock: {product.stock ?? 0}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEdit(product)}
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            <Edit3 size={16} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(product.id)}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Add/Edit Form */}
            <div className="xl:col-span-1">
              {showAddForm ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-amber-900">
                      {editingProduct ? "প্রোডাক্ট এডিট করুন" : "নতুন প্রোডাক্ট"}
                    </h2>
                    <button onClick={resetForm} className="text-gray-400 hover:text-gray-700">
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold">প্রোডাক্টের নাম</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="যেমন: নকশি মাটির কলস"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold">বর্ণনা</Label>
                      <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="বিস্তারিত বর্ণনা"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-semibold">দাম (৳)</Label>
                        <Input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                          min="0"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-semibold">স্টক</Label>
                        <Input
                          type="number"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold">ক্যাটাগরি</Label>
                      <Input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        placeholder="যেমন: Terracotta"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold">ছবির URL</Label>
                      <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        required
                        placeholder="Cloudinary URL"
                      />
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="mt-2 w-full h-32 object-cover rounded-lg bg-gray-100"
                        />
                      )}
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-amber-800 focus:ring-amber-500"
                      />
                      <span className="text-sm font-semibold text-gray-700">ফিচার্ড প্রোডাক্ট</span>
                    </label>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 text-base font-bold bg-amber-800 hover:bg-amber-900 rounded-xl"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : null}
                      {editingProduct ? "আপডেট করুন" : "প্রোডাক্ট যোগ করুন"}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="bg-amber-50 rounded-2xl border border-amber-200 p-8 text-center sticky top-24">
                  <Package size={48} className="mx-auto mb-4 text-amber-300" />
                  <h3 className="text-lg font-bold text-amber-900 mb-2">নতুন প্রোডাক্ট যোগ করুন</h3>
                  <p className="text-sm text-amber-700 mb-6">
                    প্রোডাক্টের নাম, ছবি, দাম এবং বর্ণনা দিয়ে সহজেই যুক্ত করুন।
                  </p>
                  <Button
                    onClick={() => {
                      resetForm();
                      setShowAddForm(true);
                    }}
                    className="bg-amber-800 hover:bg-amber-900 text-white rounded-xl"
                  >
                    <Plus size={18} className="mr-2" /> প্রোডাক্ট যুক্ত করুন
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== ORDERS TAB ===== */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-amber-900">অর্ডারসমূহ</h2>
                      {/* Real-time: no manual refresh needed */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="লাইভ" />
                <span className="text-xs text-green-600 font-medium hidden sm:inline">লাইভ</span>
              </div>
            </div>

            {ordersError ? (
              <div className="text-center py-12">
                <div className="bg-red-50 rounded-2xl border border-red-200 p-8 max-w-md mx-auto">
                  <ShoppingBag size={40} className="mx-auto mb-3 text-red-400" />
                  <h3 className="font-bold text-red-800 text-lg mb-2">কানেকশন ব্যর্থ!</h3>
                  <p className="text-sm text-red-600 mb-5">{ordersError}</p>
                  <button
                    onClick={() => setSubscriptionRetry((c) => c + 1)}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md"
                  >
                    পুনরায় চেষ্টা করুন
                  </button>
                </div>
              </div>
            ) : ordersLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-amber-800" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="font-medium">এখনও কোনো অর্ডার নেই</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <div key={order.id} className="p-5 hover:bg-amber-50/30 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between gap-3 mb-3">
                      <div>
                        <span className="text-xs text-gray-400 font-mono">#{order.id.slice(0, 8)}</span>
                        <span className="ml-3 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "shipped"
                              ? "bg-purple-100 text-purple-800"
                              : order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="font-bold text-amber-900">৳{order.totalAmount}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      {order.items.map((item, i) => (
                        <span key={i}>
                          {item.name} x{item.quantity}
                          {i < order.items.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleOrderStatus(order.id, s as Order["status"])}
                          className={`px-3 py-1 text-xs rounded-full font-bold border transition-colors ${
                            order.status === s
                              ? "bg-amber-900 text-white border-amber-900"
                              : "bg-white text-gray-600 border-gray-300 hover:border-amber-400"
                          }`}
                        >
                          {s === "pending" ? "পেন্ডিং" : s === "confirmed" ? "কনফার্মড" : s === "shipped" ? "শিপড" : s === "delivered" ? "ডেলিভারড" : "ক্যান্সেল"}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== MESSAGES TAB ===== */}
        {activeTab === "messages" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-amber-900">ক্লায়েন্ট মেসেজ ({messages.length})</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="লাইভ" />
                <span className="text-xs text-green-600 font-medium hidden sm:inline">লাইভ</span>
              </div>
            </div>

            {messagesError ? (
              <div className="text-center py-12">
                <div className="bg-red-50 rounded-2xl border border-red-200 p-8 max-w-md mx-auto">
                  <MessageSquare size={40} className="mx-auto mb-3 text-red-400" />
                  <h3 className="font-bold text-red-800 text-lg mb-2">কানেকশন ব্যর্থ!</h3>
                  <p className="text-sm text-red-600 mb-5">{messagesError}</p>
                  <button
                    onClick={() => setSubscriptionRetry((c) => c + 1)}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md"
                  >
                    পুনরায় চেষ্টা করুন
                  </button>
                </div>
              </div>
            ) : messagesLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-amber-800" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="font-medium">এখনও কোনো মেসেজ নেই</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {messages.map((msg) => (
                  <div key={msg.id} className="p-5 hover:bg-amber-50/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{msg.name}</h3>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleString("bn-BD")}
                      </span>
                    </div>
                    <div className="flex gap-3 text-sm text-gray-500 mb-2">
                      <span>📞 {msg.phone}</span>
                      {msg.email && <span>✉️ {msg.email}</span>}
                    </div>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
