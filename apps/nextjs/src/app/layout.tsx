import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { cn } from "@unithrift/ui";
import { ThemeProvider, ThemeToggle } from "@unithrift/ui/theme";
import { Toaster } from "@unithrift/ui/toast";

import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";

import "~/app/styles.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://unithrift.vercel.app"
      : "http://localhost:3000",
  ),
  title: "Unithrift - Preloved items you can actually afford!",
  description: "Sell & buy secondhand/preloved items as an active Uni Student.",
  openGraph: {
    title: "Unithrift - Preloved items you can actually afford!",
    description:
      "Sell & buy secondhand/preloved items as an active Uni Student.",
    url: "https://unithrift.vercel.app",
    siteName: "Unithrift - Preloved items you can actually afford!",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <ThemeProvider>
          <NuqsAdapter>
            <TRPCReactProvider>{props.children}</TRPCReactProvider>
            <div className="absolute right-4 bottom-4">
              <ThemeToggle />
            </div>
          </NuqsAdapter>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
