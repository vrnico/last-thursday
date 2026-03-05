// Last Thursday // Root Layout
// Wraps every page with providers, global styles, and the header

import "./globals.css"
import Providers from "./providers"
import Header from "@/components/Header"

export const metadata = {
  title: "Last Thursday // Multiverse Schools",
  description: "Project archive for the Learn to Code class",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <footer className="site-footer">
            <p>
              Multiverse Schools &middot; Learn to Code &middot; 2026 &middot;{" "}
              <a
                href="https://github.com/VRNico/last-thursday"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
