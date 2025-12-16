import Image from "next/image";
import { ShoppingCart } from "lucide-react";

// Tipe data untuk Produk
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
};

// Fungsi untuk mengambil data produk dari Backend
async function getProducts(): Promise<Product[] | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  try {
    const res = await fetch(`${apiUrl}/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
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

  // --- Components ---

  const Navbar = () => (
    <nav className="w-full bg-[#FDF3E7] shadow-sm py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-wide">
            NightStalkers
          </h1>
          <span className="text-[10px] tracking-[0.2em] text-slate-600 font-sans mt-[-2px]">
            HORROR | THRILLER
          </span>
        </div>

        {/* Menu Tengah (Hidden on Mobile, Visible on md+) */}
        <div className="hidden md:flex items-center gap-8 font-serif text-slate-800">
          <a href="#" className="hover:text-[#D95D1F] transition-colors">Beranda</a>
          <a href="#" className="hover:text-[#D95D1F] transition-colors">Tentang</a>
          <a href="#" className="hover:text-[#D95D1F] transition-colors">Produk</a>
          <a href="#" className="hover:text-[#D95D1F] transition-colors">Kontak Kami</a>
        </div>

        {/* Kanan */}
        <div className="flex items-center gap-4">
          <button className="text-slate-800 hover:text-[#D95D1F] transition-colors relative">
            <ShoppingCart size={24} />
            {/* Optional badge placeholder */}
             {/* <span className="absolute -top-1 -right-1 bg-[#D95D1F] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">2</span> */}
          </button>
          <button className="bg-[#D95D1F] hover:bg-[#bf4e18] text-white font-serif px-5 py-2 rounded-full text-sm transition-colors shadow-md">
            Baca di Webtoon
          </button>
        </div>
      </div>
    </nav>
  );

  const Hero = () => (
    <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop"
          alt="Library Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-wider leading-tight">
          NIGHT STALKERS <br /> NOVEL & KOMIK
        </h2>
        <p className="text-lg md:text-xl font-light italic text-gray-200 mb-8 font-serif">
          "Mengungkap kegelapan di balik bayangan..."
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="border-2 border-white hover:bg-white hover:text-black text-white px-8 py-3 rounded-md font-serif transition-all duration-300 tracking-wide uppercase text-sm">
            Kontak kami
          </button>
          <button className="text-white hover:text-[#D95D1F] font-serif underline underline-offset-4 transition-colors">
            Webtoon kami &rarr;
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <main className="min-h-screen bg-[#FDF3E7] font-sans">
      <Navbar />
      <Hero />

      {/* Product Section */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="flex items-center justify-center mb-12">
           <h3 className="text-3xl font-serif font-bold text-slate-900 border-b-4 border-[#D95D1F] pb-2">
             Koleksi Terbaru
           </h3>
        </div>

        {/* Error State */}
        {products === null ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif text-slate-800 mb-2">
              Maaf, server sedang sibuk
            </h2>
            <p className="text-slate-500">
              Kami sedang berusaha memperbaikinya. Silakan coba lagi nanti.
            </p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group border border-stone-100"
              >
                {/* Product Image */}
                <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                  <Image
                    src={product.image || "https://placehold.co/600x400"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay Badge (Optional) */}
                  <div className="absolute top-0 right-0 bg-[#D95D1F] text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
                     NEW
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-[#D95D1F] transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1 font-serif leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-lg font-bold text-[#D95D1F]">
                      {formatRupiah(product.price)}
                    </p>
                    <button className="text-slate-400 hover:text-[#D95D1F] transition-colors">
                       <ShoppingCart size={20} />
                    </button>
                  </div>

                   {/* Full Width Button */}
                   <button className="w-full mt-4 bg-slate-900 hover:bg-[#D95D1F] text-white font-medium py-2 px-4 rounded transition-colors duration-300 text-sm tracking-wide">
                      Beli Sekarang
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {products !== null && products.length === 0 && (
          <div className="text-center py-20 text-slate-500 font-serif italic">
            Belum ada misteri yang terungkap saat ini...
          </div>
        )}
      </section>

      {/* Simple Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm font-serif">
         &copy; {new Date().getFullYear()} NightStalkers. All mystery reserved.
      </footer>
    </main>
  );
}
