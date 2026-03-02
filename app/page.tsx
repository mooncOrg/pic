"use client";

import { useAdmin } from "@/context/AdminContext";
import Link from "next/link";

export default function WelcomePage() {
  const { isAdmin, setIsAdmin } = useAdmin();

  const handleAdminAuth = async () => {
    const password = prompt("请输入管理暗号");
    if (!password) return;

    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsAdmin(true);
      alert("验证成功");
    } else {
      alert("暗号错误");
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <div className="text-center mb-12 text-4xl font-bold tracking-tight text-gray-900">
        Welcome to Pic
      </div>

      <div className="flex flex-col gap-5 w-full px-6 max-w-md">
        <Link href="/photos" className="py-10 bg-gray-50 rounded-3xl border border-gray-100 text-center active:scale-95 transition-transform">
          <div className="text-4xl mb-3">📸</div>
          <h2 className="text-xl font-bold text-gray-800">静止图库</h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Photos</p>
        </Link>

        <Link href="/videos" className="py-10 bg-gray-50 rounded-3xl border border-gray-100 text-center active:scale-95 transition-transform">
          <div className="text-4xl mb-3">🎥</div>
          <h2 className="text-xl font-bold text-gray-800">动态影像</h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Videos</p>
        </Link>

        {isAdmin && (
          <Link
            href="/upload"
            className="mt-2 py-6 bg-zinc-900 rounded-3xl text-center shadow-xl shadow-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-3 animate-in fade-in zoom-in duration-300"
          >
            <span className="text-white text-xl">➕</span>
            <span className="text-white font-bold text-lg">收录新媒体</span>
          </Link>
        )}
      </div>

      <div
        onClick={!isAdmin ? handleAdminAuth : undefined}
        className="mt-12 text-zinc-300 text-xs font-medium tracking-tighter cursor-default select-none active:opacity-50"
      >
        DANCING CODES STUDIO © 2026
      </div>
    </div>
  );
}