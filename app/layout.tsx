import "./globals.css";
import { Inter } from "next/font/google";
import { ConversationsProvider } from "./context/ConversationsContext";

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
      <body className="min-h-screen w-full bg-slate-950 flex overflow-x-hidden">
        <ConversationsProvider>{children}</ConversationsProvider>
      </body>
    </html>
  );
};

export default RootLayout;
