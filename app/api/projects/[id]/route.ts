// Last Thursday // Single Project API
// GET    /api/projects/[id]   // get one project
// PUT    /api/projects/[id]   // update a project
// DELETE /api/projects/[id]   // delete a project

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getProject, updateProject, deleteProject } from "@/lib/db"
import { canEditProject, canDeleteProject, canApprove, canViewProject } from "@/lib/permissions"

type Params = { params: { id: string } }

// READ // get a single project
export async function GET(_req: NextRequest, { params }: Params) {
  const id = parseInt(params.id)
  const project = await getProject(id)

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const session = await getServerSession(authOptions)
  const user = (session?.user as any) || null

  if (!canViewProject(user, project)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(project)
}

// UPDATE // edit a project
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  const user = (session?.user as any) || null

  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  const id = parseInt(params.id)
  const project = await getProject(id)

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json()

  // If they're trying to change status, they need moderator permissions
  if (body.status && body.status !== project.status) {
    if (!canApprove(user)) {
      return NextResponse.json({ error: "Only moderators can change project status" }, { status: 403 })
    }
  }

  // For other edits, check edit permissions
  if (!canEditProject(user, project)) {
    return NextResponse.json({ error: "You can only edit your own projects" }, { status: 403 })
  }

  // Validate URLs if provided
  if (body.demo_url && !/^https?:\/\//i.test(body.demo_url)) {
    return NextResponse.json({ error: "Demo URL must start with http:// or https://" }, { status: 400 })
  }
  if (body.repo_url && !/^https?:\/\//i.test(body.repo_url)) {
    return NextResponse.json({ error: "Repo URL must start with http:// or https://" }, { status: 400 })
  }

  // Whitelist allowed fields
  const allowed: any = {}
  for (const key of ["title", "description", "week", "tags", "demo_url", "repo_url", "readme", "status"]) {
    if (body[key] !== undefined) allowed[key] = body[key]
  }

  const updated = await updateProject(id, allowed)
  return NextResponse.json(updated)
}

// DELETE // remove a project
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  const user = (session?.user as any) || null

  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  const id = parseInt(params.id)
  const project = await getProject(id)

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (!canDeleteProject(user, project)) {
    return NextResponse.json({ error: "You can only delete your own projects" }, { status: 403 })
  }

  await deleteProject(id)
  return NextResponse.json({ deleted: true })
}
