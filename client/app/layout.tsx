import "./globals.css";
import ContextProvider from "@/providers/ContextProvider";
import { Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OliveWork",
  description: "Забезпечує найкращі умови для роботи та розвитку кожного співробітника",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Або якщо це PNG */}
        <link rel="icon" href="/logo-main.png" type="image/png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${roboto.className} antialiased`}>
        <Toaster position="top-center" />
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}