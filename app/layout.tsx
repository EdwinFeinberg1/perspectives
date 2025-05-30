import "./globals.css";
import { Inter } from "next/font/google";
import { Bricolage_Grotesque } from "next/font/google";
import { ConversationsProvider } from "./context/ConversationsContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { Analytics } from "@vercel/analytics/next";
import { SafeArea } from "./components/SafeArea";
import { ToastProvider } from "./components/ui/toast";
import { ThemeProvider } from "./providers/theme-provider";

// Keep Inter as fallback
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-fallback",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans", // Change to be the default font
});

export const metadata = {
  title: "Sephira",
  description:
    "It's for the seeker, the skeptic, the believer, and the curious.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

const RootLayout = ({ children }) => {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bricolageGrotesque.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-screen w-full bg-background text-foreground flex flex-col overflow-hidden overscroll-none font-[var(--font-sans)]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConversationsProvider>
            <FavoritesProvider>
              <ToastProvider>
                <SafeArea>{children}</SafeArea>
              </ToastProvider>
            </FavoritesProvider>
          </ConversationsProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
