"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext"; // 1. 引入全局管理状态

export default function PhotosPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 修改：selectedPhoto 存整个对象 { id, url, ... }
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  const { isAdmin } = useAdmin(); // 2. 获取管理员身份
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchPhotos = async (pageNum: number) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/medias?type=image&page=${pageNum}&pageSize=10`);
      const { data } = await res.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPhotos((prev) => {
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
    fetchPhotos(1);
  }, []);

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPhotos(nextPage);
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

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore, page]);

  // 3. 删除处理函数
  const handleDelete = async (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation(); // 防止触发背景的关闭事件
    if (!window.confirm("确定要永久删除这张照片吗？")) return;

    try {
      const res = await fetch(`/api/medias/${photoId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== photoId));
        setSelectedPhoto(null);
      } else {
        alert("删除失败，请检查网络或权限");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="h-screen px-4 box-border bg-white flex flex-col overflow-hidden relative">
      <div className="flex justify-between items-center py-2 box-border">
        <div className="text-xl font-bold tracking-tighter italic">IMAGES</div>
        <Link href="/" className="text-gray-400 text-sm">back</Link>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="columns-2 gap-3 space-y-3">
          {photos.map((p) => (
            <div key={p.id} className="break-inside-avoid mb-3 cursor-zoom-in">
              <img
                src={p.url}
                className="w-full rounded-xl shadow-sm border border-gray-50 active:scale-[0.98] transition-transform"
                loading="lazy"
                alt=""
                onClick={() => setSelectedPhoto(p)} // 存入整个对象
              />
            </div>
          ))}
        </div>

        <div ref={observerRef} className="h-10 w-full flex items-center justify-center">
          {loading && (
            <span className="text-xs font-bold tracking-widest uppercase animate-pulse">
              Loading...
            </span>
          )}
          {!hasMore && photos.length > 0 && (
            <span className="text-xs text-gray-400 italic">No more images.</span>
          )}
        </div>

        {!loading && photos.length === 0 && (
          <div className="text-center py-20 text-gray-300 italic">
            No images found.
          </div>
        )}
      </div>

      {/* 全屏弹窗 */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* 顶部工具栏 */}
          <div className="absolute top-0 w-full p-6 flex justify-end">
            <button className="text-white text-2xl opacity-50 hover:opacity-100 transition-opacity">
              ✕
            </button>
          </div>

          {/* 图片主体 */}
          <img
            src={selectedPhoto.url}
            className="max-w-[95%] max-h-[80vh] object-contain shadow-2xl animate-in zoom-in-95 duration-300"
            alt="Full Preview"
            onClick={(e) => e.stopPropagation()} // 点击图片本身不关闭
          />

          {/* 4. 管理员删除按钮 - 放在底部 */}
          {isAdmin && (
            <div className="absolute bottom-12 w-full flex justify-center animate-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={(e) => handleDelete(e, selectedPhoto.id)}
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