"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Phone } from "lucide-react";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleWhatsAppOrder = () => {
        if (!formData.name || !formData.phone || !formData.address) {
            alert("Please fill in your details to proceed.");
            return;
        }

        const cartSummary = cart
            .map((item) => `${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`)
            .join("\n");

        const message = `*New Order from Ashok Asthmi*\n\n*Items:*\n${cartSummary}\n\n*Total:* ₹${cartTotal}\n\n*Customer Details:*\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}, ${formData.city} - ${formData.pincode}`;

        const whatsappUrl = `https://wa.me/+910000000000?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-8">
                    <ShoppingBag size={48} className="text-primary-300" />
                </div>
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">Your cart is empty</h1>
                <p className="text-slate-500 max-w-sm mb-12">
                    Looks like you haven't added any divine items to your cart yet. Start shopping to fill it up!
                </p>
                <Link
                    href="/shop"
                    className="px-8 py-4 bg-primary-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-12 text-center">Your Sacred Bundle</h1>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-white rounded-[2rem] border border-primary-50 overflow-hidden shadow-sm">
                        <div className="p-6 md:p-8 flex flex-col gap-8">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-6 items-center">
                                    <div className="relative h-24 w-24 rounded-2xl bg-primary-50/50 overflow-hidden border border-primary-50 shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-contain p-3" />
                                    </div>

                                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex flex-col gap-1">
                                            <h3 className="font-bold text-slate-800 line-clamp-1">{item.name}</h3>
                                            <p className="text-xs text-primary-500 font-medium">{item.category}</p>
                                            <p className="text-sm font-bold text-slate-900">₹{item.price}</p>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1 border border-slate-100">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="p-1 text-slate-400 hover:text-primary-600 transition-colors"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="p-1 text-slate-400 hover:text-primary-600 transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-50 p-6 md:p-8 flex justify-between items-center border-t border-slate-100">
                            <span className="font-medium text-slate-600">Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                            <span className="text-2xl font-bold text-slate-900">₹{cartTotal}</span>
                        </div>
                    </div>

                    <Link href="/shop" className="flex items-center gap-2 text-primary-600 font-bold hover:underline">
                        <ShoppingBag size={18} /> Continue Shopping
                    </Link>
                </div>

                {/* Checkout Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[2rem] border border-primary-50 p-8 shadow-xl shadow-primary-50/50 flex flex-col gap-6 sticky top-24">
                        <h2 className="text-xl font-bold text-slate-900">Delivery Details</h2>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Rahul Sharma"
                                    className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 9876543210"
                                    className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Full Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="House No., Street name, Landmark"
                                    className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-sm resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Varanasi"
                                        className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        placeholder="221001"
                                        className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-6 border-t border-slate-100 flex flex-col gap-4">
                            <div className="flex justify-between items-center text-slate-500">
                                <span className="text-sm">Shipping</span>
                                <span className="text-sm font-bold text-green-600 uppercase">FREE</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-900">
                                <span className="font-bold">Total Amount</span>
                                <span className="text-2xl font-bold">₹{cartTotal}</span>
                            </div>

                            <button
                                onClick={handleWhatsAppOrder}
                                className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-green-600 transition-all shadow-xl shadow-green-200 active:scale-95 mt-2"
                            >
                                <Phone size={20} />
                                Order via WhatsApp
                            </button>
                            <p className="text-[10px] text-slate-400 text-center uppercase tracking-wider font-medium">
                                Clicking will share your cart with us on WhatsApp
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
