"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Package, Truck, Clock, ShieldCheck, MapPin, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "আপনাদের প্রোডাক্টগুলো কি আসল মাটির তৈরি?",
    a: "হ্যাঁ, আমাদের প্রতিটি প্রোডাক্ট বাংলাদেশের দক্ষ কারিগরদের হাতে তৈরি ১০০% খাঁটি পোড়ামাটির তৈরি।",
    icon: Package,
  },
  {
    q: "অর্ডার করার কতদিনের মধ্যে ডেলিভারি পাবো?",
    a: "ঢাকার ভেতরে আমরা ২-৩ কর্মদিবসের মধ্যে ডেলিভারি করে থাকি। ঢাকার বাইরে ডেলিভারি হতে ৩-৫ কর্মদিবস সময় লাগতে পারে।",
    icon: Truck,
  },
  {
    q: "ডেলিভারি চার্জ কত?",
    a: "৩,০০০ টাকার উপরে অর্ডারে সম্পূর্ণ ফ্রি ডেলিভারি! এর নিচে ঢাকার ভেতরে ৮০ টাকা এবং ঢাকার বাইরে ১২০ টাকা।",
    icon: Clock,
  },
  {
    q: "পণ্য ভেঙে গেলে বা নষ্ট হলে কী করবো?",
    a: "ডেলিভারি ম্যানের সামনে চেক করে যদি ভাঙা পান, সাথে সাথে রিটার্ন করুন। আমরা বিনামূল্যে রিপ্লেসমেন্ট করে দেব। আপনার সন্তুষ্টি আমাদের প্রথম অগ্রাধিকার।",
    icon: ShieldCheck,
  },
  {
    q: "আপনাদের অফিস কোথায়?",
    a: "আমাদের প্রধান অফিস মিরপুর ১০, ঢাকাতে অবস্থিত। তবে আমরা মূলত অনলাইন ভিত্তিক ই-কমার্স প্ল্যাটফর্ম।",
    icon: MapPin,
  },
  {
    q: "কীভাবে অর্ডার প্লেস করবো?",
    a: "ওয়েবসাইট থেকে পছন্দের পণ্য কার্টে যোগ করুন, তারপর 'হোয়াটসঅ্যাপ চেকআউট' বাটনে ক্লিক করুন। প্রতিনিধির সাথে কথা বলে অর্ডার কনফার্ম করুন।",
    icon: Phone,
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-amber-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-amber-950 mb-4 tracking-tight">সাধারণ জিজ্ঞাসা</h1>
          <p className="text-amber-800 text-lg">আপনাদের সাধারণ কিছু প্রশ্নের উত্তর এখানে দেওয়া হলো</p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${isOpen ? 'border-amber-400 ring-1 ring-amber-200 shadow-md' : 'border border-amber-100'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl transition-colors ${isOpen ? 'bg-amber-800 text-white' : 'bg-amber-50 text-amber-700 group-hover:bg-amber-100'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-amber-950 text-lg">{faq.q}</h3>
                  </div>
                  <div className={`text-amber-700 p-2 rounded-full flex-shrink-0 transition-all ${isOpen ? 'bg-amber-800 text-white rotate-180' : 'bg-amber-50'}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 text-amber-800 leading-relaxed border-t border-amber-50 pt-4 ml-[52px]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center bg-gradient-to-br from-amber-50 to-white p-8 md:p-10 rounded-2xl shadow-sm border border-amber-100"
        >
          <MessageCircle className="w-10 h-10 mx-auto mb-4 text-amber-700" />
          <h3 className="text-2xl font-bold text-amber-950 mb-2">আরও কোনো প্রশ্ন আছে?</h3>
          <p className="text-amber-700 mb-6">আমাদের সাথে সরাসরি যোগাযোগ করুন, আমরা সবসময় আপনার সেবায় প্রস্তুত।</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-amber-50 px-8 py-3.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <MessageCircle size={18} /> যোগাযোগ করুন
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
