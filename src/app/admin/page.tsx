"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
    LayoutDashboard, Package, Users, BarChart3, Plus, Search,
    MoreVertical, Edit, Trash2, X, Loader2, Upload, Sparkles, Check, Clipboard, ImagePlus
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

    // Multiple images support
    const [productImages, setProductImages] = useState<(File | string)[]>([]);
    const [categoryImage, setCategoryImage] = useState<File | string | null>(null);

    // Refs for paste functionality
    const productImageRef = useRef<HTMLDivElement>(null);
    const categoryImageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        checkUser();
        fetchProducts();
        fetchCategories();
    }, []);

    // Handle paste for product images
    const handleProductImagePaste = useCallback((e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    setProductImages(prev => [...prev, file]);
                    e.preventDefault();
                    break;
                }
            }
        }
    }, []);

    // Handle paste for category image
    const handleCategoryImagePaste = useCallback((e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    setCategoryImage(file);
                    e.preventDefault();
                    break;
                }
            }
        }
    }, []);

    // Handle paste for variant images
    const handleVariantImagePaste = useCallback((e: ClipboardEvent, idx: number) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    const nv = [...variants];
                    nv[idx].file = file;
                    setVariants(nv);
                    e.preventDefault();
                    break;
                }
            }
        }
    }, [variants]);

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

    // Upload a single image file
    const uploadImage = async (file: File, folder: string): Promise<string | null> => {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);
            return publicUrl;
        }
        return null;
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget as HTMLFormElement);

        // Handle Multiple Product Images Upload
        const imageUrls: string[] = [];
        for (const img of productImages) {
            if (typeof img === 'string') {
                imageUrls.push(img);
            } else if (img instanceof File) {
                const url = await uploadImage(img, 'products');
                if (url) imageUrls.push(url);
            }
        }

        // Handle Variant Image Uploads
        const variantsWithUrls = await Promise.all(variants.map(async (v) => {
            let variantImage = v.image;
            if (v.file) {
                const url = await uploadImage(v.file, 'variants');
                if (url) variantImage = url;
            }
            return {
                id: v.id,
                name: v.name,
                price: v.price,
                mrp: v.mrp,
                image: variantImage
            };
        }));

        const productData = {
            name: formData.get("name"),
            category: formData.get("category"),
            price: parseFloat(formData.get("price") as string),
            mrp: parseFloat(formData.get("mrp") as string),
            stock: parseInt(formData.get("stock") as string),
            description: formData.get("description"),
            image: imageUrls[0] || currentProduct?.image || null,
            images: imageUrls,
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
        setProductImages([]);
        fetchProducts();
        setIsSaving(false);
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const name = formData.get("name") as string;

        let imageUrl = currentCategory?.image_url;

        if (categoryImage) {
            if (categoryImage instanceof File) {
                const url = await uploadImage(categoryImage, 'categories');
                if (url) imageUrl = url;
            } else {
                imageUrl = categoryImage;
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
        setCategoryImage(null);
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

    const openProductModal = (product: any = null) => {
        setCurrentProduct(product);
        setVariants(product?.variants || []);
        setProductImages(product?.images || (product?.image ? [product.image] : []));
        setShowModal(true);
    };

    const openCategoryModal = (category: any = null) => {
        setCurrentCategory(category);
        setCategoryImage(category?.image_url || null);
        setShowCategoryModal(true);
    };

    const removeProductImage = (index: number) => {
        setProductImages(prev => prev.filter((_, i) => i !== index));
    };

    const getImageSrc = (img: File | string): string => {
        if (typeof img === 'string') return img;
        return URL.createObjectURL(img);
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
                            onClick={() => openProductModal()}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-600 transition-all min-h-[48px]"
                        >
                            <Plus size={18} /> Add New Product
                        </button>
                    )}
                    {activeTab === "categories" && (
                        <button
                            onClick={() => openCategoryModal()}
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
                                                <button onClick={() => openProductModal(p)} className="p-2 text-slate-400 hover:text-primary-600 transition-colors"><Edit size={16} /></button>
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
                                                <button onClick={() => openCategoryModal(cat)} className="p-2 text-slate-400 hover:text-primary-600 transition-colors"><Edit size={16} /></button>
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
                                    <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                    <textarea name="description" defaultValue={currentProduct?.description} rows={2} className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 resize-none" />
                                </div>
                            </div>

                            {/* Multiple Product Images */}
                            <div className="flex flex-col gap-3">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                    <ImagePlus size={14} /> Product Images (Multiple)
                                </label>
                                <div
                                    ref={productImageRef}
                                    className="flex flex-wrap gap-3 p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl min-h-[100px]"
                                    tabIndex={0}
                                    onPaste={(e) => handleProductImagePaste(e.nativeEvent)}
                                >
                                    {productImages.map((img, idx) => (
                                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-md group">
                                            <Image src={getImageSrc(img)} alt={`Product ${idx + 1}`} fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeProductImage(idx)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-primary-50 hover:border-primary-300 cursor-pointer transition-all">
                                        <Upload size={20} />
                                        <span className="text-[10px] mt-1">Add</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={e => {
                                                const files = Array.from(e.target.files || []);
                                                setProductImages(prev => [...prev, ...files]);
                                            }}
                                        />
                                    </label>
                                </div>
                                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                    <Clipboard size={10} /> Tip: Click the area above and paste (Ctrl+V) to add images from clipboard
                                </p>
                            </div>

                            {/* Variants Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Variants / Sizes</label>
                                    <button
                                        type="button"
                                        onClick={() => setVariants([...variants, { id: Date.now().toString(), name: "", price: 0, mrp: 0, image: "", file: null }])}
                                        className="text-xs font-bold text-primary-500 flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add Variant
                                    </button>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {variants.map((v, idx) => (
                                        <div
                                            key={v.id || idx}
                                            className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                                            tabIndex={0}
                                            onPaste={(e) => handleVariantImagePaste(e.nativeEvent, idx)}
                                        >
                                            <div className="md:col-span-2 flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Size</label>
                                                <input
                                                    value={v.name}
                                                    placeholder="e.g. 100g"
                                                    onChange={e => { const nv = [...variants]; nv[idx].name = e.target.value; setVariants(nv); }}
                                                    className="px-3 py-2 bg-white border border-slate-100 rounded-xl text-xs text-slate-900 placeholder:text-slate-400"
                                                />
                                            </div>
                                            <div className="md:col-span-2 flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">MRP (₹)</label>
                                                <input
                                                    type="number"
                                                    value={v.mrp || 0}
                                                    onChange={e => { const nv = [...variants]; nv[idx].mrp = parseFloat(e.target.value) || 0; setVariants(nv); }}
                                                    className="px-3 py-2 bg-white border border-slate-100 rounded-xl text-xs text-slate-900 placeholder:text-slate-400"
                                                />
                                            </div>
                                            <div className="md:col-span-2 flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Price (₹)</label>
                                                <input
                                                    type="number"
                                                    value={v.price}
                                                    onChange={e => { const nv = [...variants]; nv[idx].price = parseFloat(e.target.value) || 0; setVariants(nv); }}
                                                    className="px-3 py-2 bg-white border border-slate-100 rounded-xl text-xs text-slate-900 placeholder:text-slate-400"
                                                />
                                            </div>
                                            <div className="md:col-span-4 flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Photo (paste or upload)</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-10 rounded-lg bg-white border shrink-0 relative overflow-hidden">
                                                        {(v.file || v.image) && <Image src={v.file ? URL.createObjectURL(v.file) : v.image} alt="V" fill className="object-cover" />}
                                                    </div>
                                                    <label className="flex-1 px-3 py-2 bg-white border border-dashed rounded-xl text-[10px] font-bold text-slate-400 flex items-center justify-center cursor-pointer hover:bg-primary-50">
                                                        <Upload size={12} className="mr-1" /> {v.file ? "✓ Done" : "Upload"}
                                                        <input type="file" accept="image/*" className="hidden" onChange={e => { const nv = [...variants]; nv[idx].file = e.target.files?.[0] || null; setVariants(nv); }} />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <button type="button" onClick={() => setVariants(variants.filter((_, i) => i !== idx))} className="w-full py-2 bg-white text-red-400 border border-red-100 rounded-xl hover:bg-red-50"><Trash2 size={16} className="mx-auto" /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {variants.length === 0 && (
                                        <p className="text-center text-slate-400 text-sm py-4">No variants added. Click "Add Variant" to create size/weight options.</p>
                                    )}
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
                                <label className="text-xs font-bold text-slate-500 uppercase">Category Image</label>
                                <div
                                    ref={categoryImageRef}
                                    className="w-full p-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 font-bold hover:bg-primary-50 transition-colors"
                                    tabIndex={0}
                                    onPaste={(e) => handleCategoryImagePaste(e.nativeEvent)}
                                >
                                    {categoryImage ? (
                                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-white shadow-lg">
                                            <Image src={getImageSrc(categoryImage)} alt="Category" fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setCategoryImage(null)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload size={24} />
                                            <span className="text-sm">Click to upload or paste image</span>
                                        </>
                                    )}
                                    <label className="px-4 py-2 bg-primary-500 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-primary-600 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={e => setCategoryImage(e.target.files?.[0] || null)}
                                        />
                                        {categoryImage ? "Change Image" : "Browse Files"}
                                    </label>
                                </div>
                                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                    <Clipboard size={10} /> Tip: Click the area above and paste (Ctrl+V) to add from clipboard
                                </p>
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
