"use client"; // 必须添加，以支持 fetch 和状态管理

import { useEffect, useState } from "react"; // 仅添加逻辑支持
import Link from "next/link";

export default function PhotosPage() {
  // 1. 初始状态设为空数组
  const [photos, setPhotos] = useState<any[]>([]);

  // 2. 页面加载时自动查询数据库
  useEffect(() => {
    fetch("/api/medias")
      .then((res) => res.json())
      .then((data) => {
        // 仅筛选类型为 image 的数据
        const filtered = data.filter((item: any) => item.type === "image");
        setPhotos(filtered);
      })
      .catch((err) => console.error("Query failed:", err));
  }, []);

  return (
    <div className="h-screen px-4 box-border bg-white flex flex-col overflow-hidden">
      <div className="flex justify-between items-center py-2 box-border">
        <div className="text-xl font-bold tracking-tighter italic">IMAGES</div>
        <Link href="/" className="text-gray-400 text-sm">back</Link>
      </div>

      <div className="flex-1 overflow-y-auto columns-2 gap-3 space-y-3 no-scrollbar">
        {/* 3. 这里的渲染逻辑和你之前完全一样，只是 p 现在来自数据库 */}
        {photos.map((p) => (
          <div key={p.id} className="break-inside-avoid mb-3">
            <img
              src={p.url}
              className="w-full rounded-xl shadow-sm"
              loading="lazy"
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
}