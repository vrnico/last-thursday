// Last Thursday // Videos API
// GET  /api/videos   // list videos
// POST /api/videos   // add a video

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllVideos, addVideo, deleteVideo, getVideo } from "@/lib/db"
import { isModerator } from "@/lib/permissions"

// GET // list all videos
export async function GET() {
  const videos = await getAllVideos()
  return NextResponse.json(videos)
}

// POST // add a video
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = (session?.user as any) || null

  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  // Only moderators and admins can add videos
  if (!isModerator(user)) {
    return NextResponse.json({ error: "Only moderators can add videos" }, { status: 403 })
  }

  const body = await req.json()

  if (!body.url || !body.title) {
    return NextResponse.json({ error: "URL and title are required" }, { status: 400 })
  }

  if (!/^https?:\/\//i.test(body.url)) {
    return NextResponse.json({ error: "URL must start with http:// or https://" }, { status: 400 })
  }

  const video = await addVideo({
    url: body.url,
    title: body.title,
    project_id: body.project_id || null,
    added_by: user.id,
  })

  return NextResponse.json(video, { status: 201 })
}

// DELETE // remove a video
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = (session?.user as any) || null

  if (!user || !isModerator(user)) {
    return NextResponse.json({ error: "Only moderators can delete videos" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const id = parseInt(searchParams.get("id") || "0")

  if (!id) {
    return NextResponse.json({ error: "Video ID required" }, { status: 400 })
  }

  const video = await getVideo(id)
  if (!video) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await deleteVideo(id)
  return NextResponse.json({ deleted: true })
}
