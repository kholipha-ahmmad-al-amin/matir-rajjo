"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import { Button, buttonVariants } from "@/components/ui/button";
import { Trash2, ArrowRight, CheckCircle2, Loader2, ShieldCheck, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState("");

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    // Labor Illusion: Artificial delay to show system is "working hard"
    setIsCheckingOut(true);
    setCheckoutStatus("স্টক যাচাই করা হচ্ছে...");
    
    setTimeout(() => {
      setCheckoutStatus("আপনার অর্ডার প্রস্তুত করা হচ্ছে...");
      
      setTimeout(() => {
        setIsCheckingOut(false);
        setCheckoutStatus("");
        
        let message = "নমস্কার, আমি মাটির রাজ্য থেকে কিছু পণ্য অর্ডার করতে চাই:\n\n";
        
        // Order Items
        items.forEach((item, index) => {
          message += `${index + 1}. ${item.name} - ${item.quantity}টি (৳${item.price * item.quantity})\n`;
        });
        
        const total = totalPrice();
        const delivery = total >= 3000 ? 0 : 120;
        message += `\nপণ্যমূল্য: ৳${total}\nডেলিভারি চার্জ: ${delivery === 0 ? 'ফ্রি' : `৳${delivery}`}\n*সর্বমোট: ৳${total + delivery}*\n\n`;
        
        message += "📦 *ডেলিভারি তথ্য:*\n";
        if (user) {
          message += `নাম: ${user.displayName || "দেওয়া হয়নি"}\n`;
          message += `ফোন: ${user.phone || "দেওয়া হয়নি"}\n`;
          message += `ঠিকানা: ${user.address || "দেওয়া হয়নি"}\n`;
          if (!user.phone || !user.address) {
            message += `\n(প্রোফাইল অসম্পূর্ণ, দয়া করে ডেলিভারির সঠিক ঠিকানা দিন)\n`;
          }
        } else {
          message += "নাম: \nফোন নম্বর: \nপূর্ণ ঠিকানা: \n\n(অনুগ্রহ করে আপনার তথ্যগুলো উপরে লিখুন)\n";
        }

        message += `\nঅনুগ্রহ করে আমার অর্ডারটি কনফার্ম করুন।`;
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/8801352492238?text=${encodedMessage}`, '_blank');
      }, 800);
    }, 800);
  };

  // Goal Gradient Effect: Calculate how close the user is to checking out
  const profileComplete = user?.phone && user?.address;
  const progressPercentage = !user ? 50 : (profileComplete ? 95 : 75);

  return (
    <div className="min-h-screen bg-amber-50/30 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-black text-amber-950 mb-8 tracking-tight">শপিং কার্ট</h1>
        
        {items.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-3xl shadow-sm border border-amber-100 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={40} className="text-amber-700" />
            </div>
            <h2 className="text-3xl font-bold text-amber-950 mb-4">আপনার কার্ট খালি!</h2>
            <p className="text-gray-500 mb-8 text-lg">দয়া করে আমাদের শপ থেকে আপনার পছন্দের মাটির পণ্য কার্টে যুক্ত করুন।</p>
            <Link href="/shop" className={buttonVariants({ className: "bg-amber-800 hover:bg-amber-900 rounded-full px-10 py-6 text-lg font-bold text-white shadow-lg transition-transform hover:-translate-y-1" })}>কেনাকাটা শুরু করুন</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              
              {/* Goal Gradient Progress Bar */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-200 mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-1 bg-amber-100 w-full">
                  <div className="h-full bg-green-500 transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">অর্ডার প্রায় সম্পন্ন! ({progressPercentage}%)</h4>
                    <p className="text-sm text-gray-500">
                      {!user ? "লগইন করে আপনার অর্ডার নিশ্চিত করুন।" : (!profileComplete ? "আপনার ঠিকানা দিয়ে অর্ডারটি দ্রুত কনফার্ম করুন।" : "আপনার অর্ডারটি এখন চেকআউট করার জন্য প্রস্তুত!")}
                    </p>
                  </div>
                </div>
              </div>

              {items.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-6 shadow-sm border border-amber-100 hover:border-amber-300 transition-colors">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.name} className="w-full sm:w-28 h-28 object-cover rounded-xl bg-gray-100" />
                    {/* Urgency tag inside cart */}
                    <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-md animate-pulse">
                      High Demand
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-amber-950 text-xl mb-1">{item.name}</h3>
                    <p className="text-amber-700 font-black mb-4">৳{item.price}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-amber-200 rounded-xl bg-amber-50">
                        <button 
                          className="w-10 h-10 flex items-center justify-center hover:bg-amber-200 rounded-l-xl font-bold transition-colors text-amber-900"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >-</button>
                        <span className="w-12 text-center font-bold text-amber-950">{item.quantity}</span>
                        <button 
                          className="w-10 h-10 flex items-center justify-center hover:bg-amber-200 rounded-r-xl font-bold transition-colors text-amber-900"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >+</button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                        title="রিমুভ করুন"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right sm:text-center mt-4 sm:mt-0">
                    <p className="text-sm text-gray-400 mb-1">মোট মূল্য</p>
                    <div className="font-black text-amber-950 text-2xl">
                      ৳{item.price * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white p-8 rounded-3xl h-fit shadow-xl border border-amber-200 sticky top-24">
              <h2 className="text-2xl font-black mb-6 text-amber-950 flex items-center gap-2">
                অর্ডারের সারসংক্ষেপ
              </h2>
              
              {!user && (
                <div className="mb-6 p-4 bg-red-50 rounded-xl text-sm text-red-800 border border-red-200 font-medium">
                  সহজে অর্ডার করতে <button onClick={() => useAuthStore.getState().loginWithGoogle()} className="font-bold underline text-red-900 hover:text-red-950">লগইন</button> করুন।
                </div>
              )}

              <div className="space-y-4 text-gray-700 mb-6">
                <div className="flex justify-between">
                  <span>পণ্যের মূল্য</span>
                  <span className="font-bold">৳{totalPrice()}</span>
                </div>
                
                {/* Endowed Progress Effect: Free Shipping Threshold */}
                {(() => {
                  const total = totalPrice();
                  const threshold = 3000;
                  const isFree = total >= threshold;
                  const percentage = Math.min((total / threshold) * 100, 100);
                  
                  return (
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="font-bold text-amber-900">ফ্রি ডেলিভারি</span>
                        {isFree ? (
                          <span className="text-green-600 font-bold">অর্জন করেছেন!</span>
                        ) : (
                          <span className="text-gray-500">আর ৳{threshold - total} বাকি</span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="font-bold text-gray-500">
                    {totalPrice() >= 3000 ? <><span className="line-through">৳১২০</span> <span className="text-green-600 font-bold">ফ্রি</span></> : '৳১২০'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center font-black text-2xl mb-8 border-t border-amber-100 pt-6">
                <span className="text-amber-950">সর্বমোট</span>
                <span className="text-amber-700 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 shadow-inner">
                  ৳{totalPrice() + (totalPrice() >= 3000 ? 0 : 120)}
                </span>
              </div>
              
              <Button 
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl h-16 text-xl font-bold shadow-[0_8px_30px_rgb(37,211,102,0.3)] transition-all transform hover:-translate-y-1 relative overflow-hidden group"
              >
                {isCheckingOut ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" /> 
                    <span className="text-sm sm:text-base">{checkoutStatus}</span>
                  </div>
                ) : (
                  <>
                    <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                    হোয়াটসঅ্যাপে অর্ডার <ArrowRight className="ml-2 w-6 h-6" />
                  </>
                )}
              </Button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                ১০০% নিরাপদ চেকআউট
              </div>
              
              <button 
                onClick={clearCart}
                className="w-full text-center text-sm font-bold text-gray-400 mt-6 hover:text-red-500 hover:underline transition-colors"
              >
                কার্ট খালি করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
