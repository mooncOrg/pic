"use client";
import { useState } from "react";
import Link from "next/link";

export default function UploadPage() {
    const [url, setUrl] = useState("");
    const [poster, setPoster] = useState("");
    const [type, setType] = useState<"image" | "video">("image");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault();
        if (!url) return alert("请输入资源 URL");
        if (type === "video" && !poster) return alert("视频必须提供封面图 URL");

        setLoading(true);
        try {
            const res = await fetch("/api/medias", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url,
                    type,
                    poster: type === "video" ? poster : null
                }),
            });

            if (res.ok) {
                setUrl("");
                setPoster("");
                alert("保存成功");
            } else {
                alert("保存失败");
            }
        } catch (err) {
            console.error(err);
            alert("网络错误");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen px-4 box-border bg-white flex flex-col overflow-hidden relative">
            <div className="flex justify-between items-center py-2 box-border shrink-0">
                <div className="flex items-center gap-3">
                    <div className="text-xl font-bold tracking-tighter italic text-black uppercase">Upload</div>
                    <a
                        href="https://filehub.moonc.love"
                        target="_blank"
                        className="bg-zinc-100 text-zinc-500 text-[10px] font-bold px-2 py-1 rounded-md active:bg-zinc-200 transition-colors uppercase tracking-tight"
                    >
                        FileHub ↗
                    </a>
                </div>
                <Link href="/" className="text-gray-400 text-sm">back</Link>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-6 max-w-lg mx-auto w-full">
                <form onSubmit={handleSubmit} className="space-y-8 pb-10">

                    <div className="space-y-6">
                        <div className="flex gap-2">
                            {[
                                { val: "image", label: "图片" },
                                { val: "video", label: "视频" }
                            ].map((t) => (
                                <button
                                    key={t.val}
                                    type="button"
                                    onClick={() => setType(t.val as any)}
                                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === t.val
                                        ? "bg-black text-white shadow-lg"
                                        : "bg-zinc-50 text-zinc-400 border border-zinc-100 hover:bg-zinc-100"
                                        }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1 mb-2 block">资源地址</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-black transition-all text-sm"
                                    placeholder="请输入媒体文件的网络 URL..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>

                            {type === "video" && (
                                <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1 mb-2 block">封面地址</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-black transition-all text-sm"
                                        placeholder="请输入视频封面图片的 URL..."
                                        value={poster}
                                        onChange={(e) => setPoster(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white font-bold py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all disabled:opacity-30 uppercase text-xs tracking-[0.3em]"
                    >
                        {loading ? "同步中..." : "确认发布"}
                    </button>

                    <div className="pt-4">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1 mb-3 block">实时预览</label>
                        <div className="relative overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 aspect-video flex items-center justify-center">
                            {(type === 'image' ? url : poster) ? (
                                <img
                                    src={type === 'image' ? url : poster}
                                    className="w-full h-full object-cover animate-in fade-in duration-500"
                                    alt="预览"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            ) : (
                                <div className="text-zinc-300 text-[10px] font-bold uppercase tracking-[0.2em] italic">
                                    暂无预览内容
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}