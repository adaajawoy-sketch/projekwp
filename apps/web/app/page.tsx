import Image from "next/image";

// Tipe data untuk Produk
type Product = {
  id: number;
  name: string;
  description: string;
  price: number; // Mengasumsikan harga berupa angka dari backend
  image?: string;
};

// Fungsi untuk mengambil data produk dari Backend
async function getProducts(): Promise<Product[] | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  
  try {
    const res = await fetch(`${apiUrl}/products`, { 
      cache: "no-store", // Pastikan data selalu fresh
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return null; // Return null to indicate error state
  }
}

// Helper untuk format Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default async function Home() {
  const products = await getProducts();

  // Navbar Component
  const Navbar = () => (
    <nav className="w-full bg-white shadow-md py-4 px-6 mb-8">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold tracking-wider text-slate-800">
          LUMINA SPACES
        </h1>
      </div>
    </nav>
  );

  // Jika Backend Error / Tidak ada data
  if (products === null) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">
            Maaf, server sedang sibuk
          </h2>
          <p className="text-slate-500">
            Kami sedang berusaha memperbaikinya. Silakan coba lagi nanti.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6">
        {/* Grid System: Mobile 1, Tablet 2, Desktop 3/4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              {/* Product Image */}
              <div className="relative h-48 w-full bg-gray-200">
                <Image
                  src={product.image || "https://placehold.co/600x400"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Card Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">
                  {product.name}
                </h3>
                
                <p className="text-xl font-semibold text-indigo-600 mb-3">
                  {formatRupiah(product.price)}
                </p>

                <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                  {product.description}
                </p>

                {/* Button */}
                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 mt-auto">
                  Beli Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State jika array kosong tapi tidak error */}
        {products.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            Belum ada produk yang tersedia.
          </div>
        )}
      </div>
    </main>
  );
}
