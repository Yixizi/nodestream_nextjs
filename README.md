# Streamnode（Next.js 16 自动化工作流平台）

## 项目简介

Streamnode 是一个基于 Next.js 16、React 19、Prisma 和 Polar + Inngest 生态构建的自动化工作流平台。它把 AI 节点、凭证管理、触发器以及订阅计费整合在一个现代化的单页应用中，让用户可以直观地组合“节点”（AI、Stripe、Google 表单等）来驱动流程、管理执行记录与订阅状态。

核心功能包括：

- 内建 Polar + better-auth 的邮件/社交登录与订阅插件（checkout、portal）。
- Prisma + PostgreSQL 驱动的数据层与凭证加密（`Cryptr`）支持。
- 丰富的 Radix + XYFlow 组件构成的 UI（节点选择器、升级弹窗、执行面板、Deepseek 搜索等）。
- Stripe / Google 表单 / Inngest 触发器，结合 `next/api` 与 `mprocs` 后台任务。

## 技术栈概览

- Next.js 16（app router + edge/服务器运行时），React 19，TypeScript。
- `@polar-sh/better-auth` + `better-auth/adapters/prisma` 处理认证/订阅。
- Prisma 7 + `@prisma/adapter-pg` 连接 PostgreSQL。
- `inngest` + `mprocs` 管理异步事件与本地开发 worker。
- `@ai-sdk/deepseek`、`@ai-sdk/google`、`Nuqs` 等即插即用节点。
- Tailwind CSS 4、Radix UI、Jotai、React Query、React Flow 等现代 UI 库。

## 快速开始（默认使用 pnpm）

1. 安装依赖：

   ```bash
   pnpm install
   ```

2. 准备环境变量（参考下文示例，放在 `.env.local` 或 `.env`）：

   ```bash
   DATABASE_URL=postgresql://user:pass@localhost:5432/streamnode
   POLAR_ACCESS_TOKEN=polar_sk_xxx
   POLAR_SUCCESS_URL=http://localhost:3000/checkout/success
   GITHUB_CLIENT_ID=xxx
   GITHUB_CLIENT_SECRET=xxx
   GOOGLE_CLIENT_ID=xxx
   GOOGLE_CLIENT_SECRET=xxx
   ENCRYPTION_KEY=32charsminimumsecret
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

   - `DATABASE_URL`：Prisma 连接 PostgreSQL。
   - `POLAR_ACCESS_TOKEN` / `POLAR_SUCCESS_URL`：用于 Polar 的订阅系统（Checkout/Portal）。
   - `GITHUB_*`、`GOOGLE_*`：better-auth 社交登录凭证。
   - `ENCRYPTION_KEY`：`Cryptr` 用于凭证加密，需要 32 个字符以上。
   - `NEXT_PUBLIC_API_URL`：触发器/前端调用 API 的基础地址（可指向 `http://localhost:3000/api`）。

3. 运行本地服务：

   ```bash
   pnpm dev
   ```

   - `pnpm inngest:dev` 仅启动 Inngest/worker。
   - `pnpm ngrok:dev` 使用 `ngrok` 暴露本地端口（`dotenv` 加载环境变量）。
   - `pnpm dev:all` 通过 `mprocs` 并行运行所有服务（前端 + Inngest）。

4. 数据迁移与种子：

   ```bash
   pnpm prisma migrate dev
   pnpm prisma db seed      # 如需
   ```


## 常用 pnpm 脚本

- `pnpm dev`：启动 Next.js 开发服务器（默认 `--webpack`）。
- `pnpm build`：生产环境打包。
- `pnpm start`：生产模式运行。
- `pnpm lint`：运行 ESLint。
- `pnpm inngest:dev`：启动 Inngest CLI dev 模式。
- `pnpm ngrok:dev`：使用 `dotenv` 加载后通过 ngrok 暴露本地 3000 端口。
- `pnpm dev:all`：使用 `mprocs` 并行拉起所有进程（前端 + worker + 其他）。

## 目录结构速览

- `src/app`：Next.js app router 页面与布局。
- `src/features`：按域拆分的功能区（认证、凭证、执行、触发器、Deepseek 等）。
- `src/components`：可复用的 UI 组件（侧边栏、升级弹窗、节点选择器等）。
- `src/inngest`：后台任务/事件（流程状态、执行记录）。
- `src/lib`：工具集（Prisma、Polar、加密、AuthClient）。
- `prisma`：Prisma schema 与迁移脚本。

## 部署提示

- 构建前确认环境变量齐全（`DATABASE_URL`、Polar、Auth social、加密密钥）。
- 生产环境建议设置 `NODE_ENV=production`，`CI=true` 让 Next.js 静默构建。
- 若部署到 Vercel，可通过 `VERCEL_URL` 自动确定 `trpc` 客户端基站。

## 其他说明

- 所有敏感配置都通过 `.env` 或环境变量注入，切勿将密钥提交到 Git。
- 可参考 `prisma.config.ts` + `src/lib/prisma.ts` 了解数据库初始化流程。
- 如果需要更多 trigger/节点，可在 `src/features/triggers` 下添加对应组件与 API。
