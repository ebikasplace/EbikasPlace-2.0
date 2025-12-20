import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "Ebika's Place",
  description: "Where Style Meets Comfort"
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700 relative`}>
          {/* Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="fixed top-0 left-0 w-full h-full object-cover -z-50"
          >
            <source src="/videos/background.mp4" type="video/mp4" />
          </video>

          {/* Dark Overlay for Better Text Readability */}
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 -z-40" />

          <Toaster />
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
