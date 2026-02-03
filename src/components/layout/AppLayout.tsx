"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <div className="flex flex-col min-h-screen selection:bg-primary-100 selection:text-primary-700">
                <Header />
                <main className="flex-grow bg-slate-50/30">
                    {children}
                </main>
                <Footer />
            </div>
        </CartProvider>
    );
}
