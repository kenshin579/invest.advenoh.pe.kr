import { Inter, Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ThemeProvider } from '@/components/theme-provider'
import ClientOnly from '@/components/ClientOnly'
import React from 'react'
import { Metadata } from 'next'

// 폰트 최적화 설정
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
  preload: true,
})

// 메타데이터 설정
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://investment.advenoh.pe.kr';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: '투자 인사이트 - 주식, ETF, 채권, 펀드 전문 블로그',
  description: '투자에 대한 깊이 있는 인사이트와 실전 경험을 공유하는 전문 금융 블로그입니다.',
  keywords: ['투자', '주식', 'ETF', '채권', '펀드', '금융', '재테크'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: baseUrl,
    siteName: '투자 인사이트',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoSansKR.variable}`}>
      <head>
        <meta name="naver-site-verification" content="1e8908d89d0bff3a013d83b763543f37049a907f" />
        <meta name="msvalidate.01" content="6B5D48FAB4AC7D1E78A51352B904624B" />
        <link rel="icon" href="/favicon.ico" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-9LNH27K1YS"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9LNH27K1YS');
            `
          }}
        />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} ${notoSansKR.className} font-sans antialiased`}>
        <ThemeProvider>
          <ClientOnly>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </ClientOnly>
        </ThemeProvider>
      </body>
    </html>
  )
}
