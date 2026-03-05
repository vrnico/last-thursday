// Last Thursday // Admin Panel
// Manage user roles // admin only

export const dynamic = "force-dynamic"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllUsers } from "@/lib/db"
import { canManageUsers } from "@/lib/permissions"
import { redirect } from "next/navigation"
import AdminUserList from "./AdminUserList"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  const user = (session?.user as any) || null

  if (!user || !canManageUsers(user)) {
    redirect("/")
  }

  const users = await getAllUsers()

  return (
    <section className="admin-page">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <p>Manage user roles and permissions.</p>
      </div>
      <AdminUserList users={users as any} currentUserId={user.id} />
    </section>
  )
}
