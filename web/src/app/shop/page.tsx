"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts } from "@/lib/firebase/db";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cartStore";
import {
  ShoppingBag,
  Loader2,
  CheckCircle,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

const CATEGORIES = [
  "all",
  "Terracotta",
  "Ceramic",
  "Porcelain",
  "Stoneware",
  "Earthenware",
  "Decorative",
];

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-amber-100 animate-pulse">
      <div className="h-72 bg-gray-200" />
      <div className="p-8 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between items-end pt-4">
          <div className="h-8 bg-gray-200 rounded w-20" />
          <div className="h-10 bg-gray-200 rounded w-full ml-4" />
        </div>
      </div>
    </div>
  );
}

function getUrgencyTag(index: number) {
  const tags = [
    { text: "Only 2 left in stock!", color: "bg-red-500" },
    { text: "High Demand", color: "bg-amber-600" },
    { text: "Limited Edition", color: "bg-purple-600" },
    { text: "Trending Now", color: "bg-blue-500" },
  ];
  return tags[index % tags.length];
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // UX State
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    name: string;
  }>({ show: false, name: "" });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { products } = await getProducts({ pageSize: 100 });
        setProducts(products);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (categoryFilter && categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [products, categoryFilter, searchQuery]);

  const handleAddToCart = useCallback(
    (product: Product) => {
      setAddingToCart(product.id);
      setTimeout(() => {
        addItem(product);
        setAddingToCart(null);
        setNotification({ show: true, name: product.name });
        setTimeout(
          () => setNotification({ show: false, name: "" }),
          3000
        );
      }, 600);
    },
    [addItem]
  );

  return (
    <div className="min-h-screen bg-amber-50/30 py-8 md:py-16 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-700"
          >
            <CheckCircle className="text-green-400 w-6 h-6" />
            <span className="font-medium">
              <span className="font-bold text-amber-400">
                {notification.name}
              </span>{" "}
              কার্টে যোগ করা হয়েছে!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-amber-950 mb-4 tracking-tight"
          >
            আমাদের এক্সক্লুসিভ সংগ্রহ
          </motion.h1>
          <p className="text-lg text-amber-800 max-w-2xl mx-auto leading-relaxed">
            আপনার পছন্দমতো মাটির পণ্য বেছে নিন। প্রতিটি পণ্য বাংলার দক্ষ
            কারিগরদের অত্যন্ত যত্ন ও ভালোবাসায় তৈরি।
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="প্রোডাক্ট সার্চ করুন..."
                className="w-full pl-12 pr-10 py-3.5 bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-amber-900 placeholder-gray-400 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all border ${
                isFilterOpen || categoryFilter !== "all"
                  ? "bg-amber-800 text-white border-amber-800"
                  : "bg-white text-amber-900 border-amber-200 hover:bg-amber-50"
              }`}
            >
              <SlidersHorizontal size={18} />
              ফিল্টার
            </button>
          </div>

          {/* Category Filter Chips */}
          <AnimatePresence>
            {(isFilterOpen || categoryFilter !== "all") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                        categoryFilter === cat
                          ? "bg-amber-900 text-white shadow-md"
                          : "bg-white text-amber-800 border border-amber-200 hover:bg-amber-50"
                      }`}
                    >
                      {cat === "all" ? "সবগুলো" : cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white text-center py-24 rounded-3xl shadow-sm border border-amber-100 max-w-lg mx-auto">
            <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-amber-200" />
            <p className="text-2xl font-bold text-amber-950 mb-2">
              কোনো প্রোডাক্ট পাওয়া যায়নি।
            </p>
            <p className="text-amber-700 mb-6">
              {searchQuery || categoryFilter !== "all"
                ? "অন্য কিওয়ার্ড বা ক্যাটাগরি দিয়ে সার্চ করুন।"
                : "নতুন কালেকশন খুব শীঘ্রই আসছে!"}
            </p>
            {(searchQuery || categoryFilter !== "all") && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                }}
                className="bg-amber-800 hover:bg-amber-900 text-white rounded-full px-8"
              >
                ফিল্টার রিসেট করুন
              </Button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6 text-center sm:text-left">
              {filteredProducts.length}টি প্রোডাক্ট পাওয়া গেছে
              {categoryFilter !== "all" && ` (${categoryFilter})`}
              {searchQuery && ` — "${searchQuery}"`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => {
                const urgency = getUrgencyTag(index);
                const isAdding = addingToCart === product.id;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(180,83,9,0.1)] transition-all duration-300 group border border-amber-100 flex flex-col h-full relative"
                  >
                    {/* Urgency / Scarcity Tag */}
                    <div
                      className={`absolute top-4 right-4 z-10 ${urgency.color} text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse`}
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      {urgency.text}
                    </div>

                    {/* Stock indicator */}
                    {(product.stock ?? 0) <= 0 ? (
                      <div className="absolute top-4 left-4 z-10 bg-gray-900/80 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                        আউট অফ স্টক
                      </div>
                    ) : (product.stock ?? 0) <= 5 ? (
                      <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        মাত্র {product.stock}টি বাকি!
                      </div>
                    ) : null}

                    <div className="h-72 overflow-hidden relative bg-gray-50 p-6 flex items-center justify-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition duration-700 drop-shadow-xl"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-amber-900 rounded-full shadow-sm border border-amber-100">
                        {product.category}
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-amber-800 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                        {product.description}
                      </p>

                      <div className="flex flex-col gap-4 mt-auto">
                        <div className="flex justify-between items-end">
                          <div className="text-3xl font-black text-amber-950">
                            ৳{product.price}
                          </div>
                        </div>

                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={isAdding || (product.stock ?? 0) <= 0}
                          className="w-full bg-amber-800 hover:bg-amber-900 text-white rounded-2xl h-14 text-lg font-bold shadow-md transition-all transform hover:-translate-y-1 overflow-hidden relative"
                        >
                          {isAdding ? (
                            <span className="flex items-center gap-2 justify-center">
                              <Loader2 className="w-5 h-5 animate-spin" />{" "}
                              যুক্ত করা হচ্ছে...
                            </span>
                          ) : (product.stock ?? 0) <= 0 ? (
                            "স্টক শেষ"
                          ) : (
                            "কার্টে যোগ করুন"
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
