## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## 国际化多语言支持(next-intl)

### 文件结构

```
src/
├── app/
│   └── [locale]/          # 语言路由段
│       ├── layout.tsx     # 语言布局（包含 NextIntlClientProvider）
│       └── (home)/
│           └── page.tsx   # 使用翻译的页面
├── i18n/
│   ├── routing.ts         # 路由配置
│   ├── request.ts         # 服务端配置
│   ├── navigation.ts      # 导航 API
│   └── messages.ts        # 消息加载逻辑
messages/
├── en.json                # 英文翻译
└── zh.json                # 中文翻译
```


### 基本信息
- 版本: `next-intl@4.5.0`
- 框架: Next.js 16.0.1 (App Router)
- 支持语言: 中文 (zh) 和英文 (en)，默认语言为中文

### 核心配置文件

#### 路由配置 (`src/i18n/routing.ts`)
- 使用 `defineRouting` 定义路由
- 支持的语言: `en`, `zh`
- 默认语言: `zh`
- 语言检测: 已禁用 (`localeDetection: false`)
- URL 前缀策略: `as-needed`（默认语言不显示前缀）
- Cookie 存储: 使用 `NEXT_LOCALE` cookie 记住用户语言偏好

#### 请求配置 (`src/i18n/request.ts`)
- 使用 `getRequestConfig` 配置服务端国际化
- 自动验证和回退到默认语言
- 支持消息回退机制（不完整的语言会回退到默认语言）

#### 导航配置 (`src/i18n/navigation.ts`)
- 导出国际化导航 API：
  - `LocaleLink`: 国际化链接组件
  - `useLocaleRouter`: 国际化路由 Hook
  - `useLocalePathname`: 获取当前路径名
  - `localeRedirect`: 国际化重定向

#### 消息管理 (`src/i18n/messages.ts`)
- 消息文件位于 `messages/` 目录
- 支持消息回退：不完整的语言会自动合并默认语言的消息
- 使用 `deepmerge` 合并消息

### 消息文件结构

消息文件存储在 `messages/` 目录：
- `en.json`: 英文消息
- `zh.json`: 中文消息

### 使用方式

#### 在客户端组件中使用
```tsx
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Metadata");
  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
```

#### 在服务端组件中使用
```tsx
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("Metadata");
  return <h1>{t("title")}</h1>;
}
```

### Next.js 集成

在 `next.config.ts` 中使用插件：
```typescript
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
```

### 网站配置

语言配置在 `src/config/website.ts` 中：
- 默认语言: `zh`
- 支持的语言:
  - `en`: English 🇺🇸
  - `zh`: 中文 🇨🇳

## Drizzle 和 Auth 集成文档

该项目通过 Better Auth 实现了与 Drizzle ORM 的集成，提供了完整的用户认证和会话管理功能。

### 项目结构

```
src/
├── api/
│   └── auth/[...all]/route.ts          # Auth API 路由
├── db/
│   ├── index.ts                        # 数据库连接管理
│   └── schema.ts                       # 数据库模式定义
├── lib/
│   ├── auth.ts                         # Better Auth 配置
│   ├── auth-types.ts                   # Auth 类型定义
│   └── server.ts                       # 服务器端工具
└── app/
    └── [locale]/
        └── auth/
            ├── layout.tsx              # 认证页面布局
            └── login/page.tsx          # 登录页面
```

### Drizzle 配置

- 使用 PostgreSQL 作为数据库
- 通过 `postgres-js` 驱动连接数据库
- 数据库连接通过 `getDb()` 函数提供单例模式
- 通过 `drizzle.config.ts` 配置迁移文件路径和模式文件

### Better Auth 与 Drizzle 集成

- 使用 `drizzleAdapter` 连接 Better Auth 和 Drizzle
- 配置 `provider: 'pg'` 指定 PostgreSQL 提供商
- 通过 `getDb()` 异步获取数据库连接实例

### 数据库表结构

- `user` 表：存储用户信息，包含扩展的 `customerId` 字段
- `session` 表：存储会话信息，与用户表关联
- `account` 表：存储第三方登录账号信息
- `verification` 表：存储验证信息（如邮箱验证）


