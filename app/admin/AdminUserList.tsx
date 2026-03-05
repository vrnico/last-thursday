// Last Thursday // Admin User List
// Client component for managing user roles

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: number
  username: string
  avatar_url: string
  role: string
  created_at: string
}

type Props = {
  users: User[]
  currentUserId: number
}

export default function AdminUserList({ users, currentUserId }: Props) {
  const router = useRouter()
  const [updating, setUpdating] = useState<number | null>(null)

  async function toggleRole(userId: number, currentRole: string) {
    setUpdating(userId)
    const newRole = currentRole === "moderator" ? "user" : "moderator"

    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    })

    if (res.ok) {
      router.refresh()
    }
    setUpdating(null)
  }

  return (
    <div className="admin-user-list">
      {users.map((u) => (
        <div key={u.id} className="admin-user-card">
          <div className="admin-user-info">
            {u.avatar_url && (
              <img src={u.avatar_url} alt="" className="admin-user-avatar" />
            )}
            <div>
              <span className="admin-user-name">{u.username}</span>
              <span className={`role-badge role-${u.role}`}>{u.role}</span>
            </div>
          </div>
          <div className="admin-user-actions">
            {u.id === currentUserId ? (
              <span className="admin-you-badge">You</span>
            ) : u.role === "admin" ? (
              <span className="admin-protected">Protected</span>
            ) : (
              <button
                onClick={() => toggleRole(u.id, u.role)}
                className={`btn ${u.role === "moderator" ? "btn-danger" : "btn-approve"}`}
                disabled={updating === u.id}
              >
                {updating === u.id
                  ? "..."
                  : u.role === "moderator"
                    ? "Remove Mod"
                    : "Make Mod"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
