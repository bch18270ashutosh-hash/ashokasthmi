"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;
            onLogin();
        } catch (err: any) {
            setError(err.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white p-10 rounded-[3rem] border border-primary-50 shadow-xl shadow-primary-50/20">
                <div className="flex flex-col items-center gap-4 mb-10 text-center">
                    <div className="p-4 bg-primary-50 text-primary-500 rounded-3xl">
                        <Lock size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-900">Admin Access</h1>
                        <p className="text-sm text-slate-500">Sign in to manage your store</p>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all text-slate-900 placeholder:text-slate-400"
                                placeholder="admin@ashokasthmi.in"
                                required
                            />
                            <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all text-slate-900 placeholder:text-slate-400"
                                placeholder="••••••••"
                                required
                            />
                            <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-primary-500 text-white rounded-2xl font-bold hover:bg-primary-600 transition-all shadow-xl shadow-primary-200 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Sign In to Dashboard"}
                    </button>
                </form>

                <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed">
                    Default login is your Supabase user.<br />
                    Secure access powered by Ashok Asthmi Cloud.
                </p>
            </div>
        </div>
    );
}
