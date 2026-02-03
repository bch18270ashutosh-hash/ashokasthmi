"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 text-center">Get in Touch</h1>
                <p className="text-slate-500 text-center mb-16 max-w-2xl mx-auto">
                    Have questions about our products or need help with an order? Our team is here to assist you on your spiritual path.
                </p>

                <div className="grid md:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div className="flex flex-col gap-8">
                        <h2 className="text-2xl font-bold text-slate-800">Contact Information</h2>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary-50 text-primary-500 rounded-2xl">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Visit Us</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        123 Spiritual Avenue, Moksh Marg,<br />Varanasi, UP - 221001, India
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary-50 text-primary-500 rounded-2xl">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Call Us</h3>
                                    <p className="text-slate-500 text-sm">+91 98765 43210</p>
                                    <p className="text-slate-400 text-xs">Mon - Sat: 9:00 AM - 7:00 PM</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary-50 text-primary-500 rounded-2xl">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Email Us</h3>
                                    <p className="text-slate-500 text-sm">care@ashokasthmi.in</p>
                                    <p className="text-slate-400 text-xs">Expected response within 24h</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-8 bg-gradient-to-br from-primary-500 to-gold-600 rounded-[2rem] text-white">
                            <h3 className="text-xl font-bold mb-4">Fast Support via WhatsApp</h3>
                            <p className="text-white/80 text-sm mb-6">
                                Get instant replies for your queries on stock availability and bulk pricing.
                            </p>
                            <Link
                                href="https://wa.me/+910000000000"
                                className="px-6 py-3 bg-white text-primary-600 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-slate-50 transition-all"
                            >
                                Chat Now <Send size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-primary-50 shadow-xl shadow-primary-50/20">
                        <h2 className="text-2xl font-bold text-slate-800 mb-8">Send a Message</h2>
                        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Your Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="How can we help you?"
                                    className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold hover:bg-primary-600 transition-all shadow-xl shadow-primary-200"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
