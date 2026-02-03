"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/products/ProductCard";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Zap, Loader2 } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // Fetch categories
    const { data: catData } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    if (catData) setCategories(catData);

    // Fetch products
    const { data: prodData, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8);

    if (!error && prodData) setProducts(prodData);
    setLoading(false);
  };

  const featuredProducts = products;

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero-bg.jpg"
            alt="Divine Hero Background"
            fill
            priority
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white" />
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000">
            <div className="flex items-center gap-3 text-primary-600 font-bold tracking-[0.3em] text-sm uppercase bg-white/50 backdrop-blur-md px-6 py-2 rounded-full border border-primary-100/50 shadow-sm">
              <Sparkles size={18} className="animate-pulse" />
              <span>Divine Purity in Every Item</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-slate-900 leading-[1] drop-shadow-sm">
              Elevate Your <br />
              <span className="text-gradient-saffron relative">
                Spiritual Journey
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50" />
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-700 max-w-2xl leading-relaxed font-medium">
              Discover authentic, premium-quality puja essentials for your daily rituals and festive celebrations. Sourced with devotion for your sacred space.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
              <Link
                href="/shop"
                className="px-10 py-5 bg-primary-500 text-white rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-primary-600 hover:scale-105 hover:shadow-2xl hover:shadow-primary-200 transition-all active:scale-95 group"
              >
                Shop Now
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/categories"
                className="px-10 py-5 bg-white/80 backdrop-blur-md text-primary-600 border border-primary-200 rounded-2xl font-bold text-lg hover:bg-white hover:scale-105 transition-all shadow-lg active:scale-95"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements Decoration */}
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-gold-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 right-10 w-48 h-48 bg-primary-200/20 rounded-full blur-3xl animate-pulse delay-700" />
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {[
            { icon: ShieldCheck, title: "100% Pure", desc: "Authentic materials" },
            { icon: Truck, title: "Fast Delivery", desc: "Across India" },
            { icon: Zap, title: "Handpicked", desc: "Premium quality" },
            { icon: Sparkles, title: "Ritual Ready", desc: "Clean & Pavitra" },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-primary-50 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-primary-50 text-primary-500 rounded-2xl mb-4">
                <feature.icon size={28} />
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{feature.title}</h3>
              <p className="text-xs text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Explore Categories</h2>
            <div className="w-20 h-1 bg-primary-500 rounded-full" />
          </div>
          <Link href="/categories" className="text-sm font-bold text-primary-600 flex items-center gap-1 hover:underline">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.slice(0, 6).map((cat, i) => (
            <Link
              key={cat.id || i}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center gap-4"
            >
              <div className="relative aspect-square w-full rounded-full overflow-hidden bg-primary-50 border-2 border-transparent group-hover:border-primary-500 group-hover:shadow-lg transition-all duration-300">
                <Image
                  src={cat.image_url || `https://placehold.co/200x200/FFF9ED/F97316?text=${cat.name.split(' ')[0]}`}
                  alt={cat.name}
                  fill
                  className="object-contain p-6 grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-primary-600 text-center transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
          {categories.length === 0 && !loading && (
            <div className="col-span-full py-10 text-center text-slate-400 font-medium">
              No categories found. Add some in Admin!
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Weekly Bestsellers</h2>
            <div className="w-20 h-1 bg-primary-500 rounded-full" />
          </div>
          <Link href="/shop" className="text-sm font-bold text-primary-600 flex items-center gap-1 hover:underline">
            View Shop <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {loading ? (
            <div className="col-span-full h-40 flex items-center justify-center"><Loader2 className="animate-spin text-primary-500" /></div>
          ) : featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 mt-8">
        <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 px-8 py-16 md:p-20 text-center">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="url(#grad1)" />
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "var(--color-primary-500)", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "var(--color-gold-500)", stopOpacity: 1 }} />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="relative flex flex-col items-center gap-8 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
              Looking for a custom puja bundle or bulk order?
            </h2>
            <p className="text-slate-400 text-lg">
              Connect with us on WhatsApp for personalized assistance and special festive offers.
            </p>
            <Link
              href="https://wa.me/+918882522738"
              className="px-10 py-5 bg-green-500 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-green-600 transition-all shadow-2xl shadow-green-900/20 active:scale-95"
            >
              Contact on WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
