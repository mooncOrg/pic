# 阶段 1: 构建
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# 先创建目录，确保它存在，防止public目录为空导致打包后没有public导致报错
RUN mkdir -p public
RUN npm run build

# 阶段 2: 运行
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=10003

# 复制必要文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./

EXPOSE 10003
CMD ["npm", "start"]