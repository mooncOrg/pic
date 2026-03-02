import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "5");
        const type = searchParams.get("type") || "image";

        const offset = (page - 1) * pageSize;

        const [rows] = await db.query(
            "SELECT * FROM medias WHERE type = ? AND is_deleted = 0 ORDER BY created_at DESC LIMIT ? OFFSET ?",
            [type, pageSize, offset]
        );

        const [totalRows]: any = await db.query(
            "SELECT COUNT(*) as count FROM medias WHERE type = ? AND is_deleted = 0",
            [type]
        );
        const total = totalRows[0].count;

        return NextResponse.json({
            data: rows,
            meta: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { url, type, poster } = await request.json();

        const [result] = await db.execute(
            "INSERT INTO medias (url, type, poster, is_deleted) VALUES (?, ?, ?, 0)",
            [url, type, poster]
        );

        const insertId = (result as any).insertId;

        return NextResponse.json({
            success: true,
            id: insertId,
            message: "数据已安全存入 MySQL"
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}