'use client';

// import { ActiveThemeProvider } from '@/components/layout/active-theme-provider';
// import { QueryProvider } from '@/components/providers/query-provider';
// import { TooltipProvider } from '@/components/ui/tooltip';
import { websiteConfig } from '@/config/website';
// import type { Translations } from 'fumadocs-ui/i18n';
// import { RootProvider } from 'fumadocs-ui/provider';
import { useTranslations } from 'next-intl';
// import { ThemeProvider, useTheme } from 'next-themes';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
  locale: string;
}

/**
 * Providers
 *
 * This component is used to wrap the app in the providers.
 *
 * - ThemeProvider: Provides the theme to the app.
 * - ActiveThemeProvider: Provides the active theme to the app.
 * - RootProvider: Provides the root provider for Fumadocs UI.
 * - TooltipProvider: Provides the tooltip to the app.
 * - PaymentProvider: Provides the payment state to the app.
 * - CreditsProvider: Provides the credits state to the app.
 */
export function Providers({ children, locale }: ProvidersProps) {
  // const theme = useTheme();
  // const defaultMode = websiteConfig.ui.mode?.defaultMode ?? 'system';

  // available languages that will be displayed in the docs UI
  // make sure `locale` is consistent with your i18n config
  const locales = Object.entries(websiteConfig.i18n.locales).map(
    ([locale, data]) => ({
      name: data.name,
      locale,
    })
  );

  // translations object for fumadocs-ui from our message files
  // const translations: Partial<Translations> = {
  //   toc: 'toc',
  //   search: 'search',
  //   lastUpdate: 'lastUpdate',
  //   searchNoResult: 'searchNoResult',
  //   previousPage: 'previousPage',
  //   nextPage: 'nextPage',
  //   chooseLanguage: 'chooseLanguage',
  // };

  return (children)
}

