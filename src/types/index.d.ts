import type { ReactNode } from "react";

/**
 * website config, without translations
 */
export type WebsiteConfig = {
  ui: UiConfig;
  metadata: MetadataConfig;
  routes: RoutesConfig;
  auth: AuthConfig;
  i18n: I18nConfig;
  storage: StorageConfig;
};

/**
 * UI configuration
 */
export interface UiConfig {
  mode?: ModeConfig;
  theme?: ThemeConfig;
}

/**
 * Website metadata
 */
export interface MetadataConfig {
  images?: ImagesConfig;
  social?: SocialConfig;
}

export interface ModeConfig {
  defaultMode?: "light" | "dark" | "system";                  // The default mode of the website
  enableSwitch?: boolean;                                     // Whether to enable the mode switch
}

export interface ThemeConfig {
  defaultTheme?: "default" | "blue" | "green" | "amber" | "neutral"; // The default theme of the website
  enableSwitch?: boolean;                                     // Whether to enable the theme switch
}

export interface ImagesConfig {
  ogImage?: string;                                           // The image as Open Graph image
  logoLight?: string;                                         // The light logo image
  logoDark?: string;                                          // The dark logo image
}

/**
 * Social media configuration
 */
export interface SocialConfig {
  twitter?: string;
  github?: string;
  discord?: string;
  blueSky?: string;
  mastodon?: string;
  youtube?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  telegram?: string;
}

/**
 * Routes configuration
 */
export interface RoutesConfig {
  defaultLoginRedirect?: string;      // The default login redirect route
}

export interface AuthConfig {
  enableGoogleLogin?: boolean;       // Whether to enable google login
  enableGithubLogin?: boolean;       // Whether to enable github login
  enableCredentialLogin?: boolean;   // Whether to enable email/password login
}

/**
 * I18n configuration
 */
export interface I18nConfig {
  defaultLocale: string;              // The default locale of the website
  locales: Record<string, { flag?: string; name: string }>; // The locales of the website
}

/**
 * Storage configuration
 */
export interface StorageConfig {
  enable: boolean;                   // Whether to enable the storage
  provider: "s3";                    // The storage provider, only s3 is supported for now
}

/**
 * menu item, used for navbar links, sidebar links, footer links
 */
export type MenuItem = {
  title: string;                      // The text to display
  description?: string;               // The description of the item
  icon?: ReactNode;                   // The icon to display
  href?: string;                      // The url to link to
  external?: boolean;                 // Whether the link is external
  authorizeOnly?: string[];           // The roles that are authorized to see the item
};

/**
 * nested menu item, used for navbar links, sidebar links, footer links
 */
export type NestedMenuItem = MenuItem & {
  items?: MenuItem[];                // The items to display in the nested menu
};

/**
 * Blog Category
 *
 * we can not pass CategoryType from server component to client component
 * so we need to define a new type, and use it in the client component
 */
export type BlogCategory = {
  slug: string;
  name: string;
  description: string;
};
