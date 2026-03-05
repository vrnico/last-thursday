// Last Thursday // Header Component
// Shows logo, nav, GitHub link, and sign in/out button with user avatar

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
          <a
            href="https://github.com/VRNico/last-thursday"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            title="View on GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>

          <Link href="/videos" className="nav-link">
            Videos
          </Link>

          {status === "loading" ? (
            <span className="auth-loading">...</span>
          ) : session ? (
            <div className="user-menu">
              <Link href="/projects/new" className="new-project-btn">
                + New Project
              </Link>
              {(user?.role === "admin") && (
                <Link href="/admin" className="admin-link">
                  Admin
                </Link>
              )}
              <div className="user-info">
                {user?.image && (
                  <img src={user.image} alt="" className="user-avatar" />
                )}
                <span className="user-name">{user?.username || user?.name}</span>
                {user?.role === "moderator" && (
                  <span className="role-badge">mod</span>
                )}
                {user?.role === "admin" && (
                  <span className="role-badge role-admin">admin</span>
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
