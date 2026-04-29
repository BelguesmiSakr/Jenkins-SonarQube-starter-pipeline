// app/layout.tsx

import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        {/* NAVBAR */}
        <nav className="bg-white shadow p-4 flex justify-between">
          <h1 className="font-bold text-xl">Crisis View</h1>

          <div className="flex gap-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/admin" className="hover:underline">
              Dashboard
            </Link>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}