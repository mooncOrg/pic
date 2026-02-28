import mysql from 'mysql2/promise';

const globalForDb = global as unknown as { db: mysql.Pool };

export const db = 
  globalForDb.db || 
  mysql.createPool({
    uri: process.env.DATABASE_URL, // 还是用你那个 DSN 字符串
    waitForConnections: true,
    connectionLimit: 10,           // 连接池最大连接数
    queueLimit: 0,
    enableKeepAlive: true,         // 保持长连接，防止远程服务器断开
    keepAliveInitialDelay: 10000
  });

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;