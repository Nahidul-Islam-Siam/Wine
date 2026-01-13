// app/layout.tsx

// import ScrollToTopButton from "@/components/ui/ScrollToTopButton/ScrollToTopButton";
import { NextUiProvider } from "@/lib/providers/NextUIProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import { ConfigProvider } from "antd";
import "antd/dist/reset.css";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LUMICA",
  description: "LUMICA - An Education Platform for Students and Teachers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} antialiased`}
        // 🔴 REMOVED !bg-white — it was hiding your background image
      >
        <NextUiProvider>
          <ReduxProvider>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#0BA8CC",
                  colorInfo: "#0BA8CC",
                  colorSuccess: "#3ECF8E",
                  colorWarning: "#FAAD14",
                  colorError: "#FF6B6B",
                  colorTextBase: "#1F1F1F",
                  colorBgBase: "transparent", // ← Make AntD base bg transparent
                  borderRadius: 8,
                  fontSize: 15,
                  lineHeight: 1.6,
                  controlHeight: 40,
                },
                components: {
                  Button: {
                    colorPrimary: "#0BA8CC",
                    colorPrimaryHover: "#0aa0bd",
                    colorPrimaryActive: "#088aa3",
                    colorSuccess: "#3ECF8E",
                    colorSuccessHover: "#36b87d",
                    colorSuccessActive: "#2fa36e",
                    colorWarning: "#FAAD14", 
                    colorWarningHover: "#e89c0f",
                    colorWarningActive: "#c27e0d",
                    colorError: "#FF6B6B",
                    colorErrorHover: "#e95e5e",
                    colorErrorActive: "#c94d4d",
                  },
                  Layout: {
                    colorBgLayout: "transparent", // ← Prevent AntD layout from adding white bg
                  },
                },
              }}
            >
              <>
                {/* Main content wrapper — transparent to show body bg */}
                <div className="min-h-screen grid grid-rows-[auto_1fr_auto] text-title max-w-[100vw] overflow-hidden bg-transparent">
                  {children}
                </div>
                {/* <ScrollToTopButton /> */}
                <Toaster />
              </>
            </ConfigProvider>
          </ReduxProvider>
        </NextUiProvider>
      </body>
    </html>
  );
}