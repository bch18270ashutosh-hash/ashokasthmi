"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/products/ProductCard";
import { Search, SlidersHorizontal, ChevronDown, LayoutGrid, List, Loader2 } from "lucide-react";

function ShopContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");

    const [products, setProducts] = useState<any[]>([]);
    const [dbCategories, setDbCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");
    const [sortBy, setSortBy] = useState("newest");
    const [priceRange, setPriceRange] = useState(5000);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        // Fetch products
        const { data: prodData } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });
        if (prodData) setProducts(prodData);

        // Fetch categories
        const { data: catData } = await supabase
            .from("categories")
            .select("*")
            .order("name", { ascending: true });
        if (catData) setDbCategories(catData);

        setLoading(false);
    };

    const categories = ["All", ...dbCategories.map(c => c.name)];

    const filteredProducts = useMemo(() => {
        return products
            .filter(p => {
                const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
                const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
                const matchesPrice = p.price <= priceRange;
                return matchesSearch && matchesCategory && matchesPrice;
            })
            .sort((a, b) => {
                if (sortBy === "price-low") return a.price - b.price;
                if (sortBy === "price-high") return b.price - a.price;
                if (sortBy === "popularity") return b.stock - a.stock;
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
    }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header & Breadcrumbs */}
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Divine Collection</h1>
                <p className="text-slate-500 text-sm">Home / Shop {selectedCategory !== "All" && `/ ${selectedCategory}`}</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className="w-full lg:w-64 flex flex-col gap-8">
                    {/* Search */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-slate-800">Search</h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Find anything..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                            />
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-slate-800">Categories</h3>
                        <div className="flex flex-wrap lg:flex-col gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-sm transition-all text-left ${selectedCategory === cat
                                        ? "bg-primary-500 text-white font-bold shadow-md shadow-primary-200"
                                        : "bg-white text-slate-600 hover:bg-primary-50 border border-slate-100"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-slate-800">Max Price: ₹{priceRange}</h3>
                        <input
                            type="range"
                            min="0"
                            max="5000"
                            step="50"
                            value={priceRange}
                            onChange={(e) => setPriceRange(parseInt(e.target.value))}
                            className="accent-primary-500"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>₹0</span>
                            <span>₹5000</span>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <main className="flex-1">
                    {/* Sorting & Stats */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> products
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-lg p-1">
                                <button className="p-1.5 bg-primary-50 text-primary-600 rounded">
                                    <LayoutGrid size={18} />
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-slate-600">
                                    <List size={18} />
                                </button>
                            </div>

                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-primary-500/20 outline-none cursor-pointer"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="popularity">Popularity</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
                            <Loader2 className="animate-spin text-primary-500" size={40} />
                            <p>Fetching divine items...</p>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                <Search size={40} className="text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
                            <p className="text-slate-500 max-w-sm mb-8">
                                We couldn't find any products matching your current filters. Try adjusting them!
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("All");
                                    setPriceRange(5000);
                                }}
                                className="px-6 py-3 bg-primary-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center font-display text-xl text-slate-400">Loading divine collection...</div>}>
            <ShopContent />
        </Suspense>
    );
}
