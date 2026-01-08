"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 👈 Penting untuk fungsi redirect logout

export default function AdminDashboard() {
  const router = useRouter();
  
  // --- STATE DATA ---
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. AMBIL DATA STATISTIK DARI BACKEND ---
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("http://localhost:3001/stats"); 
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          console.error("Gagal mengambil data statistik");
        }
      } catch (error) {
        console.error("Error koneksi ke backend:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  // --- 2. FUNGSI LOGOUT ---
  const handleLogout = () => {
    // Hapus Cookie 'admin_session' dengan men-set tanggal kadaluarsa ke masa lalu
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    // Arahkan ke halaman login
    router.push("/login");
  };

  // --- HELPER FORMAT RUPIAH ---
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <div className="flex flex-col md:flex-row min-h-screen">
        
        {/* --- SIDEBAR --- */}
        <aside className="w-full md:w-64 bg-[#111] text-white p-6 flex-shrink-0 flex flex-col justify-between">
          <div>
            <div className="mb-10 flex items-center gap-3">
               <div className="w-8 h-8 bg-[#E85D04] rounded flex items-center justify-center font-bold text-white">NS</div>
               <span className="font-bold text-xl tracking-wider">ADMIN</span>
            </div>
            
            <nav className="space-y-2">
              <Link href="/admin" className="block py-3 px-4 bg-[#E85D04] rounded-lg font-bold text-white shadow-lg shadow-orange-900/20">
                Dashboard
              </Link>
              <Link href="/admin/products" className="block py-3 px-4 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                Kelola Produk
              </Link>
              <Link href="/admin/orders" className="block py-3 px-4 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                Pesanan Masuk
              </Link>
              <Link href="/admin/reports" className="block py-3 px-4 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                Laporan
              </Link>
              <Link href="/admin/comments" className="block py-3 px-4 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
    Komentar Netizen
  </Link>
            </nav>
          </div>

          {/* Tombol Logout */}
          <div className="mt-10 pt-10 border-t border-white/10">
            <button 
              onClick={handleLogout} 
              className="w-full text-left py-2 px-4 text-sm text-red-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors font-bold flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          </div>
        </aside>

        {/* --- CONTENT UTAMA --- */}
        <main className="flex-1 p-8 overflow-y-auto">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500">Ringkasan aktivitas toko hari ini.</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-sm border text-sm font-medium">
               Halo, Admin 👋
            </div>
          </header>

          {/* KARTU STATISTIK */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Card 1: Pendapatan */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div>
                   <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Pendapatan</h3>
                   <p className="text-2xl font-bold text-gray-900">
                     {isLoading ? "..." : formatRupiah(stats.totalSales)}
                   </p>
                </div>
              </div>
            </div>

            {/* Card 2: Pesanan */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                </div>
                <div>
                   <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Pesanan</h3>
                   <p className="text-2xl font-bold text-gray-900">
                     {isLoading ? "..." : stats.totalOrders} <span className="text-sm font-normal text-gray-400">transaksi</span>
                   </p>
                </div>
              </div>
            </div>

            {/* Card 3: Produk */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div>
                   <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Produk</h3>
                   <p className="text-2xl font-bold text-gray-900">
                     {isLoading ? "..." : stats.totalProducts} <span className="text-sm font-normal text-gray-400">item</span>
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* AKSI CEPAT */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Aksi Cepat</h3>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/admin/products/create" 
                className="bg-[#E85D04] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#c04d03] transition flex items-center gap-2 shadow-lg shadow-orange-500/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Tambah Produk Baru
              </Link>
              
              <Link 
                href="/admin/reports" 
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Cek Laporan
              </Link>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}