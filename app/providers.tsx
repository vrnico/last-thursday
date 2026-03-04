// Last Thursday // Session Provider
// Wraps the app so any component can access the user's session

"use client"

import { SessionProvider } from "next-auth/react"

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
