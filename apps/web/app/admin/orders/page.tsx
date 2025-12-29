"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // Opsi status yang bisa dipilih admin
  const STATUS_OPTIONS = ["PENDING", "PROCESSED", "SHIPPED", "COMPLETED", "CANCELLED"];

  // 1. Ambil Data Order dari Backend
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3001/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Gagal ambil order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Fungsi Ubah Status saat Dropdown diganti
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    // Ubah tampilan dulu biar cepat (Optimistic Update)
    const oldOrders = [...orders];
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    try {
      // Kirim request ke Backend
      const res = await fetch(`http://localhost:3001/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        alert(`✅ Status Order #${orderId} berhasil diubah ke ${newStatus}`);
      } else {
        throw new Error("Gagal update di backend");
      }
    } catch (error) {
      alert("❌ Gagal mengubah status! Cek koneksi backend.");
      setOrders(oldOrders); // Balikin tampilan kalau gagal
    }
  };

  // Helper: Format Rupiah
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  // Helper: Warna Badge Status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Fungsi untuk membuka detail customer
  const openCustomerDetail = (customer: any) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manajemen Pesanan</h1>
            <p className="text-gray-500">Pantau dan kelola pesanan masuk</p>
          </div>
          <Link 
            href="/admin" 
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition shadow-sm"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>

        {/* Tabel */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-lg font-bold text-gray-400 animate-pulse">Memuat data pesanan...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-16 rounded-xl shadow-sm text-center border border-dashed border-gray-300">
            <h3 className="text-xl font-bold text-gray-400">Belum ada pesanan masuk</h3>
            <p className="text-gray-400 mt-2">Data pesanan akan muncul di sini setelah ada pelanggan checkout.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 font-bold text-xs uppercase text-gray-500 tracking-wider">ID</th>
                    <th className="p-4 font-bold text-xs uppercase text-gray-500 tracking-wider">Pelanggan</th>
                    <th className="p-4 font-bold text-xs uppercase text-gray-500 tracking-wider">Total</th>
                    <th className="p-4 font-bold text-xs uppercase text-gray-500 tracking-wider">Metode Bayar</th>
                    <th className="p-4 font-bold text-xs uppercase text-gray-500 tracking-wider">Detail Pesanan</th>
                    <th className="p-4 font-bold text-xs uppercase text-gray-500 tracking-wider">Status (Aksi)</th>
                    <th className="p-4 font-bold text-xs uppercase text-gray-500 tracking-wider">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-mono text-gray-500">#{order.id}</td>
                      
                      <td className="p-4">
                        <div className="font-bold text-gray-800 cursor-pointer hover:text-blue-600" onClick={() => openCustomerDetail(order.customer)}>
                          {order.customerName || "Tanpa Nama"}
                        </div>
                        <div className="text-xs text-gray-500">{order.email || "Tidak ada email"}</div>
                        <div className="text-xs text-gray-500">{order.phone || "Tidak ada phone"}</div>
                        <div className="text-xs text-gray-400 mt-1 max-w-[200px] truncate" title={order.address}>
                          {order.address}
                        </div>
                      </td>

                      <td className="p-4 font-bold text-[#E85D04]">
                        {formatRupiah(order.totalPrice)}
                      </td>

                      <td className="p-4 text-sm text-gray-600">
                        {order.paymentMethod || "MANUAL"}
                      </td>

                      <td className="p-4 text-sm text-gray-600">
                        {order.items && order.items.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {order.items.map((item: any, idx: number) => (
                              <li key={idx}>
                                {item.product?.name || "Produk Tidak Ditemukan"} (x{item.quantity}) - {formatRupiah(item.price)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400">Tidak ada item</span>
                        )}
                      </td>

                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer transition shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 ${getStatusColor(order.status)}`}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt} className="bg-white text-gray-800">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-4 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail Customer */}
      {isCustomerModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Detail Pelanggan</h2>
            <div className="space-y-2">
              <p><strong>Nama:</strong> {selectedCustomer.name || "Tidak ada"}</p>
              <p><strong>Email:</strong> {selectedCustomer.email || "Tidak ada"}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phone || "Tidak ada"}</p>
              <p><strong>Alamat:</strong> {selectedCustomer.address || "Tidak ada"}</p>
              <p><strong>Dibuat:</strong> {new Date(selectedCustomer.createdAt).toLocaleDateString("id-ID")}</p>
            </div>
            <button 
              onClick={() => setIsCustomerModalOpen(false)} 
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
}