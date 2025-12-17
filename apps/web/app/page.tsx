import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Phone } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
  description?: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("http://localhost:3001/products", {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("Failed to fetch products:", res.statusText);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-[#FDF3E7] font-sans text-gray-900">
      {/* Navbar */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="font-serif font-bold text-3xl tracking-wide">
          NightStalkers
        </Link>

        <div className="hidden md:flex items-center space-x-8 font-medium">
          <Link href="/" className="hover:text-[#E85D04] transition-colors">
            Beranda
          </Link>
          <Link href="/about" className="hover:text-[#E85D04] transition-colors">
            Tentang
          </Link>
          <Link href="/products" className="hover:text-[#E85D04] transition-colors">
            Produk
          </Link>
          <Link href="/contact" className="hover:text-[#E85D04] transition-colors">
            Kontak
          </Link>
        </div>

        <div className="flex items-center space-x-4">
           {/* Icons matching the reference image vaguely, though not strictly requested by text, nice to have */}
          <button className="hidden sm:block p-2 hover:text-[#E85D04]">
             <ShoppingCart className="w-6 h-6" />
          </button>

          <Link
            href="/webtoon"
            className="hidden md:block bg-[#E85D04] text-white px-6 py-2 rounded-full font-medium hover:bg-[#d55203] transition-colors"
          >
            Baca di Webtoon
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=2400"
          alt="Dark Library"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-[#FDF3E7]">
           {/* Star Rating decoration - matching image vibe */}
           <div className="mb-4 text-[#E85D04] flex gap-1">
             {[...Array(5)].map((_, i) => (
                <span key={i} className="text-xl">★</span>
             ))}
           </div>

          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 tracking-wider uppercase">
            NIGHT STALKERS NOVEL & KOMIK
          </h1>
          <p className="text-lg md:text-2xl font-light italic opacity-90 mb-8 max-w-2xl">
            "Mengungkap kegelapan di balik bayangan..."
          </p>

          <div className="flex gap-4">
             <Link href="/contact" className="border border-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all">
                Kontak kami
             </Link>
             <Link href="/webtoon" className="text-white hover:text-[#E85D04] flex items-center gap-2 px-4 py-3">
                Webtoon kami →
             </Link>
          </div>
        </div>
      </section>

      {/* Sub-headline Section - To match image layout where text is below hero */}
      <section className="py-16 text-center container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Mengungkap kegelapan di balik bayangan, kisah-kisah yang tak akan membiarkan Anda tidur.
          </h2>
      </section>

      {/* Product Grid */}
      <section className="container mx-auto px-4 pb-20">
        <h3 className="font-serif text-2xl font-bold mb-8 border-b-2 border-[#E85D04] inline-block pb-2">
            Koleksi Terbaru
        </h3>

        {products.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Belum ada produk yang tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                <div className="relative aspect-[2/3] w-full bg-gray-200">
                  <Image
                    src={product.image || "https://placehold.co/400x600/png?text=Cover"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Quick Action Overlay */}
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-[#E85D04] text-white px-4 py-2 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        Lihat Detail
                      </button>
                   </div>
                </div>

                <div className="p-4">
                  <h4 className="font-serif font-bold text-lg mb-2 truncate">
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center">
                     <p className="text-[#E85D04] font-bold text-lg">
                        {formatRupiah(product.price)}
                     </p>
                     <button className="text-gray-400 hover:text-[#E85D04]">
                        <ShoppingCart className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
