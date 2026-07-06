"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ClayPotScene } from "@/components/3d/ClayPot";
import { ArrowRight, Star, Truck, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-amber-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10 text-center md:text-left order-2 md:order-1"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-amber-950 leading-tight mb-4 md:mb-6">
              স্বাগতম মাটির রাজ্যে; <br className="hidden md:block" />
              <span className="text-amber-700">ঐতিহ্য ও আভিজাত্য</span>
            </h1>
            <p className="text-base sm:text-lg text-amber-800 mb-6 md:mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">
              আমরা বিশ্বাস করি, মাটির শিল্প শুধু একটি পণ্য নয়; এটি বাংলার সংস্কৃতি, সৌন্দর্য ও কারুশিল্পের গর্ব। সেই বিশ্বাস থেকেই দেশের দক্ষ কারিগরদের হাতে তৈরি নির্বাচিত ও মানসম্মত মাটির পণ্য আপনাদের জন্য একত্রিত করেছি। প্রতিটি সংগ্রহে রয়েছে নান্দনিকতা, নিখুঁত কারুকাজ এবং প্রিমিয়াম মানের নিশ্চয়তা।
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center md:justify-start">
              <Link 
                href="/shop" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-amber-800 rounded-full hover:bg-amber-950 transition-colors shadow-md border-2 border-transparent"
              >
                শপিং শুরু করুন <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/about" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-amber-900 bg-transparent border-2 border-amber-800 rounded-full hover:bg-amber-100 transition-colors"
              >
                আমাদের সম্পর্কে
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative order-1 md:order-2 w-full flex justify-center"
          >
            <div className="absolute inset-0 bg-amber-200/50 rounded-full blur-3xl -z-10 transform scale-75"></div>
            <ClayPotScene />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-amber-50/50 border border-amber-100 shadow-sm"
            >
              <div className="bg-amber-100 p-4 rounded-full mb-4 text-amber-700">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-amber-950 mb-3">প্রিমিয়াম কোয়ালিটি</h3>
              <p className="text-amber-800/80 text-sm sm:text-base">আমাদের প্রতিটি পণ্য দক্ষ কারিগরদের নিখুঁত হাতের ছোঁয়ায় তৈরি, যা নিশ্চিত করে সর্বোচ্চ মান।</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-amber-50/50 border border-amber-100 shadow-sm"
            >
              <div className="bg-amber-100 p-4 rounded-full mb-4 text-amber-700">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-amber-950 mb-3">নিরাপদ প্যাকেজিং</h3>
              <p className="text-amber-800/80 text-sm sm:text-base">মাটির জিনিস যেন ভেঙে না যায় সেজন্য আমরা দিচ্ছি ১০০% নিরাপদ ও মজবুত প্যাকেজিং গ্যারান্টি।</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-amber-50/50 border border-amber-100 shadow-sm sm:col-span-2 md:col-span-1"
            >
              <div className="bg-amber-100 p-4 rounded-full mb-4 text-amber-700">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-amber-950 mb-3">দ্রুত ডেলিভারি</h3>
              <p className="text-amber-800/80 text-sm sm:text-base">সারা বাংলাদেশে অত্যন্ত সতর্কতার সাথে খুব দ্রুত সময়ে আমরা প্রোডাক্ট ডেলিভারি দিয়ে থাকি।</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-amber-900 text-amber-50 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 md:mb-6">আমাদের ঐতিহ্যবাহী কালেকশন এক্সপ্লোর করুন</h2>
          <p className="text-amber-200 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            মাটির পাত্রে রান্না ও পরিবেশন যেমন স্বাস্থ্যকর, তেমনি তা আপনার ডাইনিং স্পেসকে দেয় এক স্নিগ্ধ ও আভিজাত্যময় লুক। আজই অর্ডার করুন।
          </p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-amber-950 bg-white rounded-full hover:bg-amber-100 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all"
            >
              কালেকশন দেখুন
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
