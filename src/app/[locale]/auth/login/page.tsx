// import { LoginForm } from '@/components/auth/login-form';
import { constructMetadata } from "@/lib/metadata";
import { getUrlWithLocale } from "@/lib/urls/urls";
import type { Metadata } from "next";
import type { Locale } from "next-intl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;

  return constructMetadata({
    title: "Title",
    description: "Description",
    canonicalUrl: getUrlWithLocale("/auth/login", locale),
  });
}

export default async function LoginPage() {

  return (
    <div className="flex flex-col gap-4">
      LoginForm
    </div>
  );
}

