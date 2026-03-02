"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function PhotosPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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

  return (
    <div className="h-screen px-4 box-border bg-white flex flex-col overflow-hidden">
      <div className="flex justify-between items-center py-2 box-border">
        <div className="text-xl font-bold tracking-tighter italic">IMAGES</div>
        <Link href="/" className="text-gray-400 text-sm">back</Link>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="columns-2 gap-3 space-y-3">
          {photos.map((p) => (
            <div key={p.id} className="break-inside-avoid mb-3">
              <img
                src={p.url}
                className="w-full rounded-xl shadow-sm border border-gray-50"
                loading="lazy"
                alt=""
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
    </div>
  );
}