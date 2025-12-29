"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Pastikan backend jalan di port 3001
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Registrasi Berhasil! Silakan Login.");
        router.push("/login"); // Pindah ke halaman login setelah sukses
      } else {
        const data = await res.json();
        setError(data.message || "Gagal mendaftar");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi ke server Backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF3E7] px-4 font-sans text-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#E85D04]/10">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#2A2A2A]">Daftar Akun</h1>
          <p className="text-gray-500 mt-2">Gabung member NightStalkers sekarang</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] transition-all"
              placeholder="Contoh: Askara"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] transition-all"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] transition-all"
              placeholder="Minimal 6 karakter"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E85D04] text-white py-3 rounded-xl font-bold hover:bg-[#c04d03] transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-[#E85D04] font-bold hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}