"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- LOGIKA LOGIN SEDERHANA ---
    // Di dunia nyata, ini dicek ke database.
    // Untuk sekarang, kita hardcode dulu biar cepat.
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "nightstalkers123"; // Password rahasia kamu

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // 1. Simpan "Tiket" di Cookie Browser
      document.cookie = "admin_session=true; path=/; max-age=86400"; // Berlaku 1 hari
      
      // 2. Masuk ke Admin
      router.push("/admin");
    } else {
      setError("Username atau Password salah! Jangan memaksa masuk.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-sans">
      <div className="w-full max-w-md p-8 bg-[#111] border border-white/10 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center font-bold text-white text-2xl mx-auto mb-4 shadow-lg shadow-orange-900/50">
            NS
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-gray-500 text-sm">Hanya untuk personel NightStalkers.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-900 text-red-400 text-sm p-3 rounded text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Username</label>
            <input 
              type="text" 
              className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
            <input 
              type="password" 
              className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-all shadow-lg shadow-orange-900/20"
          >
            Masuk Portal
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <a href="/" className="text-gray-600 text-sm hover:text-white transition-colors">← Kembali ke Website Utama</a>
        </div>
      </div>
    </div>
  );
}