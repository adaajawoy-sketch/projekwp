"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Comment {
  id: number;
  user: string;
  text: string;
  createdAt: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Ambil Data Komentar
  async function fetchComments() {
    try {
      const res = await fetch("http://localhost:3001/comments");
      if (res.ok) {
        setComments(await res.json());
      }
    } catch (error) {
      console.error("Gagal ambil komentar:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchComments();
  }, []);

  // 2. Fungsi Hapus
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus komentar ini?")) return;

    try {
      const res = await fetch(`http://localhost:3001/comments/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Komentar dihapus!");
        setComments((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Gagal menghapus.");
      }
    } catch (error) {
      alert("Error koneksi.");
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Komentar Masuk</h1>
            <p className="text-gray-500">Moderasi kata-kata netizen.</p>
          </div>
          <Link href="/admin" className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-100">
            ← Kembali ke Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">User</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Isi Komentar</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Waktu</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Memuat...</td></tr>
              ) : comments.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Belum ada komentar.</td></tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-900 align-top w-48">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 uppercase">
                          {comment.user.charAt(0)}
                        </div>
                        {comment.user}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 align-top italic">"{comment.text}"</td>
                    <td className="p-4 text-xs text-gray-400 align-top w-40">{formatDate(comment.createdAt)}</td>
                    <td className="p-4 text-center align-top w-24">
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                        title="Hapus Komentar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}