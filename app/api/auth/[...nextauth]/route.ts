// Last Thursday // Auth Route Handler
// This single file handles /api/auth/signin, /api/auth/signout,
// /api/auth/callback, and /api/auth/session automatically.
// The [...nextauth] folder name is a catch-all route.

import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
