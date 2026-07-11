import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/providers/providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BUBBLE - Bias Understanding Based Blended Learning Environment",
  description: "Platform pembelajaran interaktif untuk meningkatkan literasi digital dan critical thinking siswa SMA",
  keywords: "bubble, learning, critical thinking, digital literacy, bias, education, indonesia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(12px)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}