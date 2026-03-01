import type { Metadata } from "next";
import "./globals.css";
import { isAuthenticated } from "@/lib/auth";
import LogoutButton from "@/components/logout-button";

export const metadata: Metadata = {
  title: "Sammlung Manager",
  description: "Zippo Collection Manager",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAuthenticated();

  return (
    <html lang="de" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold">🔥 Sammlung Manager</a>
            {authenticated && (
              <LogoutButton />
            )}
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
