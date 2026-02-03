"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

    return (
        <div className="group bg-white rounded-2xl border border-primary-50 overflow-hidden hover:shadow-xl hover:shadow-primary-100/50 transition-all duration-300 flex flex-col">
            {/* Image Container */}
            <Link href={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-primary-50/30">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                />
                {discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-10">
                        {discount}% OFF
                    </div>
                )}
                {product.stock < 10 && (
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-orange-600 text-[10px] font-semibold px-2 py-1 rounded shadow-sm z-10 border border-orange-100">
                        Only {product.stock} left
                    </div>
                )}
            </Link>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-1">
                    <div className="flex text-gold-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} fill={i < 4 ? "currentColor" : "none"} />
                        ))}
                    </div>
                    <span className="text-[10px] text-slate-400">(4.5)</span>
                </div>

                <Link href={`/product/${product.id}`} className="mb-2">
                    <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-primary-600 transition-colors h-10">
                        {product.name}
                    </h3>
                </Link>

                <span className="text-[11px] text-primary-500 font-medium bg-primary-50 px-2 py-0.5 rounded-full w-fit mb-3">
                    {product.category}
                </span>

                <div className="mt-auto flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-900">₹{product.price}</span>
                        {product.mrp > product.price && (
                            <span className="text-[11px] text-slate-400 line-through">MRP: ₹{product.mrp}</span>
                        )}
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        className="p-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all active:scale-95 shadow-md shadow-primary-200"
                        aria-label="Add to cart"
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
