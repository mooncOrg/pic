import type { Metadata } from "next";
import "./globals.css";
import { AdminProvider } from "@/context/AdminContext";

export const metadata: Metadata = {
  title: "Pic",
  description: "Pic Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AdminProvider>
          {children}
        </AdminProvider>
      </body>
    </html>
  );
}
