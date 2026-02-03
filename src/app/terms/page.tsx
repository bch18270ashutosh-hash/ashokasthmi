import React from "react";

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="max-w-3xl mx-auto prose prose-slate">
                <h1 className="text-4xl font-display font-bold text-slate-900 mb-8">Terms & Conditions</h1>
                <p>Last updated: Feb 04, 2024</p>
                <p>
                    By using the ashokasthmi.in website, you agree to comply with the following terms of use.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">1. Orders & Pricing</h2>
                <p>
                    All orders are subject to availability. We reserve the right to change prices or cancel orders in case of technical errors or incorrect pricing information.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">2. WhatsApp Ordering</h2>
                <p>
                    Our "Order on WhatsApp" feature is a facilitation tool. Final order confirmation occurs once we verify your details and stock status via chat.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">3. Shipping & Delivery</h2>
                <p>
                    We aim to deliver within 3-7 business days across India. Delivery delays caused by courier partners are beyond our direct control.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">4. Returns & Refunds</h2>
                <p>
                    Returns are accepted for damaged or incorrect items within 48 hours of delivery. Please provide an unboxing video for verification.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">5. Governing Law</h2>
                <p>These terms are governed by the laws of India and subject to the jurisdiction of Noida, Uttar Pradesh.</p>
            </div>
        </div>
    );
}
