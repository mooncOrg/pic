"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function VideosPage() {
  // 1. 初始化视频状态
  const [videos, setVideos] = useState<any[]>([]);

  // 2. 页面加载时请求 API
  useEffect(() => {
    fetch("/api/medias")
      .then((res) => res.json())
      .then((data) => {
        // 关键：这里过滤出视频类型
        const filtered = data.filter((item: any) => item.type === "video");
        setVideos(filtered);
      })
      .catch((err) => console.error("Query failed:", err));
  }, []);

  return (
    <div className="h-screen px-4 box-border bg-zinc-950 text-white flex flex-col overflow-hidden">
      <div className="flex justify-between items-center py-4 box-border">
        <div className="text-xl font-bold tracking-tighter italic text-white">VIDEOS</div>
        <Link href="/" className="text-gray-400 text-sm">back</Link>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-6">
        {/* 3. 渲染数据库里的视频数据 */}
        {videos.map((video) => (
          <div key={video.id}>
            {/* 如果你数据库里没存 title，这里可以暂时用 created_at 或者 ID 代替 */}
            <div className="mb-3 text-lg font-medium text-zinc-100 uppercase tracking-widest text-xs opacity-50">
              Video #{video.id}
            </div>
            <video
              src={video.url}
              className="w-full rounded-xl shadow-lg bg-black"
              controls
              playsInline
            ></video>
          </div>
        ))}

        {/* 4. 如果数据库没视频，显示个提示 */}
        {videos.length === 0 && (
          <div className="text-center py-20 text-zinc-600 italic">
            No videos found.
          </div>
        )}
      </div>
    </div>
  );
}