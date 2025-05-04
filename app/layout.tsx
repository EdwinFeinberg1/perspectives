import "./globals.css";
import { Inter } from "next/font/google";
import { ConversationsProvider } from "./context/ConversationsContext";
import { ThemeProvider } from "./features/theme";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Perspectives.ai",
  description:
    "It's for the seeker, the skeptic, the believer, and the curious.",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" className={`${inter.variable} font-sans h-full`}>
      <body className="min-h-screen w-full bg-slate-950 flex flex-col overflow-hidden">
        <ConversationsProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ConversationsProvider>
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
