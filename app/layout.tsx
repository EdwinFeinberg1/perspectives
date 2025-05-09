import "./globals.css";
import { Inter } from "next/font/google";
import { ConversationsProvider } from "./context/ConversationsContext";
import { ThemeProvider } from "./features/theme";
import { Analytics } from "@vercel/analytics/next";
import { SafeArea } from "./components/SafeArea";

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
          <ThemeProvider>
            <SafeArea>{children}</SafeArea>
          </ThemeProvider>
        </ConversationsProvider>
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
