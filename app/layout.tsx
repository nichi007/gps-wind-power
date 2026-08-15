import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WIND / PULSE | 風力発電シミュレーター",
  description: "現在地の風況から風力発電量をシミュレーションします。",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
