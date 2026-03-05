// Last Thursday // Video Grid
// Client component for displaying and managing videos

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Video = {
  id: number
  url: string
  title: string
  project_id: number | null
  project_title: string | null
  username: string
  created_at: string
}

type Props = {
  videos: Video[]
  canManage: boolean
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null
}

export default function VideoGrid({ videos, canManage }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<number | null>(null)
  const [playing, setPlaying] = useState<number | null>(null)

  async function handleDelete(id: number) {
    if (deleting === id) {
      // Confirmed
      const res = await fetch(`/api/videos?id=${id}`, { method: "DELETE" })
      if (res.ok) router.refresh()
      setDeleting(null)
    } else {
      setDeleting(id)
    }
  }

  // Separate standalone and project-linked
  const standalone = videos.filter((v) => !v.project_id)
  const projectLinked = videos.filter((v) => v.project_id)

  // Group project-linked by project
  const byProject: Record<string, Video[]> = {}
  for (const v of projectLinked) {
    const key = v.project_title || `Project ${v.project_id}`
    if (!byProject[key]) byProject[key] = []
    byProject[key].push(v)
  }

  return (
    <div className="video-grid-sections">
      {standalone.length > 0 && (
        <div className="video-grid-section">
          <h3>General</h3>
          <div className="video-grid">
            {standalone.map((v) => {
              const embedUrl = getYouTubeEmbedUrl(v.url)
              const thumb = getYouTubeThumbnail(v.url)
              return (
                <div key={v.id} className="video-card">
                  {playing === v.id && embedUrl ? (
                    <div className="video-embed">
                      <iframe
                        src={embedUrl + "?autoplay=1"}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="video-thumb" onClick={() => setPlaying(v.id)}>
                      {thumb ? (
                        <img src={thumb} alt={v.title} />
                      ) : (
                        <div className="video-thumb-placeholder">&#9654;</div>
                      )}
                      <span className="video-play-icon">&#9654;</span>
                    </div>
                  )}
                  <div className="video-card-info">
                    <h4>{v.title}</h4>
                    <span className="video-card-meta">Added by {v.username}</span>
                  </div>
                  {canManage && (
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="btn btn-danger video-delete-btn"
                    >
                      {deleting === v.id ? "Confirm?" : "Delete"}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {Object.entries(byProject).map(([projectTitle, vids]) => (
        <div key={projectTitle} className="video-grid-section">
          <h3>{projectTitle}</h3>
          <div className="video-grid">
            {vids.map((v) => {
              const embedUrl = getYouTubeEmbedUrl(v.url)
              const thumb = getYouTubeThumbnail(v.url)
              return (
                <div key={v.id} className="video-card">
                  {playing === v.id && embedUrl ? (
                    <div className="video-embed">
                      <iframe
                        src={embedUrl + "?autoplay=1"}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="video-thumb" onClick={() => setPlaying(v.id)}>
                      {thumb ? (
                        <img src={thumb} alt={v.title} />
                      ) : (
                        <div className="video-thumb-placeholder">&#9654;</div>
                      )}
                      <span className="video-play-icon">&#9654;</span>
                    </div>
                  )}
                  <div className="video-card-info">
                    <h4>{v.title}</h4>
                    <span className="video-card-meta">Added by {v.username}</span>
                  </div>
                  {canManage && (
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="btn btn-danger video-delete-btn"
                    >
                      {deleting === v.id ? "Confirm?" : "Delete"}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {videos.length === 0 && (
        <div className="empty-state">
          <p>No videos yet.</p>
        </div>
      )}
    </div>
  )
}
