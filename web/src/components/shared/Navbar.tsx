"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, User as UserIcon, LogOut, Settings } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";

// ─── Standalone User Section Component ───────────────────────────────────
function UserSection() {
  const router = useRouter();
  const { user, loginWithGoogle, logout, loading } = useAuthStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <div className="w-8 h-8 rounded-full bg-amber-800 animate-pulse"></div>;

  if (!user) {
    return (
      <button
        onClick={async () => {
          setIsLoggingIn(true);
          // Labor Illusion: Artificial delay simulating "security verification"
          await new Promise((resolve) => setTimeout(resolve, 800));
          const role = await loginWithGoogle();
          setIsLoggingIn(false);
          if (role === "admin") {
            router.push("/admin");
          } else if (role === "user") {
            router.push("/profile");
          }
        }}
        disabled={isLoggingIn}
        className="bg-amber-100 text-amber-900 px-4 py-2 rounded-full font-bold hover:bg-amber-200 transition text-sm flex items-center gap-2 disabled:opacity-75"
        aria-label="লগইন করুন"
      >
        {isLoggingIn ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-amber-900 border-t-transparent rounded-full animate-spin"></div>
            ভেরিফাইং...
          </span>
        ) : (
          <>
            <UserIcon size={16} /> লগইন
          </>
        )}
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 focus:outline-none"
        aria-label="প্রোফাইল মেনু"
      >
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full border-2 border-amber-200"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center border-2 border-amber-200">
            <UserIcon size={16} />
          </div>
        )}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-2 z-50 text-amber-950 border border-amber-100">
          <div className="px-4 py-2.5 border-b border-amber-100">
            <p className="font-bold truncate">{user.displayName || "গ্রাহক"}</p>
            <p className="text-xs text-amber-700 truncate">{user.email}</p>
          </div>

          <Link
            href="/profile"
            className="block px-4 py-2.5 text-sm hover:bg-amber-50 transition flex items-center gap-2.5"
            onClick={() => setIsDropdownOpen(false)}
          >
            <UserIcon size={16} /> আমার প্রোফাইল
          </Link>

          {user.role === "admin" && (
            <Link
              href="/admin"
              className="block px-4 py-2.5 text-sm hover:bg-amber-50 transition flex items-center gap-2.5"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings size={16} /> অ্যাডমিন প্যানেল
            </Link>
          )}

          <button
            onClick={() => {
              logout();
              setIsDropdownOpen(false);
              router.push("/");
            }}
            className="w-full text-left block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2.5 border-t border-amber-100"
          >
            <LogOut size={16} /> লগআউট
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Navbar Component ───────────────────────────────────────────────
export function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems());
  const { user, loading } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const navLinks = useMemo(
    () => [
      { href: "/", label: "হোম" },
      { href: "/shop", label: "আমাদের সংগ্রহ" },
      { href: "/about", label: "আমাদের সম্পর্কে" },
      { href: "/faq", label: "জিজ্ঞাসা" },
      { href: "/contact", label: "যোগাযোগ" },
    ],
    []
  );

  // Common Logo
  const Logo = ({ size = 40 }: { size?: number }) => (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="Matir Rajjo Logo"
        width={size}
        height={size}
        className="rounded-full bg-amber-50 p-1"
      />
      <span className="font-bold tracking-tight text-amber-50">মাটির রাজ্য</span>
    </div>
  );

  // Common Cart Icon
  const CartIcon = ({ size = 24 }: { size?: number }) => (
    <Link href="/cart" className="relative flex items-center hover:text-amber-200 transition" aria-label="কার্ট">
      <ShoppingCart size={size} />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2.5 bg-red-500 text-white text-[11px] font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full border-2 border-amber-900">
          {totalItems}
        </span>
      )}
    </Link>
  );

  return (
    <header className="bg-amber-900 text-amber-50 sticky top-0 z-50 shadow-md">
      {/* MOBILE (< 640px) */}
      <nav className="block sm:hidden px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl">
            <Logo size={32} />
          </Link>
          <div className="flex items-center gap-3">
            <UserSection />
            <CartIcon size={22} />
            <button onClick={toggleMenu} className="p-1" aria-label="মেনু টগল">
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="mt-4 pb-2 flex flex-col space-y-3 border-t border-amber-800 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-amber-200 transition text-lg"
                onClick={toggleMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* TABLET (640px - 768px) */}
      <nav className="hidden sm:block md:hidden px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl">
            <Logo size={36} />
          </Link>
          <div className="flex items-center gap-5">
            <UserSection />
            <CartIcon size={24} />
            <button onClick={toggleMenu} className="p-1" aria-label="মেনু টগল">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="mt-4 pb-2 flex flex-col space-y-4 border-t border-amber-800 pt-4 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-amber-200 transition text-xl"
                onClick={toggleMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* LAPTOP (768px - 1024px) */}
      <nav className="hidden md:flex lg:hidden max-w-5xl mx-auto px-8 py-4 justify-between items-center">
        <Link href="/" className="text-2xl">
          <Logo size={40} />
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-amber-200 transition">
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-4 pl-4 border-l border-amber-700">
            <UserSection />
            <CartIcon size={24} />
          </div>
        </div>
      </nav>

      {/* DESKTOP (> 1024px) */}
      <nav className="hidden lg:flex max-w-7xl mx-auto px-10 py-5 justify-between items-center">
        <Link href="/" className="text-3xl">
          <Logo size={48} />
        </Link>
        <div className="flex items-center gap-8 text-base font-semibold">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-amber-200 transition">
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-6 pl-6 border-l-2 border-amber-700">
            <UserSection />
            <CartIcon size={28} />
          </div>
        </div>
      </nav>

      {/* Zeigarnik Effect: Incomplete Profile Notification */}
      {!loading && user && (!user.phone || !user.address) && (
        <div className="bg-red-50 text-red-700 px-4 py-2 text-center text-sm font-semibold border-b border-red-200">
          ⚠️ আপনার প্রোফাইল এখনো অসম্পূর্ণ! সহজ ও দ্রুত অর্ডারের জন্য{" "}
          <Link href="/profile" className="underline font-bold hover:text-red-900">
            প্রোফাইল সম্পন্ন করুন
          </Link>
          ।
        </div>
      )}
    </header>
  );
}
