"use client";

import React from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw, Star, Share2, Loader2 } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

export default function ProductDetailsPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const { addToCart } = useCart();

    const [product, setProduct] = React.useState<any>(null);
    const [relatedProducts, setRelatedProducts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (id) fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();

        if (!error && data) {
            setProduct(data);
            // Fetch related products
            const { data: related } = await supabase
                .from("products")
                .select("*")
                .eq("category", data.category)
                .neq("id", data.id)
                .limit(4);
            if (related) setRelatedProducts(related);
        }
        setLoading(false);
    };

    if (loading) return <div className="h-screen flex flex-col items-center justify-center gap-4"><Loader2 className="animate-spin text-primary-500" size={48} /><p className="text-slate-400 font-display">Whispering a prayer for your product...</p></div>;

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Divine item not found</h1>
                <button onClick={() => router.push("/shop")} className="text-primary-600 font-bold underline">
                    Back to Shop
                </button>
            </div>
        );
    }

    const [selectedVariant, setSelectedVariant] = React.useState<any>(null);
    const [quantity, setQuantity] = React.useState(1);

    React.useEffect(() => {
        if (product && Array.isArray(product.variants) && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);
        } else {
            setSelectedVariant(null);
        }
    }, [product]);

    // Defensive calculations
    const currentPrice = Number(selectedVariant?.price || product.price || 0);
    const currentMrp = Number(selectedVariant?.mrp || product.mrp || currentPrice || 0);
    const productMainImage = product.image || "https://placehold.co/600x600/FFF9ED/F97316?text=Image+Coming+Soon";
    const variantImage = (selectedVariant?.image && selectedVariant.image.length > 0) ? selectedVariant.image : null;
    const currentImage = variantImage || productMainImage;

    // Safety check for discount calculation
    const discount = currentMrp > 0 ? Math.max(0, Math.round(((currentMrp - currentPrice) / currentMrp) * 100)) : 0;

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-8 group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Go Back</span>
            </button>

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
                {/* Product Image */}
                <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-white border border-primary-50 shadow-xl shadow-primary-50/50">
                    <Image
                        src={currentImage}
                        alt={product.name}
                        fill
                        className="object-contain p-12 hover:scale-105 transition-transform duration-700"
                    />
                    {discount > 0 && (
                        <div className="absolute top-8 left-8 bg-red-500 text-white font-bold px-4 py-2 rounded-2xl shadow-lg z-10">
                            {discount}% OFF
                        </div>
                    )}
                    <button className="absolute top-8 right-8 p-3 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-primary-500 transition-colors border border-slate-100 shadow-sm">
                        <Share2 size={20} />
                    </button>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <span className="text-sm font-bold text-primary-500 uppercase tracking-widest">{product.category}</span>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">{product.name}</h1>
                        <div className="flex items-center gap-2">
                            <div className="flex text-gold-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill={i < 4 ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <span className="text-sm text-slate-500">(150+ Reviews)</span>
                            <span className="text-slate-200">|</span>
                            <span className="text-sm text-green-600 font-bold">In Stock</span>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-4 py-4 border-y border-slate-100">
                        <span className="text-5xl font-bold text-slate-900">₹{currentPrice}</span>
                        {currentMrp > currentPrice && (
                            <span className="text-xl text-slate-400 line-through font-medium">MRP: ₹{currentMrp}</span>
                        )}
                    </div>

                    <p className="text-lg text-slate-600 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Variant Selection */}
                    {product.variants && Array.isArray(product.variants) && product.variants.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Size</label>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map((v: any) => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVariant(v)}
                                        className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border-2 ${selectedVariant?.id === v.id
                                            ? "border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-200"
                                            : "border-slate-100 bg-slate-50 text-slate-600 hover:border-primary-200"
                                            }`}
                                    >
                                        {v.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity Selection */}
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quantity</label>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 hover:bg-slate-100 transition-colors text-slate-500 font-bold"
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 text-slate-900 font-bold min-w-[3rem] text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-2 hover:bg-slate-100 transition-colors text-slate-500 font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="flex flex-col items-center gap-2 p-4 bg-primary-50/50 rounded-2xl border border-primary-100">
                            <ShieldCheck className="text-primary-500" size={24} />
                            <span className="text-[10px] font-bold text-primary-700 text-center">100% PURE</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 bg-primary-50/50 rounded-2xl border border-primary-100">
                            <Truck className="text-primary-500" size={24} />
                            <span className="text-[10px] font-bold text-primary-700 text-center">SECURE SHIPPING</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 bg-primary-50/50 rounded-2xl border border-primary-100">
                            <RefreshCw className="text-primary-500" size={24} />
                            <span className="text-[10px] font-bold text-primary-700 text-center">EASY RETURNS</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => addToCart(product, quantity, selectedVariant)}
                            className="flex-1 px-8 py-5 bg-primary-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary-600 transition-all shadow-xl shadow-primary-200 active:scale-95"
                        >
                            <ShoppingCart size={24} />
                            Add to Cart
                        </button>
                        <button
                            onClick={() => {
                                const variantText = selectedVariant ? ` (${selectedVariant.name})` : "";
                                window.open(`https://wa.me/+918882522738?text=Hi, I want to order ${product.name}${variantText} - Quantity: ${quantity}`, "_blank");
                            }}
                            className="flex-1 px-8 py-5 bg-green-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-green-600 transition-all shadow-xl shadow-green-200 active:scale-95"
                        >
                            Order on WhatsApp
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="mt-20 border-t border-slate-100 pt-16">
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-10">You might also like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p as any} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
