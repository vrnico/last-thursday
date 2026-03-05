// Last Thursday // Users API
// GET  /api/users          // list all users (admin only)
// PUT  /api/users          // update a user's role (admin only)

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllUsers, updateUserRole } from "@/lib/db"
import { canManageUsers } from "@/lib/permissions"

// GET // list all users
export async function GET() {
  const session = await getServerSession(authOptions)
  const user = (session?.user as any) || null

  if (!user || !canManageUsers(user)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 })
  }

  const users = await getAllUsers()
  return NextResponse.json(users)
}

// PUT // update a user's role
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = (session?.user as any) || null

  if (!user || !canManageUsers(user)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 })
  }

  const body = await req.json()
  const { userId, role } = body

  if (!userId || !role) {
    return NextResponse.json({ error: "userId and role are required" }, { status: 400 })
  }

  // Only allow setting user or moderator // admin is auto-assigned
  if (!["user", "moderator"].includes(role)) {
    return NextResponse.json({ error: "Role must be 'user' or 'moderator'" }, { status: 400 })
  }

  // Don't allow demoting yourself
  if (userId === user.id) {
    return NextResponse.json({ error: "You cannot change your own role" }, { status: 400 })
  }

  const updated = await updateUserRole(userId, role)
  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json(updated)
}
