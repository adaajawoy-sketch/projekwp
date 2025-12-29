"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- TIPE DATA ---
interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
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

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Product[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // STATUS STEP
  const [step, setStep] = useState<string>("review");

  // State Auth
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({ email: "", password: "", name: "" });

  // State Shipping
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "", 
  });

  // State Payment
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [virtualAccount, setVirtualAccount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // --- 1. LOAD DATA ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("nightstalkers-cart");
      const savedUser = localStorage.getItem("nightstalkers-user");
      
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setCustomer(userData);
        setFormData(prev => ({ ...prev, name: userData.name || "" }));
      }
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && cart.length === 0 && step !== "success") {
       // router.push("/"); // Uncomment jika ingin redirect otomatis
    }
  }, [cart, isInitialized, step, router]);

  const totalPrice = cart.reduce((total, item) => total + Number(item.price), 0);

  // --- ACTIONS ---
  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem("nightstalkers-cart", JSON.stringify(newCart));
  };

  // --- LOGIC AUTH ---
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = authMode === "login" ? "login" : "register";
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authForm),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setCustomer(data);
        localStorage.setItem("nightstalkers-user", JSON.stringify(data));
        setFormData(prev => ({ ...prev, name: data.name || "" }));
        setStep("shipping");
      }
    } catch { alert("Gagal koneksi ke server."); }
  };

  // --- LOGIC KIRIM DATA ORDER KE BACKEND ---
  const submitOrderToBackend = async () => {
    setIsProcessing(true);
    const finalAddress = `${formData.address} (WA: ${formData.phone}) - Email: ${customer?.email}`;
    const paymentMethodName = selectedBank || "Transfer Manual";

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          address: finalAddress, 
          paymentMethod: paymentMethodName,
          totalPrice: totalPrice,
          items: cart.map(item => ({ productId: item.id, quantity: 1, price: Number(item.price) }))
        }),
      });

      if (res.ok) {
        // Simulasi Loading
        setTimeout(() => {
          setStep("success");
          setCart([]);
          localStorage.removeItem("nightstalkers-cart");
          setIsProcessing(false);
        }, 2000);
      } else {
        alert("Gagal memproses pesanan.");
        setIsProcessing(false);
      }
    } catch { 
      alert("Terjadi kesalahan koneksi."); 
      setIsProcessing(false);
    } 
  };

  // Generate Nomor VA / Pesan COD
  const generateVA = (bank: string) => {
    if (bank.includes("COD")) {
        setVirtualAccount("BAYAR KE KURIR");
        return;
    }
    const prefix = bank === "BCA" ? "8800" : "9000";
    const random = Math.floor(10000000 + Math.random() * 90000000);
    setVirtualAccount(`${prefix}${random}`);
  };

  const handleSelectBank = (bankName: string) => {
    setSelectedBank(bankName);
    generateVA(bankName);
  };

  if (!isInitialized) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
          <Link href="/" className="text-2xl font-serif font-bold text-white tracking-wide">
            NIGHT<span className="text-orange-600">STALKERS.</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Secure Checkout</span>
          </div>
        </div>

        {/* STEP 5: SUCCESS PAGE */}
        {step === "success" ? (
          <div className="text-center py-20 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">
              {selectedBank?.includes("COD") ? "Pesanan Dikonfirmasi!" : "Pembayaran Berhasil!"}
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
               {selectedBank?.includes("COD") ? "Mohon siapkan uang tunai saat kurir tiba." : "Pesananmu sedang disiapkan oleh tim NightStalkers."}
            </p>
            <Link href="/" className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-all shadow-lg hover:shadow-orange-500/20">
              Kembali Belanja
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* KOLOM KIRI: FORM & PROSES */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* STATUS BAR */}
              <div className="flex items-center gap-2 md:gap-4 mb-8 text-xs md:text-sm font-bold text-gray-600 overflow-x-auto whitespace-nowrap pb-2">
                <span className={step === "review" ? "text-orange-500" : "text-white"}>1. Keranjang</span> <span className="text-gray-700">/</span>
                <span className={step === "auth" ? "text-orange-500" : step === "shipping" || step === "payment" ? "text-white" : ""}>2. Login</span> <span className="text-gray-700">/</span>
                <span className={step === "shipping" ? "text-orange-500" : step === "payment" ? "text-white" : ""}>3. Pengiriman</span> <span className="text-gray-700">/</span>
                <span className={step === "payment" ? "text-orange-500" : ""}>4. Pembayaran</span>
              </div>

              {/* STEP 1: REVIEW CART */}
              {step === "review" && (
                <div className="animate-in slide-in-from-left duration-300">
                  <h2 className="text-2xl font-bold text-white mb-6">Keranjang Belanja</h2>
                  <div className="space-y-4">
                    {cart.map((item, i) => (
                      <div key={i} className="flex gap-4 items-center bg-[#111] p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                        <div className="w-20 h-24 bg-black relative flex-shrink-0 rounded-lg overflow-hidden border border-white/5">
                          <Image src={item.image || "https://placehold.co/100"} alt="" fill className="object-cover"/>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-lg">{item.name}</h4>
                          <p className="text-gray-500 text-xs mb-2">Horror Collection</p>
                          <p className="text-orange-500 font-mono text-base">{formatRupiah(Number(item.price))}</p>
                        </div>
                        <button onClick={() => removeFromCart(i)} className="text-gray-600 hover:text-red-500 p-2 hover:bg-white/5 rounded-full transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button onClick={() => customer ? setStep("shipping") : setStep("auth")} className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-600/20">Lanjut Checkout &rarr;</button>
                  </div>
                </div>
              )}

              {/* STEP 2: AUTH */}
              {step === "auth" && (
                <div className="bg-[#111] p-8 rounded-2xl border border-white/10 animate-in slide-in-from-right duration-300">
                  <h2 className="text-2xl font-bold text-white mb-2">{authMode === 'login' ? 'Selamat Datang Kembali' : 'Bergabung Bersama Kami'}</h2>
                  <p className="text-gray-400 text-sm mb-8">Masuk untuk melanjutkan proses belanja dengan aman.</p>
                  
                  <form onSubmit={handleAuthSubmit} className="space-y-5 max-w-md">
                    {authMode === "register" && (
                      <div><label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Nama Lengkap</label><input required type="text" className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition-colors" placeholder="Contoh: Budi Santoso" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} /></div>
                    )}
                    <div><label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Email</label><input required type="email" className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition-colors" placeholder="email@contoh.com" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} /></div>
                    <div><label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Password</label><input required type="password" className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition-colors" placeholder="******" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} /></div>
                    
                    <button type="submit" className="w-full bg-white text-black font-bold py-3.5 rounded-lg hover:bg-orange-500 hover:text-white transition-all">{authMode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}</button>
                  </form>
                  
                  <div className="mt-6 text-center text-sm text-gray-500 border-t border-white/5 pt-4">
                    {authMode === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                    <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-orange-500 font-bold hover:underline">{authMode === 'login' ? 'Daftar di sini' : 'Login di sini'}</button>
                  </div>
                </div>
              )}

              {/* STEP 3: SHIPPING */}
              {step === "shipping" && (
                <div className="animate-in slide-in-from-right duration-300">
                  <h2 className="text-2xl font-bold text-white mb-6">Informasi Pengiriman</h2>
                  
                  {/* User Badge */}
                  <div className="bg-[#111] border border-white/10 p-4 rounded-xl mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-800 text-white flex items-center justify-center font-bold text-lg">{customer?.name?.charAt(0) || "U"}</div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Logged in as</p>
                      <p className="font-bold text-white">{customer?.name} <span className="text-gray-500 font-normal">({customer?.email})</span></p>
                    </div>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); setStep("payment"); }} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Penerima</label><input required type="text" className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">WhatsApp</label><input required type="tel" className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none" placeholder="08..." value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                    </div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Alamat Lengkap</label><textarea required rows={3} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none" placeholder="Jalan, No Rumah, Kecamatan, Kota, Kode Pos" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
                    
                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setStep("review")} className="px-6 py-3 text-gray-500 hover:text-white font-bold transition-colors">Kembali</button>
                      <button type="submit" className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-600/20">Pilih Pembayaran &rarr;</button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 4: PAYMENT SELECTION (COD ADDED) */}
              {step === "payment" && (
                <div className="animate-in slide-in-from-right duration-300">
                  <h2 className="text-2xl font-bold text-white mb-6">Pilih Metode Pembayaran</h2>

                  {/* Pilihan Bank */}
                  <div className="space-y-3 mb-8">
                    {/* 👇 GANTI QRIS DENGAN COD DI SINI */}
                    {["BCA Virtual Account", "Mandiri Virtual Account", "COD (Bayar di Tempat)"].map((bank) => (
                      <div 
                        key={bank} 
                        onClick={() => handleSelectBank(bank)}
                        className={`group cursor-pointer p-5 rounded-xl border transition-all flex items-center justify-between ${selectedBank === bank ? "bg-orange-900/20 border-orange-500 ring-1 ring-orange-500" : "bg-[#111] border-white/10 hover:border-white/30"}`}
                      >
                        <div className="flex items-center gap-4">
                           {/* Icon Bank Logic */}
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${bank.includes("BCA") ? "bg-blue-600 text-white" : bank.includes("Mandiri") ? "bg-yellow-500 text-blue-900" : "bg-green-600 text-white"}`}>
                             {bank.includes("COD") ? "COD" : bank.split(" ")[0]}
                           </div>
                           <span className={`font-bold ${selectedBank === bank ? "text-orange-500" : "text-white"}`}>{bank}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedBank === bank ? "border-orange-500" : "border-gray-600"}`}>
                          {selectedBank === bank && <div className="w-3 h-3 rounded-full bg-orange-500"></div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tampilan Virtual Account / Instruksi COD */}
                  {selectedBank && (
                    <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-xl animate-in fade-in slide-in-from-top-4">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">
                                {selectedBank.includes("COD") ? "Instruksi" : "Nomor Virtual Account"}
                            </p>
                            <p className="text-2xl font-mono text-white font-bold tracking-widest">{virtualAccount}</p>
                          </div>
                          {!selectedBank.includes("COD") && (
                            <button className="text-orange-500 text-xs font-bold hover:text-white" onClick={() => alert("Nomor VA Disalin!")}>SALIN</button>
                          )}
                       </div>
                       
                       <div className="bg-orange-900/20 border border-orange-500/20 p-3 rounded-lg flex items-center gap-3 mb-6">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          <p className="text-sm text-orange-200">
                             {selectedBank.includes("COD") ? "Pastikan ada penerima paket di alamat tujuan." : "Selesaikan pembayaran sebelum 23:59 WIB hari ini."}
                          </p>
                       </div>

                       <div className="border-t border-white/10 pt-4">
                          <div className="flex justify-between text-sm text-gray-400 mb-1"><span>Total Tagihan:</span></div>
                          <div className="text-3xl font-bold text-white">{formatRupiah(totalPrice)}</div>
                       </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-6">
                    <button onClick={() => setStep("shipping")} className="px-6 py-3 text-gray-500 hover:text-white font-bold transition-colors">Kembali</button>
                    <button 
                      onClick={submitOrderToBackend} 
                      disabled={!selectedBank || isProcessing} 
                      className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center gap-2"
                    >
                      {isProcessing ? "Memproses..." : selectedBank?.includes("COD") ? "Konfirmasi Pesanan COD" : "Saya Sudah Bayar"}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* KOLOM KANAN: RINGKASAN ORDER (STICKY) */}
            {(step as string) !== "success" && (
              <div className="lg:col-span-1 hidden lg:block">
                <div className="bg-[#111] p-6 rounded-2xl border border-white/10 sticky top-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    Ringkasan Pesanan
                  </h3>
                  <div className="space-y-4 mb-6 border-b border-white/10 pb-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {cart.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-12 h-14 bg-black rounded overflow-hidden flex-shrink-0">
                           <Image src={item.image || "https://placehold.co/100"} alt="" width={48} height={56} className="object-cover w-full h-full"/>
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-gray-300 text-sm font-medium truncate">{item.name}</p>
                           <p className="text-gray-500 text-xs">1 x {formatRupiah(Number(item.price))}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Subtotal Produk</span>
                    <span className="text-white font-mono">{formatRupiah(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400 text-sm">Ongkos Kirim</span>
                    <span className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">GRATIS</span>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                    <span className="text-white font-bold">Total Belanja</span>
                    <span className="text-xl font-bold text-orange-500">{formatRupiah(totalPrice)}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}