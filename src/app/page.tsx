"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import productsData from "@/data/products.json";
import ProductCard from "@/components/products/ProductCard";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Zap } from "lucide-react";

export default function HomePage() {
  const featuredProducts = productsData.slice(0, 8);
  const categories = Array.from(new Set(productsData.map(p => p.category))).slice(0, 6);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] w-full flex items-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-primary-50/50 -z-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-100/50 to-transparent -z-10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left duration-1000">
            <div className="flex items-center gap-2 text-primary-600 font-bold tracking-widest text-xs uppercase">
              <Sparkles size={16} />
              <span>Divine purity in every item</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.1]">
              Elevate Your <span className="text-gradient-saffron">Spiritual Journey</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Discover authentic, premium-quality puja essentials for your daily rituals and festive celebrations. Sourced with devotion for your sacred space.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link
                href="/shop"
                className="px-8 py-4 bg-primary-500 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-600 transition-all shadow-xl shadow-primary-200 active:scale-95"
              >
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link
                href="/categories"
                className="px-8 py-4 bg-white text-primary-600 border border-primary-100 rounded-2xl font-bold hover:bg-primary-50 transition-all active:scale-95"
              >
                Browse Categories
              </Link>
            </div>
          </div>

          <div className="relative aspect-square lg:aspect-auto h-full min-h-[400px] animate-in fade-in zoom-in duration-1000 delay-200">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-200/20 to-gold-200/20 rounded-[4rem] rotate-3" />
            <div className="relative h-full w-full rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl">
              <Image
                src="https://placehold.co/800x1000/FFF9ED/F97316?text=Sacred+Puja+Set"
                alt="Sacred Puja Set"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
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
          {categories.map((cat, i) => (
            <Link
              key={i}
              href={`/shop?category=${encodeURIComponent(cat)}`}
              className="group flex flex-col items-center gap-4"
            >
              <div className="relative aspect-square w-full rounded-full overflow-hidden bg-primary-50 border-2 border-transparent group-hover:border-primary-500 group-hover:shadow-lg transition-all duration-300">
                <Image
                  src={`https://placehold.co/200x200/FFF9ED/F97316?text=${cat.split(' ')[0]}`}
                  alt={cat}
                  fill
                  className="object-contain p-6 grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-primary-600 text-center transition-colors">
                {cat}
              </span>
            </Link>
          ))}
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
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
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
              href="https://wa.me/+910000000000"
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
