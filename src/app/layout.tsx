import { ThemeProvider } from "@/components/theme-provider";
import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';

import Head from "next/head";

import "./globals.css";
import Script from "next/script";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    absolute: config.blog.metadata.title.absolute,
    default: config.blog.metadata.title.default,
    template: config.blog.metadata.title.template,
  },
  description: config.blog.metadata.description,
  alternates: {
    canonical: config.blog.metadata.canonical, 
  },
  robots: {
    index: true, 
    follow: true, 
  },
  openGraph: {
    title: config.blog.metadata.title.default,
    description: config.blog.metadata.description,
    images: [
      signOgImageUrl({
        title: config.blog.name,
      }),
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" type="image/x-icon" />        
      </Head>

      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased max-w-full my-auto lg:mx-[20%]",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>{children}</main>
        </ThemeProvider>

        {process.env.NODE_ENV === 'production' && 
          <>
            <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9737127050475494"
              crossOrigin="anonymous"
              strategy="lazyOnload"
            />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
          </>}
        
      </body>
    </html>
  );
}
