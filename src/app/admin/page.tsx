"use client";

import React, { useState } from "react";
import productsData from "@/data/products.json";
import { Plus, Edit, Trash2, LayoutDashboard, Package, Users, BarChart3, Search, Upload } from "lucide-react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("products");

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white p-6 hidden lg:flex flex-col gap-8">
                <h2 className="text-xl font-display font-bold text-gradient-saffron">Ashok Dashboard</h2>
                <nav className="flex flex-col gap-2">
                    {[
                        { id: "overview", icon: LayoutDashboard, label: "Overview" },
                        { id: "products", icon: Package, label: "Products" },
                        { id: "orders", icon: BarChart3, label: "Orders" },
                        { id: "customers", icon: Users, label: "Customers" },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? "bg-primary-500 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-slate-900">Products Management</h1>
                        <p className="text-slate-500 text-sm">Update and manage your divine catalog</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-200">
                        <Plus size={18} /> Add New Product
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Products</p>
                            <h3 className="text-2xl font-bold text-slate-900">124</h3>
                        </div>
                        <div className="p-3 bg-primary-50 text-primary-500 rounded-2xl">
                            <Package size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Categories</p>
                            <h3 className="text-2xl font-bold text-slate-900">8</h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                            <LayoutDashboard size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Low Stock</p>
                            <h3 className="text-2xl font-bold text-slate-900">12</h3>
                        </div>
                        <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                            <BarChart3 size={24} />
                        </div>
                    </div>
                </div>

                {/* Product List */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Find in product list..."
                                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-100 outline-none w-64"
                            />
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg">Export CSV</button>
                            <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg">Import XML</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {productsData.slice(0, 5).map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-lg shrink-0"></div>
                                                <span className="text-sm font-bold text-slate-800 line-clamp-1">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-500">{p.category}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{p.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold ${p.stock < 20 ? "text-red-500" : "text-green-500"}`}>
                                                {p.stock} units
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full">Active</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Product Modal (UI Placeholder) */}
                <section className="mt-12 bg-white p-8 rounded-[3rem] border border-primary-50">
                    <h2 className="text-xl font-bold mb-8">Add / Edit Product UI Placeholder</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                                <input
                                    type="text"
                                    className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                                    placeholder="e.g. Pure Gangajal"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">MRP</label>
                                    <input
                                        type="number"
                                        className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Selling Price</label>
                                    <input
                                        type="number"
                                        className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Product Image</label>
                                <div className="h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer">
                                    <Upload size={32} />
                                    <span className="text-xs font-bold">Recommended: 800x800px</span>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold">Save Product</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
