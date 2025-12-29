"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data order dari backend
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("http://localhost:3001/orders");
        if (res.ok) {
          const data = await res.json();
          // Kita anggap laporan hanya untuk order yang sudah SELESAI atau DI PROSES (Opsional)
          // Kalau mau semua, hapus filter ini.
          // const finishedOrders = data.filter((o: any) => o.status === 'COMPLETED' || o.status === 'SHIPPED'); 
          setOrders(data); 
        }
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Hitung Total Pemasukan
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);

  // Helper Format Rupiah
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  // Fungsi Cetak
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans text-gray-900 print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-xl shadow-sm print:shadow-none">
        
        {/* HEADER LAPORAN */}
        <div className="flex justify-between items-start mb-10 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Laporan Penjualan</h1>
            <p className="text-gray-500">NightStalkers Studio</p>
            <p className="text-sm text-gray-400 mt-1">Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
          </div>
          <div className="flex gap-3 print:hidden">
            <Link 
              href="/admin" 
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 font-bold hover:bg-gray-50"
            >
              Kembali
            </Link>
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-[#E85D04] text-white rounded-lg font-bold hover:bg-[#c04d03] flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Cetak Laporan
            </button>
          </div>
        </div>

        {/* RINGKASAN */}
        <div className="grid grid-cols-2 gap-6 mb-10 print:mb-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 print:border-black">
            <span className="text-sm text-gray-500 font-bold uppercase">Total Transaksi</span>
            <p className="text-2xl font-bold text-gray-800">{orders.length} <span className="text-sm font-normal">order</span></p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 print:border-black">
            <span className="text-sm text-orange-600 font-bold uppercase">Total Pemasukan</span>
            <p className="text-2xl font-bold text-[#E85D04] print:text-black">{formatRupiah(totalRevenue)}</p>
          </div>
        </div>

        {/* TABEL TRANSAKSI */}
        {isLoading ? (
          <p className="text-center py-10">Memuat data...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 font-bold text-sm text-gray-600 uppercase">No. ID</th>
                <th className="py-3 font-bold text-sm text-gray-600 uppercase">Tanggal</th>
                <th className="py-3 font-bold text-sm text-gray-600 uppercase">Pelanggan</th>
                <th className="py-3 font-bold text-sm text-gray-600 uppercase">Status</th>
                <th className="py-3 font-bold text-sm text-gray-600 uppercase text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 print:hover:bg-transparent">
                  <td className="py-4 font-mono text-xs text-gray-500">#{order.id}</td>
                  <td className="py-4 text-sm text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-4">
                    <div className="font-bold text-gray-800 text-sm">{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.paymentMethod}</div>
                  </td>
                  <td className="py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200 print:border-black print:text-black print:bg-transparent' : 
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 print:border-black print:text-black print:bg-transparent' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right font-bold text-gray-800">
                    {formatRupiah(order.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="py-6 text-right font-bold uppercase text-gray-600">Grand Total</td>
                <td className="py-6 text-right font-black text-xl text-[#E85D04] print:text-black">
                  {formatRupiah(totalRevenue)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}

        {/* FOOTER PRINT */}
        <div className="hidden print:block mt-20 text-center text-xs text-gray-400">
          <p>Dicetak otomatis oleh Sistem Admin NightStalkers.</p>
        </div>

      </div>
    </div>
  );
}