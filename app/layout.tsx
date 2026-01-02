import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Global Economy Monitor - 세계 경제 이슈와 기부 가이드",
  description: "전 세계의 경제적 이슈와 빈곤 문제를 시각화하고, 신뢰할 수 있는 기부 단체를 소개하는 인터랙티브 플랫폼입니다.",
  keywords: ["경제", "빈곤", "기부", "세계 지도", "데이터 시각화", "NGO"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
