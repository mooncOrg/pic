"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 全屏预览状态
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const { isAdmin } = useAdmin();
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchVideos = async (pageNum: number) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/medias?type=video&page=${pageNum}&pageSize=10`);
      const { data } = await res.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setVideos((prev) => {
          const newItems = data.filter(
            (newItem: any) => !prev.some((oldItem) => oldItem.id === newItem.id)
          );
          return [...prev, ...newItems];
        });
        if (data.length < 10) setHasMore(false);
      }
    } catch (err) {
      console.error("Query failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(1);
  }, []);

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVideos(nextPage);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore, page]);

  // 删除处理函数
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("确定要永久删除这段视频吗？")) return;

    try {
      const res = await fetch(`/api/medias/${id}`, { method: "DELETE" });
      if (res.ok) {
        setVideos((prev) => prev.filter((v) => v.id !== id));
        setSelectedVideo(null);
      } else {
        alert("删除失败，请检查权限");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    // 保持背景色为 white，与 PhotosPage 同步
    <div className="h-screen px-4 box-border bg-white flex flex-col overflow-hidden relative">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center py-2 box-border">
        <div className="text-xl font-bold tracking-tighter italic text-black">VIDEOS</div>
        <Link href="/" className="text-gray-400 text-sm">back</Link>
      </div>

      {/* 列表区 */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="space-y-3">
          {videos.map((video) => (
            <div
              key={video.id}
              className="cursor-zoom-in"
              onClick={() => setSelectedVideo(video)}
            >
              <img
                src={video.poster}
                className="w-full rounded-xl shadow-sm border border-gray-50 active:scale-[0.98] transition-transform aspect-video object-cover"
                alt=""
              />
            </div>
          ))}
        </div>

        {/* 加载更多 */}
        <div ref={observerRef} className="h-10 w-full flex items-center justify-center">
          {loading && (
            <span className="text-xs font-bold tracking-widest uppercase animate-pulse">
              Loading...
            </span>
          )}
          {!hasMore && videos.length > 0 && (
            <span className="text-xs text-gray-400 italic">No more videos.</span>
          )}
        </div>

        {!loading && videos.length === 0 && (
          <div className="text-center py-20 text-gray-300 italic">
            No videos found.
          </div>
        )}
      </div>

      {/* 全屏预览层 (完全同步 PhotosPage) */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300"
          onClick={() => setSelectedVideo(null)}
        >
          {/* 顶部工具栏 */}
          <div className="absolute top-0 w-full p-6 flex justify-end">
            <button className="text-white text-2xl opacity-50 hover:opacity-100 transition-opacity">
              ✕
            </button>
          </div>

          {/* 视频主体 */}
          <div className="w-full max-w-[95%] max-h-[80vh] flex items-center justify-center animate-in zoom-in-95 duration-300">
            <video
              src={selectedVideo.url}
              className="max-w-full max-h-[80vh] object-contain shadow-2xl"
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* 管理员删除按钮 - 放在底部 (完全同步 PhotosPage 样式) */}
          {isAdmin && (
            <div className="absolute bottom-12 w-full flex justify-center animate-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={(e) => handleDelete(e, selectedVideo.id)}
                className="px-8 py-3 bg-white/10 border border-red-500/50 rounded-full text-red-500 backdrop-blur-md active:scale-90 active:bg-red-500 active:text-white transition-all flex items-center gap-2"
              >
                <span className="text-xs font-bold tracking-[0.2em] uppercase">Delete Media</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}