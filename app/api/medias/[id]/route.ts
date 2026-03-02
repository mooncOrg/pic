import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    // 将 params 类型标记为 Promise
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const [result]: any = await db.execute(
            "UPDATE medias SET is_deleted = 1 WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "未找到该媒体资源" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "逻辑删除成功"
        });
    } catch (error: any) {
        console.error("删除出错:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}