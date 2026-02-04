"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    LayoutDashboard, Package, Users, BarChart3, Plus, Search,
    MoreVertical, Edit, Trash2, X, Loader2, Upload, Sparkles, Check
} from "lucide-react";
import Image from "next/image";
import AdminLogin from "@/components/admin/AdminLogin";

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("products");
    const [showModal, setShowModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<any>(null);
    const [currentCategory, setCurrentCategory] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [variants, setVariants] = useState<any[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        checkUser();
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("name", { ascending: true });
        if (!error && data) setCategories(data);
    };

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

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget as HTMLFormElement);

        // Handle Main Image Upload
        let imageUrl = currentProduct?.image;
        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `products/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, imageFile);
            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
                imageUrl = publicUrl;
            }
        }

        // Handle Variant Image Uploads
        const variantsWithUrls = await Promise.all(variants.map(async (v) => {
            if (v.file) {
                const fileExt = v.file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `variants/${fileName}`;
                const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, v.file);
                if (!uploadError) {
                    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
                    return { ...v, image: publicUrl, file: undefined };
                }
            }
            return { ...v, file: undefined };
        }));

        const productData = {
            name: formData.get("name"),
            category: formData.get("category"),
            price: parseFloat(formData.get("price") as string),
            mrp: parseFloat(formData.get("mrp") as string),
            stock: parseInt(formData.get("stock") as string),
            description: formData.get("description"),
            image: imageUrl,
            variants: variantsWithUrls,
        };

        if (currentProduct) {
            await supabase.from("products").update(productData).eq("id", currentProduct.id);
        } else {
            await supabase.from("products").insert([productData]);
        }

        setShowModal(false);
        setCurrentProduct(null);
        setVariants([]);
        setImageFile(null);
        fetchProducts();
        setIsSaving(false);
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const name = formData.get("name") as string;
        const imageFile = formData.get("categoryImage") as File;
        let imageUrl = currentCategory?.image_url;

        if (imageFile && imageFile.name) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `categories/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, imageFile);

            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);
                imageUrl = publicUrl;
            }
        }

        const categoryData = { name, image_url: imageUrl };

        if (currentCategory) {
            await supabase.from("categories").update(categoryData).eq("id", currentCategory.id);
        } else {
            await supabase.from("categories").insert([categoryData]);
        }

        setShowCategoryModal(false);
        setCurrentCategory(null);
        fetchCategories();
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            await supabase.from("products").delete().eq("id", id);
            fetchProducts();
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (confirm("Are you sure you want to delete this category?")) {
            await supabase.from("categories").delete().eq("id", id);
            fetchCategories();
        }
    };

    if (isAuthenticated === null) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary-500" /></div>;
    if (!isAuthenticated) return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar (Mobile optimized) */}
            <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 p-8">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-100">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    <span className="text-xl font-display font-bold text-slate-900">Admin Hub</span>
                </div>

                <nav className="flex flex-col gap-2">
                    {[
                        { id: "overview", icon: LayoutDashboard, label: "Overview" },
                        { id: "products", icon: Package, label: "Products" },
                        { id: "categories", icon: LayoutDashboard, label: "Categories" },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === item.id ? "bg-primary-50 text-primary-600" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                        <p className="text-slate-400 text-sm font-medium">Manage your boutique's divine collection.</p>
                    </div>

                    {activeTab === "products" && (
                        <button
                            onClick={() => { setCurrentProduct(null); setVariants([]); setImageFile(null); setShowModal(true); }}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-600 transition-all min-h-[48px]"
                        >
                            <Plus size={18} /> Add New Product
                        </button>
                    )}
                    {activeTab === "categories" && (
                        <button
                            onClick={() => { setCurrentCategory(null); setShowCategoryModal(true); }}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-600 transition-all min-h-[48px]"
                        >
                            <Plus size={18} /> Add New Category
                        </button>
                    )}
                </header>

                {activeTab === "products" ? (
                    <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
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
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-4">
                                            <div className="relative w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100">
                                                <Image src={p.image || "/placeholder.jpg"} alt={p.name} fill className="object-cover" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-800">{p.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-500">{p.category}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{p.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${p.stock > 10 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                                                {p.stock} in stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => { setCurrentProduct(p); setVariants(p.variants || []); setShowModal(true); }} className="p-2 text-slate-400 hover:text-primary-600 transition-colors"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === "categories" ? (
                    <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                        <table className="w-full text-left min-w-[400px]">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-4">
                                            <div className="relative w-10 h-10 rounded-xl bg-slate-50 overflow-hidden border border-slate-100">
                                                <Image src={cat.image_url || "/placeholder.jpg"} alt={cat.name} fill className="object-cover" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-800">{cat.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => { setCurrentCategory(cat); setShowCategoryModal(true); }} className="p-2 text-slate-400 hover:text-primary-600 transition-colors"><Edit size={16} /></button>
                                                <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 text-center bg-white rounded-[3rem] border border-slate-100">
                        <BarChart3 size={48} className="mx-auto text-slate-200 mb-4" />
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Analytics Coming Soon</h2>
                    </div>
                )}
            </main>

            {/* Product Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] md:rounded-[3rem] shadow-2xl p-6 md:p-12 relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900"><X size={24} /></button>
                        <h2 className="text-3xl font-display font-bold text-slate-900 mb-8">{currentProduct ? "Edit Product" : "New Product"}</h2>

                        <form onSubmit={handleSaveProduct} className="flex flex-col gap-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                                    <input name="name" defaultValue={currentProduct?.name} required className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-100 min-h-[48px] text-slate-900 placeholder:text-slate-400" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                                    <select name="category" defaultValue={currentProduct?.category} required className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl min-h-[48px] text-slate-900">
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">MRP (₹)</label>
                                    <input name="mrp" type="number" defaultValue={currentProduct?.mrp} required className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Selling Price (₹)</label>
                                    <input name="price" type="number" defaultValue={currentProduct?.price} required className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Stock</label>
                                    <input name="stock" type="number" defaultValue={currentProduct?.stock} required className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Main Image</label>
                                    <div className="flex gap-4">
                                        <div className="relative w-12 h-12 bg-slate-50 border rounded-xl overflow-hidden shrink-0">
                                            {(imageFile || currentProduct?.image) && <Image src={imageFile ? URL.createObjectURL(imageFile) : currentProduct.image} alt="P" fill className="object-cover" />}
                                        </div>
                                        <label className="flex-1 px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 text-xs font-bold hover:bg-primary-50 cursor-pointer">
                                            <Upload size={16} /> {imageFile ? "Change" : "Upload Image"}
                                            <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Variants / Sizes</label>
                                    <button type="button" onClick={() => setVariants([...variants, { id: Date.now().toString(), name: "", price: 0, mrp: 0, image: "", file: null }])} className="text-xs font-bold text-primary-500 flex items-center gap-1"><Plus size={14} /> Add Variant</button>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {variants.map((v, idx) => (
                                        <div key={v.id || idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                            <div className="md:col-span-3 flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Size</label>
                                                <input value={v.name} placeholder="e.g. 100g" onChange={e => { const nv = [...variants]; nv[idx].name = e.target.value; setVariants(nv); }} className="px-3 py-2 bg-white border border-slate-100 rounded-xl text-xs text-slate-900 placeholder:text-slate-400" />
                                            </div>
                                            <div className="md:col-span-2 flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Price</label>
                                                <input type="number" value={v.price} onChange={e => { const nv = [...variants]; nv[idx].price = parseFloat(e.target.value); setVariants(nv); }} className="px-3 py-2 bg-white border border-slate-100 rounded-xl text-xs text-slate-900 placeholder:text-slate-400" />
                                            </div>
                                            <div className="md:col-span-3 flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Photo</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-white border shrink-0 relative overflow-hidden">
                                                        {(v.file || v.image) && <Image src={v.file ? URL.createObjectURL(v.file) : v.image} alt="V" fill className="object-cover" />}
                                                    </div>
                                                    <label className="flex-1 px-3 py-2 bg-white border border-dashed rounded-xl text-[10px] font-bold text-slate-400 flex items-center justify-center cursor-pointer">
                                                        <Upload size={12} className="mr-1" /> {v.file ? "✓" : "Up"}
                                                        <input type="file" accept="image/*" className="hidden" onChange={e => { const nv = [...variants]; nv[idx].file = e.target.files?.[0] || null; setVariants(nv); }} />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <button type="button" onClick={() => setVariants(variants.filter((_, i) => i !== idx))} className="w-full py-2 bg-white text-red-400 border border-red-100 rounded-xl hover:bg-red-50"><Trash2 size={16} className="mx-auto" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" disabled={isSaving} className="w-full py-5 bg-primary-500 text-white rounded-[2rem] font-bold shadow-xl shadow-primary-200 hover:bg-primary-600 transition-all flex items-center justify-center gap-2 min-h-[56px]">
                                {isSaving ? <Loader2 className="animate-spin" /> : currentProduct ? "Update Product" : "Save Product"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[2rem] md:rounded-[3rem] shadow-2xl p-6 md:p-12 relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setShowCategoryModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900"><X size={24} /></button>
                        <h2 className="text-3xl font-display font-bold text-slate-900 mb-8">{currentCategory ? "Edit Category" : "New Category"}</h2>

                        <form onSubmit={handleSaveCategory} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Category Name</label>
                                <input name="name" defaultValue={currentCategory?.name} required className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl min-h-[48px] text-slate-900 placeholder:text-slate-400" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Image File</label>
                                <label className="w-full p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 font-bold hover:bg-primary-50 cursor-pointer">
                                    <Upload size={24} /> <span>Upload Photo</span>
                                    <input type="file" name="categoryImage" accept="image/*" className="hidden" />
                                </label>
                            </div>
                            <button type="submit" disabled={isSaving} className="w-full py-5 bg-primary-500 text-white rounded-[2rem] font-bold shadow-xl shadow-primary-200 hover:bg-primary-600 transition-all min-h-[56px]">
                                {isSaving ? <Loader2 className="animate-spin" /> : currentCategory ? "Update Category" : "Save Category"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
