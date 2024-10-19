import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Wallets Analysis App",
  description: "Bitfa test task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-w-[400px]"
      >
        {children}
      </body>
    </html>
  );
}
