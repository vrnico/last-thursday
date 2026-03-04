// Last Thursday // Header Component
// Shows logo, nav, and sign in/out button with user avatar

"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"

export default function Header() {
  const { data: session, status } = useSession()
  const user = session?.user as any

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-left">
          <Link href="/" className="logo">
            <span className="logo-icon">&#9670;</span>
            <h1>Last Thursday</h1>
          </Link>
          <p className="tagline">Multiverse Schools // Learn to Code // Project Archive</p>
        </div>

        <div className="header-right">
          {status === "loading" ? (
            <span className="auth-loading">...</span>
          ) : session ? (
            <div className="user-menu">
              <Link href="/projects/new" className="new-project-btn">
                + New Project
              </Link>
              <div className="user-info">
                {user?.image && (
                  <img src={user.image} alt="" className="user-avatar" />
                )}
                <span className="user-name">{user?.username || user?.name}</span>
                {user?.role === "moderator" && (
                  <span className="role-badge">mod</span>
                )}
              </div>
              <button onClick={() => signOut()} className="auth-btn sign-out">
                Sign out
              </button>
            </div>
          ) : (
            <button onClick={() => signIn("github")} className="auth-btn sign-in">
              Sign in with GitHub
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
