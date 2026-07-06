"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  return (
    <motion.a
      href="https://wa.me/8801352492238?text=%E0%A6%86%E0%A6%B8%E0%A6%B8%E0%A6%BE%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%81%E0%A6%AE%20%E0%A6%AE%E0%A6%BE%E0%A6%9F%E0%A6%BF%E0%A6%B0%20%E0%A6%B0%E0%A6%BE%E0%A6%9C%E0%A7%8D%E0%A6%AF%E0%A6%A4%E0%A7%87%E0%A5%A4"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-[0_4px_20px_rgb(37,211,102,0.4)] transition-all group"
      aria-label="WhatsApp এ মেসেজ করুন"
    >
      <MessageCircle size={26} className="fill-white" />
      {/* Pulse ring effect for attention */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30"></span>
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        আমাদের মেসেজ করুন!
      </span>
    </motion.a>
  );
}
