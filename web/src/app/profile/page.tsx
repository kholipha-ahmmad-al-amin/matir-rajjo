"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { subscribeUserOrders } from "@/lib/firebase/db";
import type { Order } from "@/types";
import { User, Phone, MapPin, Mail, Save, Loader2, Package, Clock, ChevronRight, CheckCircle2 } from "lucide-react";

interface ProfileFormData {
  displayName: string;
  phone: string;
  address: string;
}

export default function ProfilePage() {
  const { user, loading, updateProfile } = useAuthStore();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Order history state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [ordersRetry, setOrdersRetry] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [reconnectedToast, setReconnectedToast] = useState("");
  const hadOrderError = useRef(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
    if (user) {
      reset({
        displayName: user.displayName || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user, loading, router, reset]);

  // Real-time order subscription with retry and reconnection toast
  useEffect(() => {
    if (!user || user.role === "admin") return;

    setOrdersLoading(true);
    setOrdersError(null);

    const unsub = subscribeUserOrders(
      user.uid,
      (data) => {
        setOrders(data);
        setOrdersLoading(false);
        setOrdersError(null);
        // Show toast if we were in error state before this success
        if (hadOrderError.current) {
          hadOrderError.current = false;
          setReconnectedToast("অর্ডার সার্ভারে পুনরায় সংযুক্ত হয়েছে!");
          setTimeout(() => setReconnectedToast(""), 4000);
        }
      },
      (error) => {
        console.error("Order subscription error", error);
        setOrdersLoading(false);
        setOrdersError("অর্ডার লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        hadOrderError.current = true;
      }
    );

    return () => unsub();
  }, [user, ordersRetry]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-amber-800" />
      </div>
    );
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      await updateProfile({
        displayName: data.displayName,
        phone: data.phone,
        address: data.address,
      });
      setSaveMessage("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
    } catch (error) {
      console.error("Error updating profile", error);
      setSaveMessage("আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-amber-900 h-32 relative"></div>
        
        <div className="px-8 pb-8">
          {/* Profile Photo */}
          <div className="relative -mt-16 mb-8 flex justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-amber-100 overflow-hidden shadow-md flex items-center justify-center">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || "Profile"} className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-amber-800" />
              )}
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-amber-950">{user.displayName || "গ্রাহক"}</h1>
            <p className="text-amber-700 flex items-center justify-center gap-2 mt-2">
              <Mail size={16} /> {user.email}
            </p>
          </div>

          {/* Zeigarnik Effect: Profile Completeness Score */}
          {(() => {
            let score = 0;
            if (user.displayName) score += 33.3;
            if (user.phone) score += 33.3;
            if (user.address) score += 33.4;
            const progress = Math.round(score);
            
            return (
              <div className="max-w-xl mx-auto mb-8 bg-amber-50/80 p-4 rounded-xl border border-amber-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-amber-900 text-sm">প্রোফাইল সম্পূর্ণতা</span>
                  <span className="font-black text-amber-700">{progress}%</span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-green-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
                {progress < 100 && (
                  <p className="text-xs text-red-600 mt-2 font-medium">
                    ⚠️ দ্রুত ডেলিভারি নিশ্চিত করতে আপনার প্রোফাইল ১০০% সম্পন্ন করুন!
                  </p>
                )}
                {progress === 100 && (
                  <p className="text-xs text-green-600 mt-2 font-medium">
                    ✅ আপনার প্রোফাইল ১০০% সম্পন্ন। ধন্যবাদ!
                  </p>
                )}
              </div>
            );
          })()}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto">
            
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <User size={18} /> আপনার নাম
              </label>
              <input 
                {...register("displayName", { required: "নাম দেওয়া আবশ্যক" })}
                className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/50"
                placeholder="আপনার পূর্ণ নাম লিখুন"
              />
              {errors.displayName && <p className="text-red-500 text-xs mt-1">{errors.displayName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <Phone size={18} /> ফোন নম্বর
              </label>
              <input 
                {...register("phone", { 
                  required: "ফোন নম্বর আবশ্যক",
                  pattern: {
                    value: /^(?:\+88|88)?(01[3-9]\d{8})$/,
                    message: "সঠিক বাংলাদেশী ফোন নম্বর লিখুন"
                  }
                })}
                className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/50"
                placeholder="যেমন: 017XXXXXXXX"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <MapPin size={18} /> ঠিকানা
              </label>
              <textarea 
                {...register("address", { required: "ডেলিভারি ঠিকানা আবশ্যক" })}
                className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/50 min-h-[100px]"
                placeholder="আপনার পূর্ণ ঠিকানা (বাড়ি নং, রাস্তা, এলাকা, জেলা)"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={isSaving}
                className="w-full bg-amber-800 text-amber-50 py-4 rounded-xl font-bold text-lg hover:bg-amber-900 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
              >
                {isSaving ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                ) : (
                  <><Save size={20} /> প্রোফাইল আপডেট করুন</>
                )}
              </button>
            </div>
            
            {saveMessage && (
              <p className={`text-center font-medium ${saveMessage.includes('সমস্যা') ? 'text-red-500' : 'text-green-600'}`}>
                {saveMessage}
              </p>
            )}

          </form>

          {/* ─── Order History Section ─────────────────────────────── */}
          {user.role !== "admin" && (
            <div className="max-w-xl mx-auto mt-12 pt-8 border-t border-amber-200 relative">
              {/* Reconnection Toast */}
              <AnimatePresence>
                {reconnectedToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-green-50 border border-green-200 text-green-800 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-sm font-bold"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    {reconnectedToast}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-100 p-2.5 rounded-xl text-amber-800">
                  <Package size={22} />
                </div>
                <h2 className="text-2xl font-black text-amber-950">আমার অর্ডারসমূহ</h2>
              </div>

              {ordersError ? (
                <div className="text-center py-10 bg-red-50 rounded-2xl border border-red-200">
                  <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={28} className="text-red-500" />
                  </div>
                  <h3 className="font-bold text-red-800 text-lg mb-2">কানেকশন ব্যর্থ!</h3>
                  <p className="text-sm text-red-600 mb-5 max-w-xs mx-auto">{ordersError}</p>
                  <button
                    onClick={() => setOrdersRetry((c) => c + 1)}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-md"
                  >
                    <Loader2 className="w-4 h-4" />
                    পুনরায় চেষ্টা করুন
                  </button>
                </div>
              ) : ordersLoading ? (
                <div className="flex flex-col items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-800 mb-3" />
                  <p className="text-sm text-gray-500">অর্ডার লোড হচ্ছে...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-amber-50/60 rounded-2xl border border-amber-100">
                  <Package size={40} className="mx-auto mb-3 text-amber-300" />
                  <h3 className="font-bold text-amber-900 text-lg mb-1">এখনও কোনো অর্ডার নেই</h3>
                  <p className="text-sm text-amber-700">আমাদের শপ থেকে পণ্য অর্ডার করলেই এখানে দেখা যাবে।</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const isExpanded = expandedOrder === order.id;
                    const statusColors: Record<Order["status"], { bg: string; text: string; label: string }> = {
                      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "পেন্ডিং" },
                      confirmed: { bg: "bg-blue-100", text: "text-blue-800", label: "নিশ্চিত" },
                      shipped: { bg: "bg-purple-100", text: "text-purple-800", label: "শিপড" },
                      delivered: { bg: "bg-green-100", text: "text-green-800", label: "ডেলিভারড" },
                      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "বাতিল" },
                    };
                    const statusStyle = statusColors[order.status];

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          className="w-full text-left p-5 flex flex-col sm:flex-row sm:items-center gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                                {statusStyle.label}
                              </span>
                              <span className="text-xs text-gray-400 font-mono">
                                #{order.id.slice(0, 8)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock size={14} />
                              {new Date(order.createdAt).toLocaleDateString("bn-BD", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 sm:text-right">
                            <div>
                              <p className="text-xs text-gray-400">{order.items.length}টি আইটেম</p>
                              <p className="font-black text-amber-900">৳{order.totalAmount}</p>
                            </div>
                            <ChevronRight
                              size={20}
                              className={`text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                            />
                          </div>
                        </button>

                        {/* Expanded order details */}
                        {isExpanded && (
                          <div className="px-5 pb-5 border-t border-amber-50">
                            <div className="pt-4 space-y-3">
                              <h4 className="text-sm font-bold text-gray-700 mb-2">আইটেমসমূহ:</h4>
                              {order.items.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex justify-between items-center py-2 px-3 bg-amber-50/50 rounded-xl text-sm"
                                >
                                  <span className="font-medium text-gray-800">
                                    {item.name} <span className="text-gray-400">x{item.quantity}</span>
                                  </span>
                                  <span className="font-bold text-amber-800">
                                    ৳{item.price * item.quantity}
                                  </span>
                                </div>
                              ))}

                              <div className="flex justify-between items-center pt-2 border-t border-amber-100 mt-3">
                                <span className="text-sm text-gray-500">সর্বমোট</span>
                                <span className="font-black text-amber-900 text-lg">
                                  ৳{order.totalAmount}
                                </span>
                              </div>

                              {(order.shippingAddress || order.phone) && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-xl text-xs text-gray-600 space-y-1">
                                  {order.shippingAddress && (
                                    <p><span className="font-medium">ঠিকানা:</span> {order.shippingAddress}</p>
                                  )}
                                  {order.phone && (
                                    <p><span className="font-medium">ফোন:</span> {order.phone}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
