"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Variant } from "@/types";

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number, variant?: Variant) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("ashok_asthmi_cart");
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to load cart", e);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("ashok_asthmi_cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product, quantity: number = 1, variant?: Variant) => {
        setCart((prev) => {
            const variantId = variant?.id;
            const existing = prev.find((item) => item.id === product.id && item.variantId === variantId);

            if (existing) {
                return prev.map((item) =>
                    item.id === product.id && item.variantId === variantId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            const newItem: CartItem = {
                ...product,
                quantity,
                variantId,
                selectedSize: variant?.name,
                // Override price/image if it's a variant
                price: variant?.price ?? product.price,
                mrp: variant?.mrp ?? product.mrp,
                image: (variant?.image && variant.image.length > 0) ? variant.image : product.image
            };
            return [...prev, newItem];
        });
    };

    const removeFromCart = (cartItemId: string) => {
        // We now use a unique ID logic if needed, but for now we filter by product ID + variant ID
        // Simplified: use a combination as ID
        setCart((prev) => prev.filter((item) => {
            const itemId = item.variantId ? `${item.id}-${item.variantId}` : item.id;
            return itemId !== cartItemId;
        }));
    };

    const updateQuantity = (cartItemId: string, delta: number) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    const itemId = item.variantId ? `${item.id}-${item.variantId}` : item.id;
                    if (itemId === cartItemId) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : item;
                    }
                    return item;
                })
                .filter((item) => item.quantity > 0)
        );
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
