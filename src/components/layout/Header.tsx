"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, Search, Menu, X, Phone, Loader2 } from "lucide-react";

interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    category: string;
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { cartCount } = useCart();
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);

    // Debounced search function
    const searchProducts = useCallback(async (query: string) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        setIsSearching(true);
        try {
            const { data, error } = await supabase
                .from("products")
                .select("id, name, image, price, category")
                .ilike("name", `%${query}%`)
                .limit(6);

            if (!error && data) {
                setSuggestions(data);
            }
        } catch (err) {
            console.error("Search error:", err);
        }
        setIsSearching(false);
    }, []);

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            searchProducts(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, searchProducts]);

    // Click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node) &&
                mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setShowSuggestions(false);
            setSearchQuery("");
            setIsMenuOpen(false);
        }
    };

    const handleSuggestionClick = (productId: string) => {
        router.push(`/product/${productId}`);
        setShowSuggestions(false);
        setSearchQuery("");
        setIsMenuOpen(false);
    };

    const SuggestionDropdown = () => (
        showSuggestions && (searchQuery.length >= 2) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                {isSearching ? (
                    <div className="p-4 flex items-center justify-center text-slate-400">
                        <Loader2 size={20} className="animate-spin mr-2" />
                        Searching...
                    </div>
                ) : suggestions.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {suggestions.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => handleSuggestionClick(product.id)}
                                className="w-full p-3 flex items-center gap-3 hover:bg-primary-50 transition-colors text-left"
                            >
                                <div className="relative w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 shrink-0">
                                    <Image
                                        src={product.image || "/placeholder.jpg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{product.name}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400">{product.category}</span>
                                        <span className="text-xs font-bold text-primary-600">₹{product.price}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                        <button
                            onClick={handleSearchSubmit as any}
                            className="w-full p-3 text-center text-sm font-bold text-primary-600 hover:bg-primary-50 transition-colors"
                        >
                            View all results for "{searchQuery}"
                        </button>
                    </div>
                ) : (
                    <div className="p-4 text-center text-slate-400 text-sm">
                        No products found for "{searchQuery}"
                    </div>
                )}
            </div>
        )
    );

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
                <div ref={searchRef} className="hidden md:block relative flex-1 max-w-sm">
                    <form onSubmit={handleSearchSubmit} className="flex items-center px-4 py-2 bg-primary-50 rounded-full border border-primary-100 group">
                        <Search size={18} className="text-primary-400 group-focus-within:text-primary-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search puja items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-slate-900 placeholder:text-slate-400"
                        />
                        {isSearching && <Loader2 size={16} className="animate-spin text-primary-400" />}
                    </form>
                    <SuggestionDropdown />
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
                        href="https://wa.me/+918882522738"
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
                    {/* Mobile Search with Suggestions */}
                    <div ref={mobileSearchRef} className="relative">
                        <form onSubmit={handleSearchSubmit} className="flex items-center px-4 py-2 bg-primary-50 rounded-lg border border-primary-100">
                            <Search size={18} className="text-primary-400" />
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-slate-900 placeholder:text-slate-400"
                            />
                            {isSearching && <Loader2 size={16} className="animate-spin text-primary-400" />}
                        </form>
                        <SuggestionDropdown />
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
