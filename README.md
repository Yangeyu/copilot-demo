This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

### 1. 基本信息
- 版本: `next-intl@4.5.0`
- 框架: Next.js 16.0.1 (App Router)
- 支持语言: 中文 (zh) 和英文 (en)，默认语言为中文

### 2. 核心配置文件

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

### 3. 消息文件结构

消息文件存储在 `messages/` 目录：
- `en.json`: 英文消息
- `zh.json`: 中文消息

### 4. 使用方式

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

### 5. 项目结构

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

### 6. Next.js 集成

在 `next.config.ts` 中使用插件：
```typescript
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
```

### 7. 网站配置

语言配置在 `src/config/website.ts` 中：
- 默认语言: `zh`
- 支持的语言:
  - `en`: English 🇺🇸
  - `zh`: 中文 🇨🇳

