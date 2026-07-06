import Link from "next/link";
import { SearchX, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4 text-center">
      
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-amber-200/50 blur-3xl rounded-full"></div>
        <div className="relative bg-white p-6 rounded-full shadow-xl border border-amber-100">
          <SearchX size={64} className="text-amber-800" />
        </div>
      </div>
      
      <h1 className="text-8xl font-black text-amber-950 tracking-tighter mb-4 opacity-90 drop-shadow-sm">404</h1>
      <h2 className="text-3xl font-bold text-amber-900 mb-6">পেজটি পাওয়া যায়নি!</h2>
      
      <p className="text-amber-800 max-w-md mx-auto text-lg mb-10 leading-relaxed">
        দুঃখিত, আপনি যে পেজটি খুঁজছেন তা হয়তো ডিলিট হয়ে গেছে অথবা লিংকটি ভুল। অনুগ্রহ করে সঠিক লিংক চেক করুন অথবা হোমপেজে ফিরে যান।
      </p>
      
      <Link 
        href="/" 
        className="bg-amber-800 text-amber-50 px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-900 transition flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
      >
        <Home size={22} /> হোমপেজে ফিরে যান
      </Link>
      
    </div>
  );
}
