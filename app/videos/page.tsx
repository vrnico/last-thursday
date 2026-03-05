// Last Thursday // Videos Page
// Shows all videos // standalone and project-linked

export const dynamic = "force-dynamic"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllVideos } from "@/lib/db"
import { isModerator } from "@/lib/permissions"
import Link from "next/link"
import AddVideoForm from "./AddVideoForm"
import VideoGrid from "./VideoGrid"

export default async function VideosPage() {
  const session = await getServerSession(authOptions)
  const user = (session?.user as any) || null
  const videos = await getAllVideos()
  const canManage = user && isModerator(user)

  return (
    <section className="videos-page">
      <div className="grid-header">
        <h2>Videos</h2>
        <p>Class recordings, demos, and walkthroughs.</p>
      </div>

      {canManage && <AddVideoForm />}

      <VideoGrid videos={videos as any} canManage={!!canManage} />
    </section>
  )
}
