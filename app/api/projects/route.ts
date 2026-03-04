// Last Thursday // Projects API
// GET  /api/projects   // list projects
// POST /api/projects   // create a new project

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getPublishedProjects, getAllProjects, getUserDrafts, createProject } from "@/lib/db"

// READ // get all projects
export async function GET() {
  const session = await getServerSession(authOptions)
  const user = (session?.user as any) || null

  // Moderators see everything. Regular users see published + their own drafts.
  let projects
  if (user?.role === "moderator") {
    projects = await getAllProjects()
  } else {
    const published = await getPublishedProjects()
    const drafts = user ? await getUserDrafts(user.id) : []
    projects = [...drafts, ...published]
  }

  return NextResponse.json(projects)
}

// CREATE // make a new project
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = (session?.user as any) || null

  // Must be logged in
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  const body = await req.json()

  // Validate required fields
  if (!body.title || !body.description || !body.week) {
    return NextResponse.json(
      { error: "Title, description, and week are required" },
      { status: 400 }
    )
  }

  // Validate URLs // only allow http:// and https://
  const demoUrl = body.demo_url || ""
  const repoUrl = body.repo_url || ""
  if (demoUrl && !/^https?:\/\//i.test(demoUrl)) {
    return NextResponse.json({ error: "Demo URL must start with http:// or https://" }, { status: 400 })
  }
  if (repoUrl && !/^https?:\/\//i.test(repoUrl)) {
    return NextResponse.json({ error: "Repo URL must start with http:// or https://" }, { status: 400 })
  }

  const project = await createProject({
    title: body.title,
    description: body.description,
    week: body.week,
    tags: body.tags || [],
    demo_url: demoUrl,
    repo_url: repoUrl,
    readme: body.readme || "",
    author_id: user.id,
  })

  return NextResponse.json(project, { status: 201 })
}
