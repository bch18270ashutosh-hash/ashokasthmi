"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AdminLogin from "@/components/admin/AdminLogin";
import { Plus, Edit, Trash2, LayoutDashboard, Package, Users, BarChart3, Search, Upload, LogOut, Loader2, X } from "lucide-react";
import Image from "next/image";

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("products");
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        checkUser();
        fetchProducts();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
    };

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) setProducts(data);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
    };

    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget as HTMLFormElement);

        let imageUrl = formData.get("image") as string || currentProduct?.image || "https://placehold.co/400x400/FFF9ED/F97316?text=New+Product";

        // Upload image if file is selected
        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('product-images')
                .upload(filePath, imageFile);

            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);
                imageUrl = publicUrl;
            }
        }

        const productData = {
            name: formData.get("name"),
            category: formData.get("category"),
            price: parseFloat(formData.get("price") as string),
            mrp: parseFloat(formData.get("mrp") as string),
            stock: parseInt(formData.get("stock") as string),
            description: formData.get("description"),
            image: imageUrl,
        };

        if (currentProduct) {
            await supabase.from("products").update(productData).eq("id", currentProduct.id);
        } else {
            await supabase.from("products").insert([productData]);
        }

        setShowModal(false);
        setCurrentProduct(null);
        fetchProducts();
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            await supabase.from("products").delete().eq("id", id);
            fetchProducts();
        }
    };

    if (isAuthenticated === null) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary-500" /></div>;
    if (!isAuthenticated) return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white p-6 hidden lg:flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-display font-bold text-gradient-saffron">Ashok Dashboard</h2>
                </div>
                <nav className="flex flex-col gap-2 flex-1">
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
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors text-sm font-medium mt-auto"
                >
                    <LogOut size={18} /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-slate-900">
                            {activeTab === "products" ? "Products Management" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h1>
                        <p className="text-slate-500 text-sm">Update and manage your divine catalog in real-time</p>
                    </div>
                    {activeTab === "products" && (
                        <button
                            onClick={() => { setCurrentProduct(null); setShowModal(true); }}
                            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-600 transition-all"
                        >
                            <Plus size={18} /> Add New Product
                        </button>
                    )}
                </header>

                {activeTab === "products" ? (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Products</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{products.length}</h3>
                                </div>
                                <div className="p-3 bg-primary-50 text-primary-500 rounded-2xl">
                                    <Package size={24} />
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Categories</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{new Set(products.map(p => p.category)).size}</h3>
                                </div>
                                <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                                    <LayoutDashboard size={24} />
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Out of Stock</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{products.filter(p => p.stock === 0).length}</h3>
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
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                            <th className="px-6 py-4">Product</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Price</th>
                                            <th className="px-6 py-4">Stock</th>
                                            <th className="px-6 py-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {loading ? (
                                            <tr><td colSpan={5} className="p-10 text-center text-slate-400">Loading products...</td></tr>
                                        ) : products.length === 0 ? (
                                            <tr><td colSpan={5} className="p-10 text-center text-slate-400">No products found. Start by adding one!</td></tr>
                                        ) : products.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-800 line-clamp-1">{p.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium text-slate-500">{p.category}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{p.price}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs font-bold ${p.stock < 10 ? "text-red-500" : "text-green-500"}`}>
                                                        {p.stock} units
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => { setCurrentProduct(p); setShowModal(true); }}
                                                            className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(p.id)}
                                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                        >
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
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[3rem] border border-slate-100 text-center">
                        <BarChart3 size={48} className="text-slate-200 mb-4" />
                        <h2 className="text-xl font-bold text-slate-800 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon</h2>
                        <p className="text-slate-500 max-w-sm">We are currently integrating these features with your real-time database.</p>
                    </div>
                )}
            </main>

            {/* Product Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <h2 className="text-2xl font-display font-bold text-slate-900">
                                {currentProduct ? "Edit Product" : "Add New Product"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="p-8">
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                                    <input
                                        name="name"
                                        defaultValue={currentProduct?.name}
                                        required
                                        className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-100"
                                        placeholder="e.g. Pure Gangajal"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                                    <input
                                        name="category"
                                        defaultValue={currentProduct?.category}
                                        required
                                        className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-100"
                                        placeholder="e.g. Holy Water"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">MRP (₹)</label>
                                    <input
                                        name="mrp"
                                        type="number"
                                        defaultValue={currentProduct?.mrp}
                                        required
                                        className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-100"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Selling Price (₹)</label>
                                    <input
                                        name="price"
                                        type="number"
                                        defaultValue={currentProduct?.price}
                                        required
                                        className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-100"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Initial Stock</label>
                                    <input
                                        name="stock"
                                        type="number"
                                        defaultValue={currentProduct?.stock}
                                        required
                                        className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-100"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Product Image</label>
                                    <div className="flex gap-4">
                                        <div className="relative w-20 h-20 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shrink-0">
                                            {(imageFile || currentProduct?.image) ? (
                                                <Image
                                                    src={imageFile ? URL.createObjectURL(imageFile) : currentProduct?.image}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-300"><Upload size={24} /></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className="w-full h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer"
                                            >
                                                <Upload size={20} />
                                                <span className="text-[10px] font-bold uppercase">Upload File</span>
                                            </label>
                                        </div>
                                    </div>
                                    <input
                                        name="image"
                                        defaultValue={currentProduct?.image}
                                        className="mt-2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-100 text-xs"
                                        placeholder="Or paste external URL..."
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mb-8">
                                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                <textarea
                                    name="description"
                                    defaultValue={currentProduct?.description}
                                    rows={3}
                                    className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-100 resize-none"
                                    placeholder="Brief product details..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-5 bg-primary-500 text-white rounded-[2rem] font-bold shadow-xl shadow-primary-200 hover:bg-primary-600 transition-all flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="animate-spin" /> : currentProduct ? "Update Product" : "Save Product"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
