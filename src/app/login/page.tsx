"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="container mx-auto px-4 py-20 flex justify-center items-center">
            <div className="w-full max-w-md">
                <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-primary-50 shadow-2xl shadow-primary-50/50 flex flex-col gap-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-slate-500 text-sm">
                            {isLogin ? "Sign in to your sacred account" : "Join the Ashok Asthmi family"}
                        </p>
                    </div>

                    <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${isLogin ? "bg-white text-primary-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${!isLogin ? "bg-white text-primary-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                        {!isLogin && (
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-sm"
                                />
                                <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
                            </div>
                        )}

                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-sm"
                            />
                            <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-sm"
                            />
                            <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {isLogin && (
                            <Link href="#" className="text-xs font-bold text-primary-600 hover:underline text-right mt-[-8px]">
                                Forgot Password?
                            </Link>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold hover:bg-primary-600 transition-all shadow-xl shadow-primary-200 mt-4 flex items-center justify-center gap-2"
                        >
                            {isLogin ? "Sign In" : "Register Now"}
                            <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="relative flex items-center gap-4 py-2">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Or continue with</span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-600 text-sm">
                            <span className="w-5 h-5 bg-red-100 rounded-full" /> Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-600 text-sm">
                            <span className="w-5 h-5 bg-blue-100 rounded-full" /> Meta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
