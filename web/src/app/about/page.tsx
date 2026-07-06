import Link from "next/link";
import { Code2, Users, MessageCircle, Globe, Briefcase } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-amber-50/30">
      
      {/* Hero Section */}
      <div className="bg-amber-900 text-amber-50 py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">আমাদের সম্পর্কে</h1>
        <p className="text-xl text-amber-200 max-w-2xl mx-auto leading-relaxed">
          মাটির রাজ্য কেবল একটি ই-কমার্স স্টোর নয়, এটি বাংলাদেশের হাজার বছরের পুরনো মৃৎশিল্পের ঐতিহ্যকে আধুনিক প্রজন্মের কাছে পৌঁছে দেওয়ার একটি আন্তরিক প্রয়াস।
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        
        {/* Brand Story */}
        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-amber-100">
          <h2 className="text-3xl font-bold text-amber-950 mb-6">আমাদের গল্প</h2>
          <div className="text-lg text-gray-700 space-y-4 leading-relaxed">
            <p>
              আধুনিকতার ছোঁয়ায় আমরা যখন শেকড় ভুলতে বসেছি, তখন <strong>মাটির রাজ্য</strong> নিয়ে এসেছে বাংলার খাঁটি মাটির গন্ধ মেশানো দৃষ্টিনন্দন সব পণ্য। আমাদের প্রতিটি পণ্য দেশের প্রত্যন্ত অঞ্চলের দক্ষ কারিগরদের নিজ হাতে তৈরি। 
            </p>
            <p>
              আমরা চাই মাটির তৈরি স্বাস্থ্যসম্মত, পরিবেশবান্ধব ও নজরকাড়া তৈজসপত্র এবং শোপিস দিয়ে আপনার ঘরের সৌন্দর্য বৃদ্ধি করতে। আমাদের লক্ষ্য শুধু ব্যবসা নয়, বরং দেশীয় কুটির শিল্পের প্রসার ও কারিগরদের জীবনমান উন্নয়ন।
            </p>
          </div>
        </section>

        {/* Creator Section */}
        <section className="bg-gradient-to-br from-amber-900 to-amber-950 p-8 md:p-12 rounded-3xl shadow-xl text-amber-50 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            
            <div className="w-40 h-40 flex-shrink-0 bg-amber-100 rounded-full border-4 border-amber-700/50 overflow-hidden shadow-2xl">
              {/* Fallback avatar if real image is not present */}
              <div className="w-full h-full flex items-center justify-center bg-amber-800 text-5xl font-black text-amber-200">
                KA
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h2 className="text-sm font-bold tracking-widest text-amber-400 uppercase mb-2">Designed & Engineered By</h2>
              <h3 className="text-3xl md:text-4xl font-black mb-2 text-white">Kholipha Ahmmad Al-Amin</h3>
              <p className="text-xl font-medium text-amber-200 mb-4">
                খলিফা আহম্মেদ আল-আমিন
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                <span className="bg-amber-800/50 px-3 py-1 rounded-full text-sm font-semibold border border-amber-700/50">Founder & CEO : EquiSaaS BD</span>
                <span className="bg-amber-800/50 px-3 py-1 rounded-full text-sm font-semibold border border-amber-700/50">Software Engineer & AI Specialist</span>
                <span className="bg-amber-800/50 px-3 py-1 rounded-full text-sm font-semibold border border-amber-700/50">Principal Consultant : AR IT Consultancy</span>
              </div>

              <p className="text-amber-100/90 leading-relaxed mb-8 max-w-xl">
                Multidisciplinary Software Engineer and SaaS Founder from Dhaka, Bangladesh. Specializing in building production-ready, scalable web applications, AI-powered systems, and impactful SaaS products. 
                <br /><br />
                <strong>Thesis:</strong> THETAEnhancer+ (AI-Driven Image Restoration Model)
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a href="https://equisaas-bd.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 px-5 py-2.5 rounded-xl font-bold transition-all transform hover:-translate-y-1 shadow-lg">
                  <Globe size={18} /> EquiSaaS BD
                </a>
                <a href="https://kholipha-ahmmad-al-amin.equisaas-bd.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold transition-all border border-white/20">
                  <Briefcase size={18} /> Portfolio
                </a>
                <a href="https://github.com/kholipha-ahmmad-al-amin" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/20">
                  <Code2 size={20} />
                </a>
                <a href="https://www.linkedin.com/in/kholipha-ahmmad-al-amin" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/20">
                  <Users size={20} />
                </a>
                <a href="https://x.com/al_amin5519" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/20">
                  <MessageCircle size={20} />
                </a>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
