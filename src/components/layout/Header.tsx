"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Search, Menu, X, Phone } from "lucide-react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartCount } = useCart();

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-primary-100">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden text-primary-600 p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-2xl font-display font-bold text-gradient-saffron">
                        Ashok Asthmi
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
                    <Link href="/shop" className="hover:text-primary-600 transition-colors">Shop</Link>
                    <Link href="/categories" className="hover:text-primary-600 transition-colors">Categories</Link>
                    <Link href="/about" className="hover:text-primary-600 transition-colors">About</Link>
                    <Link href="/contact" className="hover:text-primary-600 transition-colors">Contact</Link>
                </nav>

                {/* Search Bar (Desktop) */}
                <div className="hidden md:flex items-center flex-1 max-w-sm px-4 py-2 bg-primary-50 rounded-full border border-primary-100 group">
                    <Search size={18} className="text-primary-400 group-focus-within:text-primary-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search puja items..."
                        className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-slate-700"
                    />
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-2 md:gap-4">
                    <Link href="/cart" className="relative p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-all">
                        <ShoppingCart size={24} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <Link
                        href="https://wa.me/+910000000000"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold hover:bg-green-600 transition-all shadow-sm shadow-green-200"
                    >
                        <Phone size={16} />
                        <span className="hidden lg:inline">Order WhatsApp</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t border-primary-50 px-4 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
                    {/* Mobile Search */}
                    <div className="flex items-center px-4 py-2 bg-primary-50 rounded-lg border border-primary-100">
                        <Search size={18} className="text-primary-400" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="flex-1 bg-transparent border-none outline-none px-2 text-sm"
                        />
                    </div>
                    <Link href="/" className="text-lg font-medium py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link href="/shop" className="text-lg font-medium py-2" onClick={() => setIsMenuOpen(false)}>Shop</Link>
                    <Link href="/categories" className="text-lg font-medium py-2" onClick={() => setIsMenuOpen(false)}>Categories</Link>
                    <Link href="/about" className="text-lg font-medium py-2" onClick={() => setIsMenuOpen(false)}>About Us</Link>
                    <Link href="/contact" className="text-lg font-medium py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                    <Link href="/login" className="px-4 py-3 border border-primary-500 text-primary-600 rounded-lg text-center font-semibold" onClick={() => setIsMenuOpen(false)}>Login / Register</Link>
                </div>
            )}
        </header>
    );
}
