"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
    const [url, setUrl] = useState("");
    const [type, setType] = useState<"image" | "video">("image");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return alert("请输入 URL");

        setLoading(true);
        try {
            const res = await fetch("/api/medias", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, type }),
            });

            if (res.ok) {
                alert("保存成功！");
                router.push("/"); // 成功后跳回首页看结果
            } else {
                alert("保存失败，请检查数据库连接");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-zinc-100">
                <h1 className="text-2xl font-bold text-zinc-800 mb-6">新增内容</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-500 mb-2">资源 URL</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="请输入网络地址"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>

                    {/* 类型选择 */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-500 mb-2">资源类型</label>
                        <div className="flex gap-4">
                            {["image", "video"].map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t as any)}
                                    className={`flex-1 py-2 rounded-lg border transition-all ${type === t
                                        ? "bg-zinc-800 text-white border-zinc-800"
                                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                                        }`}
                                >
                                    {t === "image" ? "图片" : "视频"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 提交按钮 */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-100 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? "保存中..." : "确定发布"}
                    </button>
                </form>
            </div>
        </div>
    );
}