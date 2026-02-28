import type { Metadata } from "next";
import "./globals.css";
import { isAuthenticated } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sammlung Manager",
  description: "Zippo Collection Manager",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAuthenticated();

  return (
    <html lang="de" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold">🔥 Sammlung Manager</a>
            {authenticated && (
              <div className="flex items-center gap-4">
                <form action="/api/auth/signout" method="POST">
                  <button type="submit" className="text-sm text-muted-foreground hover:text-foreground">
                    Abmelden
                  </button>
                </form>
              </div>
            )}
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
