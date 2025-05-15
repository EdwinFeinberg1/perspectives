import "./globals.css";
import { Inter } from "next/font/google";
import { ConversationsProvider } from "./context/ConversationsContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider } from "./features/theme";
import { Analytics } from "@vercel/analytics/next";
import { SafeArea } from "./components/SafeArea";
import { ToastProvider } from "./components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Sephira",
  description:
    "It's for the seeker, the skeptic, the believer, and the curious.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" className={`${inter.variable} font-sans h-full`}>
      <body className="min-h-screen w-full bg-slate-950 flex flex-col overflow-hidden overscroll-none">
        <ConversationsProvider>
          <FavoritesProvider>
            <ThemeProvider>
              <ToastProvider>
                <SafeArea>{children}</SafeArea>
              </ToastProvider>
            </ThemeProvider>
          </FavoritesProvider>
        </ConversationsProvider>
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
