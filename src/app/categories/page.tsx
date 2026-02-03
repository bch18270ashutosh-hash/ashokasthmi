"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import productsData from "@/data/products.json";
import { ArrowRight } from "lucide-react";

export default function CategoriesPage() {
    const categories = Array.from(new Set(productsData.map(p => p.category)));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">Discover Divine Collections</h1>
                <p className="text-slate-500 max-w-xl mx-auto">
                    From sacred oils to intricate thalis, find everything you need for your spiritual rituals in our curated categories.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat, i) => {
                    const count = productsData.filter(p => p.category === cat).length;
                    return (
                        <Link
                            key={i}
                            href={`/shop?category=${encodeURIComponent(cat)}`}
                            className="group relative h-80 rounded-[3rem] overflow-hidden bg-primary-100 border border-primary-50 shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            <Image
                                src={`https://placehold.co/600x600/FFF9ED/F97316?text=${cat}`}
                                alt={cat}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                            <div className="absolute bottom-10 left-10 text-white">
                                <span className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-2 block">{count} Products</span>
                                <h3 className="text-2xl font-display font-bold mb-4">{cat}</h3>
                                <div className="flex items-center gap-2 text-sm font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 group-hover:bg-primary-500 group-hover:border-primary-500 transition-all">
                                    Shop Category <ArrowRight size={16} />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
