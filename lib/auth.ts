// Last Thursday // Auth Configuration
// Handles GitHub OAuth via NextAuth (Auth.js v4)

import type { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import { sql } from "@vercel/postgres"

// The admin username // gets auto-promoted on login
const ADMIN_USERNAME = "VRNico"

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    // When a user signs in, upsert them in our database
    async signIn({ user, profile }) {
      const ghProfile = profile as any
      const username = ghProfile.login

      // Auto-assign admin role to VRNico
      const role = username === ADMIN_USERNAME ? "admin" : "user"

      await sql`
        INSERT INTO users (github_id, username, avatar_url, role)
        VALUES (${String(ghProfile.id)}, ${username}, ${user.image}, ${role})
        ON CONFLICT (github_id) DO UPDATE SET
          username = EXCLUDED.username,
          avatar_url = EXCLUDED.avatar_url,
          role = CASE
            WHEN EXCLUDED.username = ${ADMIN_USERNAME} THEN 'admin'
            ELSE users.role
          END
      `
      return true
    },

    // Store the github_id in the JWT token so we can look up the user later
    async jwt({ token, profile }) {
      if (profile) {
        token.github_id = String((profile as any).id)
      }
      return token
    },

    // Attach our database user info (id, role) to the session
    async session({ session, token }) {
      if (token.github_id) {
        const result = await sql`
          SELECT id, role, username FROM users WHERE github_id = ${token.github_id as string}
        `
        if (result.rows[0]) {
          ;(session.user as any).id = result.rows[0].id
          ;(session.user as any).role = result.rows[0].role
          ;(session.user as any).username = result.rows[0].username
        }
      }
      return session
    },
  },
}
