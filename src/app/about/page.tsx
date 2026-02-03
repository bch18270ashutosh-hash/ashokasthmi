"use client";

import React from "react";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="max-w-3xl mx-auto prose prose-slate">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-8">Our Journey</h1>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    Welcome to Ashok Asthmi, where devotion meets authenticity. Our mission is to provide the purest puja essentials and spiritual products to every household across India.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    Founded in the holy city of Varanasi, we understand the profound significance of every ritual. From the fragrance of Mysore Sandalwood to the purity of Gangajal sourced directly from its origin, we ensure that every item in our collection is handpicked and "Ritual Ready."
                </p>
                <div className="my-16 grid grid-cols-2 gap-8 not-prose">
                    <div className="flex flex-col gap-2">
                        <span className="text-5xl font-bold text-primary-500">100%</span>
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Purity Guaranteed</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-5xl font-bold text-primary-500">5k+</span>
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Happy Homes</span>
                    </div>
                </div>
                <h2 className="text-2xl font-display font-bold text-slate-800 mb-4">Why Choose Us?</h2>
                <ul className="text-slate-600 space-y-4">
                    <li><strong>Direct Sourcing:</strong> We bypass middlemen to bring you authentic products from their traditional roots.</li>
                    <li><strong>Quality Check:</strong> Every batch is inspected to ensure it meets our high standards of cleanliness (Pavitrata).</li>
                    <li><strong>Devoted Support:</strong> We treat our customers as a family on a shared spiritual journey.</li>
                </ul>
            </div>
        </div>
    );
}
