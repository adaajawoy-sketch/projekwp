"use client"; // WAJIB ADA DI BARIS PERTAMA AGAR TOMBOL BISA DIKLIK

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// --- TIPE DATA ---
interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
  description?: string;
}

// --- HELPER FORMAT RUPIAH ---
const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export default function Home() {
  // --- STATE (PENYIMPANAN DATA SEMENTARA DI BROWSER) ---
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "success">("cart");
  const [isLoading, setIsLoading] = useState(true);

  // --- AMBIL DATA DARI BACKEND SAAT WEBSITE DIBUKA ---
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Gagal mengambil produk:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // --- FUNGSI KERANJANG ---
  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (indexToRemove: number) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep("success");
    setCart([]); // Kosongkan keranjang setelah sukses
  };

  return (
    <div className="min-h-screen bg-[#FDF3E7] font-sans text-gray-900 flex flex-col relative">
      
      {/* --- NAVBAR --- */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between border-b border-[#E85D04]/20 sticky top-0 bg-[#FDF3E7]/90 backdrop-blur-sm z-40">
        <Link href="/" className="font-serif font-bold text-3xl tracking-wide text-[#2A2A2A]">
          NightStalkers
          <span className="block text-[10px] tracking-[0.3em] text-[#E85D04] uppercase font-sans mt-1">
            Horror | Thriller
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 font-medium text-[#2A2A2A]">
          <Link href="/" className="hover:text-[#E85D04] transition-colors">Beranda</Link>
          <Link href="/about" className="hover:text-[#E85D04] transition-colors">Tentang</Link>
          <Link href="/products" className="hover:text-[#E85D04] transition-colors">Produk</Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* TOMBOL KERANJANG (CART) */}
          <button 
            onClick={() => { setIsCartOpen(true); setCheckoutStep("cart"); }}
            className="relative p-2 hover:text-[#E85D04] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E85D04] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                {cart.length}
              </span>
            )}
          </button>
          
          <Link href="/webtoon" className="hidden md:block bg-[#E85D04] text-white px-6 py-2 rounded-full font-bold hover:bg-[#d55203] transition-colors shadow-lg">
            Baca di Webtoon
          </Link>
        </div>
      </nav>

      {/* --- MODAL / POPUP KERANJANG & CHECKOUT --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h3 className="font-serif text-2xl font-bold text-[#2A2A2A]">
                {checkoutStep === "cart" && "Keranjang Belanja"}
                {checkoutStep === "form" && "Informasi Pengiriman"}
                {checkoutStep === "success" && "Pembelian Berhasil"}
              </h3>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {/* --- LANGKAH 1: LIST KERANJANG --- */}
              {checkoutStep === "cart" && (
                <div>
                  {cart.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">Keranjangmu masih kosong nih.</p>
                      <button onClick={() => setIsCartOpen(false)} className="text-[#E85D04] font-bold hover:underline">Belanja Dulu Yuk →</button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6">
                        {cart.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden relative flex-shrink-0">
                                 <Image src={item.image || "https://placehold.co/100x100"} alt={item.name} fill className="object-cover"/>
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-[#2A2A2A] line-clamp-1">{item.name}</h4>
                                <p className="text-[#E85D04] text-xs font-bold">{formatRupiah(item.price)}</p>
                              </div>
                            </div>
                            <button onClick={() => removeFromCart(idx)} className="text-red-400 hover:text-red-600 p-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 pt-4 mb-6">
                        <div className="flex justify-between items-center text-lg font-bold text-[#2A2A2A]">
                          <span>Total</span>
                          <span>{formatRupiah(totalPrice)}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setCheckoutStep("form")}
                        className="w-full bg-[#E85D04] text-white py-3 rounded-xl font-bold hover:bg-[#c04d03] transition-colors shadow-lg"
                      >
                        Checkout Sekarang
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* --- LANGKAH 2: FORM PENGIRIMAN --- */}
              {checkoutStep === "form" && (
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:border-[#E85D04] focus:ring-[#E85D04] outline-none" placeholder="Masukkan nama Anda"/>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Alamat Pengiriman</label>
                    <textarea required className="w-full border border-gray-300 rounded-lg p-3 focus:border-[#E85D04] focus:ring-[#E85D04] outline-none" rows={3} placeholder="Jalan, No Rumah, Kota..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Metode Pembayaran</label>
                    <select className="w-full border border-gray-300 rounded-lg p-3 outline-none">
                      <option>Transfer Bank (BCA)</option>
                      <option>QRIS / GoPay / OVO</option>
                      <option>COD (Bayar di Tempat)</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setCheckoutStep("cart")} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50">
                      Kembali
                    </button>
                    <button type="submit" className="flex-1 bg-[#2A2A2A] text-white py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg">
                      Bayar {formatRupiah(totalPrice)}
                    </button>
                  </div>
                </form>
              )}

              {/* --- LANGKAH 3: SUKSES --- */}
              {checkoutStep === "success" && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#2A2A2A] mb-2">Terima Kasih!</h4>
                  <p className="text-gray-600 mb-8">Pesanan Anda telah berhasil dibuat. Kami akan segera memproses pengiriman ke alamat Anda.</p>
                  <button onClick={() => setIsCartOpen(false)} className="bg-[#E85D04] text-white px-8 py-3 rounded-full font-bold hover:bg-[#c04d03] transition-colors shadow-md">
                    Tutup & Belanja Lagi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-black">
            <Image
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=2400"
            alt="Dark Library"
            fill
            className="object-cover opacity-60"
            priority
            />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-[#FDF3E7]">
           <div className="mb-4 text-[#E85D04] flex gap-1 animate-pulse">
             {[...Array(5)].map((_, i) => <span key={i} className="text-xl">★</span>)}
           </div>
           
          <h1 className="font-serif text-4xl md:text-7xl font-bold mb-6 tracking-wider shadow-black drop-shadow-md">
            NIGHT STALKERS <br/> NOVEL & KOMIK
          </h1>
          <p className="text-lg md:text-2xl font-light italic opacity-90 mb-10 max-w-2xl text-gray-200">
            "Hubungan persahabatan yang perlahan menghilang dengan cerita horor dan thriller yang mendebarkan..."
          </p>
          
          <div className="flex gap-4">
             <Link href="/contact" className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-all">Kontak kami</Link>
             <Link href="/webtoon" className="text-[#E85D04] hover:text-white font-bold flex items-center gap-2 px-4 py-3 transition-colors">Webtoon kami →</Link>
          </div>
        </div>
      </section>

      {/* --- FITUR --- */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#2A2A2A] mb-4 leading-tight">Mengungkap kegelapan di balik bayangan...</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {[
            {icon: "M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 11 3.8 11 8c0 2.85-1.67 5.14-4 5.92V16h-3z", title: "Jejak Misteri", desc: "Selami misteri tak terpecahkan."},
            {icon: "M22 12h-4l-3 9L9 3l-3 9H2", title: "Ketegangan", desc: "Teror psikologis hingga aksi."},
            {icon: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z", title: "Visual Mencekam", desc: "Kualitas gambar tajam & seram."},
            {icon: "M12 2v20M2 12h20", title: "Rilis Terjamin", desc: "Update rutin jangan tertinggal."}
          ].map((item, i) => (
             <div key={i} className="flex flex-col gap-4 p-4 hover:bg-white/50 rounded-xl transition-colors group">
                <div className="w-14 h-14 bg-[#E85D04]/10 rounded-2xl flex items-center justify-center text-[#E85D04] group-hover:bg-[#E85D04] group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
                </div>
                <h4 className="text-xl font-serif font-bold text-[#2A2A2A]">{item.title}</h4>
                <p className="text-sm text-gray-700">{item.desc}</p>
             </div>
          ))}
        </div>
      </section>

      {/* --- SINOPSIS SECTION (DIKEMBALIKAN) --- */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#E85D04]/10">
        <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-[#2A2A2A] uppercase tracking-wide">
                    Sinopsis NightStalkers
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8 text-justify">
                    Ketika murid SMA di sebuah sekolah terpencil bernama Anita mendadak meninggal misterius, 
                    Askara dan teman-temannya mendapati serangkaian kejadian aneh mulai menghantui mereka. 
                    Mulai dari penampakan, mimpi-mimpi ganjil, hingga munculnya bunga mawar putih di jendela Askara. 
                    Saat sahabat mereka, Ifal, juga jatuh sakit dengan gejala serupa, mereka mencium kehadiran sosok 
                    misterius yang menghubungkan semua kejadian itu. Dihantui rasa takut, mereka menyelidiki 
                    kebenaran di balik kematian Anita.
                </p>
                
                <Link href="/webtoon" className="inline-flex items-center gap-2 text-[#b04602] font-semibold border-b border-[#b04602] pb-1 hover:text-[#E85D04] hover:border-[#E85D04] transition-all">
                    baca di webtoon 
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
            </div>
        </div>
      </section>

      {/* --- PRODUK TERLARIS --- */}
      <section className="container mx-auto px-6 pb-20 mt-10">
        <h3 className="font-serif text-4xl font-normal text-center mb-12 text-[#2A2A2A]">
            Produk terlaris
        </h3>
        {isLoading ? (
           <p className="text-center text-gray-500">Memuat produk...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">Belum ada produk.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col items-center group bg-white p-4 rounded-xl shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-[#E85D04]/20">
                <div className="relative aspect-square w-full max-w-[280px] bg-gray-100 mb-4 shadow-md rounded-lg overflow-hidden">
                  <Image
                    src={product.image || "https://placehold.co/400x400/png?text=Cover+Buku"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-0 right-0 bg-[#A0522D] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider z-10">Obral</span>
                </div>
                <h4 className="font-sans text-lg font-medium text-[#3498db] text-center mb-2 hover:underline cursor-pointer line-clamp-1">{product.name}</h4>
                <div className="flex items-center gap-2 mb-4 font-serif">
                   <span className="text-gray-400 text-sm line-through decoration-gray-400">{formatRupiah(product.price * 1.2)}</span>
                   <span className="text-[#2A2A2A] text-lg font-bold">{formatRupiah(product.price)}</span>
                </div>

                {/* TOMBOL ADD TO CART */}
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-[#A0522D] hover:bg-[#8B4513] active:scale-95 text-white px-6 py-3 text-sm font-medium transition-all w-full max-w-[280px] text-center rounded-lg flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  Tambah ke Keranjang
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- TESTIMONI SECTION (DIKEMBALIKAN) --- */}
      <section className="py-20 px-6 md:px-12 bg-[#FDF3E7] border-t border-[#E85D04]/10">
        <div className="max-w-6xl mx-auto">
          <h3 className="font-serif text-4xl text-center mb-16 text-[#2A2A2A]">
            Apa yang orang bilang
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Testimoni 1 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image src="https://placehold.co/150x150/png?text=A" alt="Allicia" fill className="rounded-full object-cover border-4 border-white shadow-md"/>
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-serif font-bold text-lg text-[#2A2A2A] tracking-wider mb-2">ALLICIA</h4>
                <p className="text-gray-700 italic mb-4 leading-relaxed">
                  “Kualitas gambarnya sangat menjajikan, banyak sekali detail yang unik yang bikin kagum sampai terheran-heran hahaha, Rekomended banget deh apalagi yang komik.”
                </p>
                <div className="flex justify-center sm:justify-start gap-1 text-[#E85D04]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-90"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
              </div>
            </div>
            {/* Testimoni 2 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image src="https://placehold.co/150x150/png?text=R" alt="Raul" fill className="rounded-full object-cover border-4 border-white shadow-md"/>
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-serif font-bold text-lg text-[#2A2A2A] tracking-wider mb-2">RAUL</h4>
                <p className="text-gray-700 italic mb-4 leading-relaxed">
                  “Saat ini kebanganku itu Novel Night Stalkers sih, seru banget apalagi ditengah-tengah chapter aku sampai kesenengan berbagi cerita sama temen temenku”
                </p>
                <div className="flex justify-center sm:justify-start gap-1 text-[#E85D04]">
                  {[...Array(5)].map((_, i) => (
                     <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-90"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DISKUSI & KOMENTAR (DIKEMBALIKAN) --- */}
      <section className="pb-24 px-6 md:px-12 bg-[#FDF3E7]">
        <div className="max-w-4xl mx-auto border-t border-[#E85D04]/20 pt-12">
            <h3 className="font-serif text-3xl text-[#2A2A2A] mb-12">
                12 tanggapan untuk “Apa yang orang bilang?”
            </h3>
            <div className="space-y-10 mb-16">
                <div className="flex gap-5">
                    <div className="flex-shrink-0"><div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">K</div></div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1"><span className="font-bold text-gray-900">Kai</span></div>
                        <div className="text-xs text-gray-500 mb-3 underline decoration-gray-400">December 13, 2025</div>
                        <p className="text-gray-700 text-sm mb-2">Salah satu novel horor favorit gw, semoga komiknya cepat rilis</p>
                        <button className="text-xs text-gray-600 underline hover:text-[#E85D04]">Balas</button>
                    </div>
                </div>
                {/* More comments could be here */}
            </div>
            
            <div className="mt-16">
                <h4 className="font-serif text-2xl text-[#2A2A2A] mb-2">Tinggalkan Balasan</h4>
                <p className="text-xs text-gray-500 mb-8">Alamat email Anda tidak akan dipublikasikan. Ruas yang wajib ditandai <span className="text-red-500">*</span></p>
                <form className="space-y-6">
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Komentar</label><textarea rows={4} className="w-full bg-white border border-gray-300 p-3"></textarea></div>
                    <button type="button" className="bg-[#A0522D] text-white px-8 py-3 text-sm font-bold hover:bg-[#8B4513] transition-colors shadow-sm">Kirim Komentar</button>
                </form>
            </div>
        </div>
      </section>

      {/* --- FOOTER DETAIL (DIKEMBALIKAN) --- */}
      <footer className="bg-[#1e110b] text-[#d4c5b5] pt-16 pb-8 px-6 mt-auto">
         <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center md:text-left">
               {/* Link Cepat */}
               <div className="flex flex-col gap-4">
                  <h5 className="font-serif text-[#E85D04] text-lg font-bold tracking-wider mb-2">LINK CEPAT</h5>
                  <Link href="/" className="hover:text-[#E85D04] transition-colors">Beranda</Link>
                  <Link href="/about" className="hover:text-[#E85D04] transition-colors">Tentang</Link>
                  <Link href="/products" className="hover:text-[#E85D04] transition-colors">Produk</Link>
               </div>

               {/* Center Logo */}
               <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 mb-6 rounded-full overflow-hidden border-4 border-[#E85D04] shadow-2xl shadow-[#E85D04]/30">
                     <Image 
                       src={products[0]?.image || "https://placehold.co/400x400/png?text=NS"} 
                       alt="Night Stalkers Logo" 
                       fill 
                       className="object-cover"
                     />
                  </div>
                  <h4 className="font-serif text-2xl text-white font-bold tracking-widest mb-1">NIGHTSTALKERS</h4>
                  <p className="text-xs tracking-[0.5em] text-[#E85D04] uppercase mb-8">Studio</p>
               </div>

               {/* Social Media & Contact */}
               <div className="flex flex-col gap-6 md:items-end">
                  <h5 className="font-serif text-[#E85D04] text-lg font-bold tracking-wider mb-2">SOCIAL MEDIA</h5>
                  <div className="flex gap-5 justify-center md:justify-end">
                     <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-[#E85D04] hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                     <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-[#E85D04] hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg></a>
                  </div>
                  <div className="mt-6 flex flex-col gap-3 md:items-end text-sm text-gray-400">
                      <p>NightStalkers Studio</p>
                      <p>08xxxxxxxxx</p>
                  </div>
               </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-center items-center text-xs text-gray-600 gap-8">
               <p className="order-first md:order-none">&copy; 2025 NightStalkers Studio. All rights reserved.</p>
            </div>
         </div>
      </footer>
    </div>
  );
}