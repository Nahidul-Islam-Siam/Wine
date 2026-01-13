import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
// import ScrollToTopButton from "@/components/ui/ScrollToTopButton/ScrollToTopButton";
import { NextUiProvider } from "@/lib/providers/NextUIProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Ops Wine",
  description: "Ops Wine - An wine store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div> 
      <NextUiProvider>
        <ReduxProvider>
          <>
            <div className="min-h-screen grid grid-rows-[auto_1fr_auto] max-w-[100vw] overflow-hidden">
              <div className="fixed top-0 z-50 w-full">
                <Navbar />
              </div>
              <div className="md:pt-[133.453px] pt-[96.453px]">{children}</div>

              <Footer />
            </div>
            {/* <ScrollToTopButton /> */}
            <Toaster />
          </>
        </ReduxProvider>
      </NextUiProvider>
    </div>
  );
}
