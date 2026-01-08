"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
// Import Copilot (walaupun fiturnya kita hapus, filenya biarkan saja kalau mau dipakai nanti)
// import Copilot from "./components/Copilot"; <--- SAYA COMMENT, JADI GAK DIPAKAI

// --- TIPE DATA ---
interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
  description?: string;
}

interface Comment {
  id: number;
  user: string;
  createdAt: string;
  text: string;
}

interface Customer {
  id: number;
  email: string;
  name: string;
}

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  
  // State Komentar
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentForm, setCommentForm] = useState({ name: "", text: "" });
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Constants
  const WEBTOON_URL = "https://www.webtoons.com/id/canvas/night-stalkers/list?title_no=1089184";
  const CONTACT_URL = "https://www.instagram.com/night.stalkers_official/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D#";

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("id-ID", {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false); 
    }
  };

  // --- FETCH DATA ---
  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, commRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/products`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/comments`)
        ]);
        if (prodRes.ok) setProducts(await prodRes.json());
        if (commRes.ok) setComments(await commRes.json());
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();

    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("nightstalkers-cart");
      const savedUser = localStorage.getItem("nightstalkers-user");
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedUser) setCustomer(JSON.parse(savedUser));
      setIsInitialized(true);
    }
  }, []);

  // Sync Cart to LocalStorage
  useEffect(() => {
    if (isInitialized) localStorage.setItem("nightstalkers-cart", JSON.stringify(cart));
  }, [cart, isInitialized]);

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
    alert("Produk ditambahkan ke keranjang!");
  };

  const handleLogoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem("nightstalkers-user");
    alert("Logout berhasil.");
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.name || !commentForm.text) { alert("Harap isi semua!"); return; }
    setIsPostingComment(true);
    try {
      const res = await fetch(`http://localhost:3001/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: commentForm.name, text: commentForm.text })
      });
      if (res.ok) {
        const newComments = await (await fetch(`http://localhost:3001/comments`)).json();
        setComments(newComments);
        setCommentForm({ name: "", text: "" }); 
      }
    } catch { alert("Gagal kirim komentar."); } 
    finally { setIsPostingComment(false); }
  };

  const navItems = [
    { label: "Beranda", id: "home", isScroll: true },
    { label: "Tentang", id: "about", isScroll: true },
    { label: "Produk", id: "products", isScroll: true },
    { label: "Kontak", link: CONTACT_URL, isScroll: false },
  ];

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-gray-200 selection:bg-orange-500 selection:text-white">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <button onClick={() => scrollToSection("home")} className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 shadow-lg shadow-orange-900/20 group-hover:border-orange-600 transition-all duration-300">
               <Image src="/logo.jpg" alt="NS Logo" fill className="object-cover" />
            </div>
            <div className="hidden sm:block text-left">
              <h1 className="font-serif font-bold text-xl text-white tracking-wide group-hover:text-orange-500 transition-colors">NightStalkers</h1>
              <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">Horror Studio</p>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            {navItems.map((item) => (
              item.isScroll ? 
                <button key={item.label} onClick={() => scrollToSection(item.id!)} className="hover:text-orange-500 transition-colors">{item.label}</button> :
                <Link key={item.label} href={item.link!} target="_blank" className="hover:text-orange-500 transition-colors">{item.label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {customer && (
              <div className="hidden md:flex items-center gap-3 text-xs">
                <span className="text-orange-500 font-bold">Hi, {customer.name}</span>
                <button onClick={handleLogoutCustomer} className="text-gray-500 hover:text-white underline">Logout</button>
              </div>
            )}
            
            {/* KERANJANG SEKARANG PINDAH HALAMAN (LINK) */}
            <Link href="/checkout" className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {isInitialized && cart.length > 0 && <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">{cart.length}</span>}
            </Link>

            <Link href={WEBTOON_URL} target="_blank" className="hidden md:block bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-orange-500 hover:text-white transition-all">Baca Webtoon</Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-400 p-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
          </div>
        </div>
        
        {isMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 w-full bg-[#0a0a0a] border-b border-white/10 p-6 space-y-4 animate-in slide-in-from-top-5 shadow-2xl">
                 {navItems.map((item) => (
                    item.isScroll ? 
                      <button key={item.label} onClick={() => scrollToSection(item.id!)} className="block w-full text-left text-lg font-bold text-gray-400 hover:text-orange-500 hover:pl-2 transition-all">{item.label}</button> :
                      <Link key={item.label} href={item.link!} target="_blank" className="block text-lg font-bold text-gray-400 hover:text-orange-500 hover:pl-2 transition-all">{item.label}</Link>
                 ))}
                 {customer && <button onClick={handleLogoutCustomer} className="block text-lg font-bold text-red-500 hover:pl-2 transition-all">Logout ({customer.name})</button>}
                 <div className="pt-4 border-t border-white/10">
                   <Link href={WEBTOON_URL} target="_blank" className="block w-full text-center bg-white text-black px-5 py-3 rounded-lg font-bold hover:bg-orange-500 hover:text-white transition-all">Baca Webtoon</Link>
                 </div>
            </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=2400" alt="Hero" fill className="object-cover opacity-40" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <span className="inline-block py-1 px-3 border border-orange-500/30 rounded-full text-orange-500 text-[10px] md:text-xs font-bold tracking-widest mb-6 uppercase">Official Studio Site</span>
          <h1 className="font-serif text-5xl md:text-8xl font-bold text-white mb-6">NIGHT<br/><span className="text-orange-600">STALKERS.</span></h1>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">"Saat persahabatan memudar, teror mulai mengambil alih."</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <Link href={WEBTOON_URL} target="_blank" className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-700 transition-all text-sm md:text-base">Mulai Membaca</Link>
            <button onClick={() => scrollToSection("products")} className="px-8 py-4 rounded-full font-bold border border-white/20 text-white hover:bg-white hover:text-black transition-all text-sm md:text-base">Lihat Koleksi</button>
          </div>
        </div>
      </section>

      {/* --- SINOPSIS --- */}
      <section id="about" className="py-16 md:py-24 px-6 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl"><iframe className="w-full h-full" src="https://www.youtube.com/embed/TsbIOpqxd0E" title="Trailer" allowFullScreen></iframe></div>
          <div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6">Ketika Kegelapan <span className="text-orange-600">Berbicara</span></h2>
            <p className="text-gray-400 text-lg leading-relaxed">Kematian misterius <strong className="text-white">Anita</strong> memicu teror di sekolah terpencil.</p>
            <div className="mt-8"><Link href={WEBTOON_URL} target="_blank" className="text-orange-500 font-bold hover:text-white transition-colors flex items-center gap-2">Baca Webtoon Lengkap →</Link></div>
          </div>
        </div>
      </section>

      {/* --- PRODUCTS --- */}
      <section id="products" className="py-16 md:py-24 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-end mb-12"><h2 className="font-serif text-3xl md:text-4xl font-bold text-white">Merchandise</h2></div>
          {isLoading ? <p className="text-center text-gray-500">Memuat...</p> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((p) => (
                <div key={p.id} className="group bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all">
                  <div className="relative aspect-[2/3] bg-[#111]">
                    <Image src={p.image || "https://placehold.co/400x600"} alt={p.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <button onClick={() => addToCart(p)} className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full hover:bg-orange-600 hover:text-white transition-colors shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></button>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-white truncate">{p.name}</h3>
                    <p className="text-orange-500 font-mono">{formatRupiah(Number(p.price))}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- COMMENTS --- */}
      <section className="py-16 md:py-24 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-4xl">
          <h3 className="font-serif text-2xl font-bold text-white mb-10">Komentar</h3>
          <div className="space-y-8 mb-16">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-4 animate-in slide-in-from-bottom">
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 font-bold border border-white/5 flex-shrink-0">{c.user.charAt(0)}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1"><h4 className="font-bold text-white">{c.user}</h4><span className="text-xs text-gray-600">{formatDate(c.createdAt)}</span></div>
                  <p className="text-gray-400 text-sm">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleCommentSubmit} className="bg-[#111] p-8 rounded-2xl border border-white/5 space-y-4">
            <input type="text" placeholder="Nama" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none" value={commentForm.name} onChange={e => setCommentForm({...commentForm, name: e.target.value})} />
            <textarea rows={3} placeholder="Komentar..." className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none" value={commentForm.text} onChange={e => setCommentForm({...commentForm, text: e.target.value})}></textarea>
            <button type="submit" disabled={isPostingComment} className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-orange-500 hover:text-white transition-all">Kirim</button>
          </form>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 bg-[#050505] text-center border-t border-white/5">
        <div className="container mx-auto">
           <h2 className="font-serif text-2xl font-bold text-white mb-2">NIGHTSTALKERS</h2>
           <p className="text-gray-500 text-sm mb-8">&copy; 2025 NightStalkers Studio.</p>
           <div className="flex justify-center gap-6">
             <a href={CONTACT_URL} target="_blank" className="text-gray-400 hover:text-white">Instagram</a>
           </div>
        </div>
      </footer>

    </div>
  );
}