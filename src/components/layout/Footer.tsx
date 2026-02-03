import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="text-2xl font-display font-bold text-white tracking-tight">
                            Ashok <span className="text-primary-400">Asthmi</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Your one-stop destination for premium, authentic, and pure puja essentials. Bringing spirituality and tradition to your doorstep since 2024.
                        </p>
                        <div className="flex gap-4 mt-2">
                            <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary-500 hover:text-white transition-all">
                                <Facebook size={18} />
                            </Link>
                            <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary-500 hover:text-white transition-all">
                                <Instagram size={18} />
                            </Link>
                            <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary-500 hover:text-white transition-all">
                                <Twitter size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                        <ul className="flex flex-col gap-3 text-sm">
                            <li><Link href="/shop" className="hover:text-primary-400 transition-colors">All Products</Link></li>
                            <li><Link href="/shop?category=Incense" className="hover:text-primary-400 transition-colors">Agarbatti & Dhoop</Link></li>
                            <li><Link href="/shop?category=Diyas" className="hover:text-primary-400 transition-colors">Diyas & Lamps</Link></li>
                            <li><Link href="/about" className="hover:text-primary-400 transition-colors">Our Story</Link></li>
                            <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact Support</Link></li>
                            <li><Link href="/admin" className="hover:text-primary-400 transition-colors">Admin Portal</Link></li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Important Info</h4>
                        <ul className="flex flex-col gap-3 text-sm">
                            <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary-400 transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/shipping" className="hover:text-primary-400 transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/returns" className="hover:text-primary-400 transition-colors">Returns & Refunds</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Contact Us</h4>
                        <ul className="flex flex-col gap-4 text-sm text-slate-400">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-primary-500 shrink-0" />
                                <span>123 Spiritual Avenue, Moksh Marg,<br />Varanasi, UP - 221001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-primary-500 shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-primary-500 shrink-0" />
                                <span>care@ashokasthmi.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} Ashok Asthmi Puja Products. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        {/* Mock payment icons */}
                        <div className="h-6 w-10 bg-slate-800 rounded"></div>
                        <div className="h-6 w-10 bg-slate-800 rounded"></div>
                        <div className="h-6 w-10 bg-slate-800 rounded"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
