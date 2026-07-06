"use client";

import { useState } from "react";
import { addContactMessage } from "@/lib/firebase/db";
import { useAuthStore } from "@/lib/store/authStore";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactPage() {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setStatusMessage("");
    try {
      await addContactMessage({
        ...data,
        uid: user?.uid || null,
        createdAt: Date.now()
      });
      setStatusMessage("আপনার মেসেজটি সফলভাবে পাঠানো হয়েছে! আমরা দ্রুত আপনার সাথে যোগাযোগ করবো।");
      reset({ message: "" }); // only reset message
    } catch (error) {
      console.error(error);
      setStatusMessage("দুঃখিত, মেসেজ পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-950 mb-4">যোগাযোগ করুন</h1>
          <p className="text-amber-800">যেকোনো তথ্য জানতে বা সমস্যার সমাধানে আমাদের সাথে যোগাযোগ করুন</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full text-amber-800">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-amber-950 text-lg">ফোন নম্বর</h3>
                <p className="text-amber-700 mt-1">+8801352492238</p>
                <p className="text-xs text-amber-600 mt-1">সকাল ১০টা থেকে রাত ৮টা</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full text-amber-800">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-amber-950 text-lg">ইমেইল</h3>
                <p className="text-amber-700 mt-1">matirrajjo@gmail.com</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full text-amber-800">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-amber-950 text-lg">অফিস ঠিকানা</h3>
                <p className="text-amber-700 mt-1">মিরপুর ১০, ঢাকা, বাংলাদেশ</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl shadow-xl border border-amber-100 p-8">
            <h2 className="text-2xl font-bold text-amber-950 mb-6">আমাদের মেসেজ পাঠান</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">আপনার নাম</label>
                  <input 
                    {...register("name", { required: "নাম দেওয়া আবশ্যক" })}
                    className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 bg-amber-50/30"
                    placeholder="আপনার নাম"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">ফোন নম্বর</label>
                  <input 
                    {...register("phone", { required: "ফোন নম্বর আবশ্যক" })}
                    className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 bg-amber-50/30"
                    placeholder="আপনার ফোন নম্বর"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">ইমেইল (যদি থাকে)</label>
                <input 
                  {...register("email")}
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 bg-amber-50/30"
                  placeholder="আপনার ইমেইল"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">মেসেজ</label>
                <textarea 
                  {...register("message", { required: "মেসেজ লিখতে হবে" })}
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 bg-amber-50/30 min-h-[120px]"
                  placeholder="আপনার মেসেজ বিস্তারিত লিখুন..."
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-800 text-amber-50 py-4 rounded-xl font-bold text-lg hover:bg-amber-900 transition flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  ) : (
                    <><Send size={20} /> মেসেজ পাঠান</>
                  )}
                </button>
              </div>

              {statusMessage && (
                <p className={`text-center font-medium mt-4 ${statusMessage.includes('সমস্যা') ? 'text-red-500' : 'text-green-600'}`}>
                  {statusMessage}
                </p>
              )}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
