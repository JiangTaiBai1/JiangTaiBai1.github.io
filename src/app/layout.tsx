import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/particle-background";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jiangtaibai1.github.io";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "JiangTaibai - 全栈开发者 & 独立网站/小程序创作者",
    template: "%s | JiangTaibai",
  },
  description:
    "全栈开发者 / 独立游戏创作者的个人网站。展示代码项目、技术文章与视频内容，记录技术成长之路。",
  keywords: ["全栈开发", "Next.js", "React", "独立游戏", "技术博客"],
  authors: [{ name: "JiangTaibai" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "JiangTaibai",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <ParticleBackground />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
