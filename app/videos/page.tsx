"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 1. 底部侦察兵引用
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchVideos = async (pageNum: number) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      // 这里的 type 传 video
      const res = await fetch(`/api/medias?type=video&page=${pageNum}&pageSize=5`);
      const { data } = await res.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        // 合并数据
        setVideos((prev) => {
          const newItems = data.filter(
            (newItem: any) => !prev.some((oldItem) => oldItem.id === newItem.id)
          );
          return [...prev, ...newItems];
        });
        if (data.length < 5) setHasMore(false);
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
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVideos(nextPage);
  };

  // 2. 核心：监听滚动到底部
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

  return (
    <div className="h-screen px-4 box-border bg-zinc-950 text-white flex flex-col overflow-hidden">
      <div className="flex justify-between items-center py-4 box-border">
        <div className="text-xl font-bold tracking-tighter italic text-white">VIDEOS</div>
        <Link href="/" className="text-gray-400 text-sm">back</Link>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar py-4">
        <div className="space-y-8">
          {videos.map((video) => (
            <div key={video.id} className="group">
              <div className="mb-2 text-[10px] font-medium text-zinc-500 uppercase tracking-widest opacity-60">
                Video #{video.id}
              </div>
              <video
                src={video.url}
                className="w-full rounded-2xl shadow-2xl bg-black border border-zinc-800"
                controls
                playsInline
              ></video>
            </div>
          ))}
        </div>

        <div ref={observerRef} className="py-12 text-center">
          {loading && (
            <span className="text-xs font-bold tracking-widest text-zinc-500 animate-pulse">
              LOADING...
            </span>
          )}
          {!hasMore && videos.length > 0 && (
            <span className="text-xs text-zinc-700 italic uppercase tracking-tighter">
              No more videos.
            </span>
          )}
        </div>

        {!loading && videos.length === 0 && (
          <div className="text-center py-20 text-zinc-600 italic">
            No videos found.
          </div>
        )}
      </div>
    </div>
  );
}