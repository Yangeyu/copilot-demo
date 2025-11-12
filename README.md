## 项目技术栈
- Next.js 15
- Zustand
- Shadcn
- Tailwind CSS
- Better Auth
- PostgreSQL
- Drizzle ORM

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Drizzle 和 Auth 集成文档

该项目通过 Better Auth 实现了与 Drizzle ORM 的集成，提供了完整的用户认证和会话管理功能。

### 文件结构

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
│   └── messages.ts        # 多语言加载逻辑
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

#### 多语言管理 (`src/i18n/messages.ts`)
- 多语言文件位于 `messages/` 目录

### 消息文件结构

多语言文件存储在 `messages/` 目录：
- `en.json`
- `zh.json`

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

## MDX 文档

[Fumadocs官方文档](https://fumadocs.dev/docs/ui)

###  文件结构
```
Project/
├── content/
│   └── pages/                           # MDX content directory
│       ├── terms-of-service.en.mdx      # English terms of service
│       └── terms-of-service.zh.mdx      # Chinese terms of service
├── src/
│   ├── components/
│   │   └── docs/
│   │       └── mdx-components.tsx       # MDX component configuration
│   ├── lib/
│   │   └── source.ts                    # MDX source loader configuration
│   ├── styles/
│   │   └── mdx.css                      # MDX styling
│   └── app/
│       └── [locale]/
│           └── (legal)/
│               └── layout.tsx           # MDX CSS import
├── .source/                             # Generated by fumadocs-mdx
│   └── index.ts                         # Auto-generated content source
├── next.config.ts                       # MDX plugin configuration
├── source.config.ts                     # Content collections configuration

```

### Next.js配置

MDX功能在 `next.config.ts` 中启用：

```typescript
const withMDX = createMDX()

export default withMDX(withNextIntl(nextConfig));
```

### 样式

MDX内容在 `src/styles/mdx.css` 中设置样式：

### 依赖项

`package.json` 中的关键MDX相关依赖：

- `fumadocs-mdx`：主要MDX处理库
- `fumadocs-ui`：MDX内容的UI组件
- `@types/mdx`：MDX的TypeScript类型

### 内容创建工作流程

1. 在适当的内容目录中创建MDX文件（`content/pages/`，`content/changelog/`）
2. 在前端变量中包含必需字段（页面的标题、日期、已发布）
3. 使用Markdown语法编写内容
4. 选择性地在MDX内容中包含React组件
5. 如需要，运行 `fumadocs-mdx` 命令处理内容

### 命令

- `npm run content`（或 `fumadocs-mdx`）：处理MDX内容（在构建过程中自动运行）

