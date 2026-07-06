import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-amber-950 text-amber-50 pt-16 pb-8 mt-auto border-t-[6px] border-amber-900">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        <div className="md:col-span-2">
          <h3 className="text-3xl font-black mb-4 tracking-tight">মাটির রাজ্য</h3>
          <p className="text-amber-200/80 text-sm leading-relaxed max-w-sm mb-6">
            স্বাগতম মাটির রাজ্যে; যেখানে ঐতিহ্য মিশে যায় আভিজাত্যের সঙ্গে, আর প্রতিটি সৃষ্টি বলে এক অনন্য গল্প। 
            বিশুদ্ধ মাটির তৈরি আমাদের প্রতিটি পণ্য আপনার রুচিশীলতার পরিচয় বহন করে।
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-4 text-amber-400">গুরুত্বপূর্ণ লিংক</h3>
          <ul className="space-y-3 text-amber-100/70 text-sm font-medium">
            <li><Link href="/" className="hover:text-white hover:translate-x-1 inline-block transition-transform">হোম</Link></li>
            <li><Link href="/shop" className="hover:text-white hover:translate-x-1 inline-block transition-transform">আমাদের সংগ্রহ</Link></li>
            <li><Link href="/about" className="hover:text-white hover:translate-x-1 inline-block transition-transform">আমাদের সম্পর্কে</Link></li>
            <li><Link href="/faq" className="hover:text-white hover:translate-x-1 inline-block transition-transform">সাধারণ জিজ্ঞাসা</Link></li>
            <li><Link href="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-transform">যোগাযোগ</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-4 text-amber-400">যোগাযোগ</h3>
          <ul className="space-y-3 text-amber-100/70 text-sm">
            <li className="flex flex-col">
              <span className="text-xs text-amber-500 font-bold uppercase tracking-wider mb-1">ইমেইল</span>
              <a href="mailto:matirrajjo@gmail.com" className="hover:text-white transition-colors">matirrajjo@gmail.com</a>
            </li>
            <li className="flex flex-col">
              <span className="text-xs text-amber-500 font-bold uppercase tracking-wider mb-1">হোয়াটসঅ্যাপ</span>
              <a href="https://wa.me/8801352492238" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+880 1352-492238</a>
            </li>
            <li className="flex flex-col">
              <span className="text-xs text-amber-500 font-bold uppercase tracking-wider mb-1">সোশ্যাল</span>
              <a href="https://www.instagram.com/matir_rajjo/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-amber-900/50 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="text-sm text-amber-500/80 font-medium">
          &copy; {new Date().getFullYear()} মাটির রাজ্য (Matir Rajjo). সর্বস্বত্ব সংরক্ষিত.
        </div>
        
        <div className="text-sm text-amber-200/60 bg-amber-900/30 px-6 py-3 rounded-2xl border border-amber-800/30 text-center lg:text-right">
          Designed & Engineered by <br className="sm:hidden" />
          <a 
            href="https://kholipha-ahmmad-al-amin.equisaas-bd.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-bold text-amber-400 hover:text-white transition-colors ml-1"
          >
            Kholipha Ahmmad Al-Amin (খলিফা আহম্মেদ আল-আমিন)
          </a>
          <br />
          <span className="text-xs mt-1 block opacity-70">
            Founder & CEO, <a href="https://equisaas-bd.com/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 underline underline-offset-2">EquiSaaS BD</a> | Principal Consultant, AR IT Consultancy
          </span>
        </div>
      </div>
    </footer>
  );
}
