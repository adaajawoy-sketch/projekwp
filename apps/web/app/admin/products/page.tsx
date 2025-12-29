"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [editPreviewImage, setEditPreviewImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // 1. Ambil Data Produk saat halaman dibuka
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Gagal ambil produk:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fungsi Hapus Produk
  const handleDelete = async (id: number) => {
    if (confirm("Yakin mau hapus produk ini?")) {
      try {
        const res = await fetch(`http://localhost:3001/products/${id}`, {
          method: "DELETE",
        });
        
        if (res.ok) {
          alert("Produk dihapus!");
          fetchProducts(); // Refresh data tanpa reload page
        } else {
          alert("Gagal menghapus (Mungkin fitur delete belum ada di backend?)");
        }
      } catch (err) {
        alert("Error koneksi");
      }
    }
  };

  // Helper Format Rupiah
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Daftar Produk</h1>
            <p className="text-gray-500">Kelola katalog novel & komikmu</p>
          </div>
          <div className="flex gap-3">
             <Link 
              href="/admin" 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition"
            >
              Kembali ke Dashboard
            </Link>
            <Link 
              href="/admin/products/create" 
              className="px-4 py-2 bg-[#E85D04] text-white rounded-lg font-bold hover:bg-[#c04d03] transition shadow-lg"
            >
              + Tambah Produk
            </Link>
          </div>
        </div>

        {/* Tabel Produk */}
        {isLoading ? (
          <p className="text-center py-10">Memuat data...</p>
        ) : products.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <p className="text-gray-500 mb-4">Belum ada produk.</p>
            <Link href="/admin/products/create" className="text-[#E85D04] font-bold underline">
              Buat produk pertama sekarang!
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-bold text-gray-600">Gambar</th>
                  <th className="p-4 font-bold text-gray-600">Nama Produk</th>
                  <th className="p-4 font-bold text-gray-600">Harga</th>
                  <th className="p-4 font-bold text-gray-600 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4">
                      {/* Tampilkan Gambar (Base64 atau URL) */}
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-16 h-24 object-cover rounded shadow-sm border"
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-lg text-gray-800">{product.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                        {product.description}
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-[#E85D04]">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link 
                          href={`/admin/products/edit/${product.id}`}
                          className="text-blue-500 hover:text-blue-700 font-bold text-sm bg-blue-50 px-3 py-1 rounded hover:bg-blue-100 transition"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1 rounded hover:bg-red-100 transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}