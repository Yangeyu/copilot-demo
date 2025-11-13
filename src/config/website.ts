import type { WebsiteConfig } from "@/types";

/**
 * website config, without translations
 *
 * docs:
 * https://mksaas.com/docs/config/website
 */
export const websiteConfig: WebsiteConfig = {
  ui: {
    theme: {
      defaultTheme: "default",
      enableSwitch: true,
    },
    mode: {
      defaultMode: "light",
      enableSwitch: true,
    },
  },
  metadata: {
    images: {
      ogImage: "/og.png",
      logoLight: "/logo.png",
      logoDark: "/logo-dark.png",
    },
    social: {
      github: "https://github.com/MkSaaSHQ",
    },
  },
  routes: {
    defaultLoginRedirect: "/dashboard",
  },
  auth: {
    enableCredentialLogin: true,
  },
  i18n: {
    defaultLocale: "zh",
    locales: {
      en: {
        flag: "🇺🇸",
        name: "English",
      },
      zh: {
        flag: "🇨🇳",
        name: "中文",
      },
    },
  },
  storage: {
    enable: true,
    provider: "s3",
  },
};


