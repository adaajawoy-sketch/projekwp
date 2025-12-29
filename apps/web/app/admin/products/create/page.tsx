"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const router = useRouter();
  
  // State untuk form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "", // Kita pakai 'image' sesuai database, isinya nanti kode Base64 panjang
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Untuk menampilkan preview gambar

  // 1. Handle Text Input Biasa
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Handle FILE Input (Ubah Gambar Jadi Text Base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validasi ukuran (Maksimal 1MB biar database gak meledak)
      if (file.size > 1024 * 1024) {
        alert("Ukuran gambar terlalu besar! Maksimal 1MB.");
        e.target.value = ""; // Reset input
        return;
      }

      // Mulai konversi File -> Text
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String); // Tampilkan di layar
        setFormData((prev) => ({ ...prev, image: base64String })); // Simpan ke state form
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. Submit ke Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Pastikan harga jadi number
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image, // Ini sekarang isinya text panjang (data:image/jpeg;base64...)
      };

      const response = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan produk");
      }

      alert("Produk berhasil ditambahkan!");
      router.push("/admin/products");
    } catch (error) {
      alert("Error: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-sm mt-8 border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tambah Produk Baru</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Nama Produk */}
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">
            Nama Produk
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E85D04]"
            placeholder="Contoh: Kopi Susu"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1">
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E85D04]"
            placeholder="Jelaskan produkmu..."
          />
        </div>

        {/* Harga */}
        <div>
          <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-1">
            Harga (Rp)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E85D04]"
            placeholder="15000"
          />
        </div>

        {/* UPLOAD GAMBAR LOKAL */}
        <div>
          <label htmlFor="file" className="block text-sm font-bold text-gray-700 mb-1">
            Upload Gambar (Max 1MB)
          </label>
          <input
            type="file"
            id="file"
            accept="image/*" // Hanya menerima file gambar
            onChange={handleFileChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E85D04] file:text-white hover:file:bg-[#c04d03]"
          />
          
          {/* PREVIEW GAMBAR */}
          {previewImage && (
            <div className="mt-4 p-2 border border-gray-200 rounded-lg bg-gray-50 inline-block">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <img 
                src={previewImage} 
                alt="Preview" 
                className="h-40 w-auto object-contain rounded-md" 
              />
            </div>
          )}
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#E85D04] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#c04d03] disabled:opacity-50 shadow-md transition-colors flex-1"
          >
            {isLoading ? "Sedang Upload..." : "Simpan Produk"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>
        </div>

      </form>
    </div>
  );
}