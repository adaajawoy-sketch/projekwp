"use client";
import { useState, useRef, useEffect } from "react";

export default function Copilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai', text: string }[]>([
    { sender: 'ai', text: "Selamat datang di kegelapan... Ada yang bisa Askara bantu?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      // Pastikan port backend benar (biasanya 3001 atau 3333, sesuaikan dengan .env kamu)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Sinyal terputus... Coba lagi nanti." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-900/50 hover:scale-110 transition-transform animate-bounce">
          {/* Icon Robot / Hantu */}
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M12 8a6 6 0 0 0-6 6v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4a2 2 0 0 1 2-2 2 2 0 0 1 2 2v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4a6 6 0 0 0-6-6Z"/></svg>
        </button>
      )}
      {isOpen && (
        <div className="w-80 md:w-96 bg-[#111] border border-orange-900/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-orange-900/20 p-4 flex justify-between items-center border-b border-orange-900/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-xs font-bold text-white">AS</div>
              <div><h3 className="font-bold text-white text-sm">Askara AI</h3><p className="text-[10px] text-orange-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online</p></div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-orange-600 text-white rounded-br-none' : 'bg-[#222] text-gray-300 border border-white/10 rounded-bl-none'}`}>{msg.text}</div>
              </div>
            ))}
            {loading && <div className="flex justify-start"><div className="bg-[#222] p-3 rounded-xl rounded-bl-none border border-white/10 text-xs text-gray-500">Sedang mengetik...</div></div>}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 bg-[#111] border-t border-white/10 flex gap-2">
            <input type="text" placeholder="Tanya sesuatu..." className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 outline-none" value={input} onChange={(e) => setInput(e.target.value)} />
            <button type="submit" disabled={loading || !input} className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors">➤</button>
          </form>
        </div>
      )}
    </div>
  );
}