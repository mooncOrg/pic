# 阶段 1: 构建
FROM node:24-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 阶段 2: 运行 (只拷贝必要文件)
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV PORT 10003

# 这里的拷贝是体积缩小的核心
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 10003
CMD ["node", "server.js"]