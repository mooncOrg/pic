import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// 1. 【查】获取列表
export async function GET() {
    try {
        // 使用 SQL 原生语法，想怎么查就怎么查
        const [rows] = await db.query(
            "SELECT * FROM medias ORDER BY created_at DESC"
        );
        return NextResponse.json(rows);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 2. 【增】保存新媒体
export async function POST(request: Request) {
    try {
        const { url, type } = await request.json();

        // 手写 INSERT 语句，精准控制每一个字段
        const [result] = await db.execute(
            "INSERT INTO medias (url, type) VALUES (?, ?)",
            [url, type]
        );

        // 获取刚插入的 ID
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