// Last Thursday // Project Videos
// Client component for displaying and adding videos to a project

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Video = {
  id: number
  url: string
  title: string
  username: string
}

type Props = {
  projectId: number
  videos: Video[]
  canManage: boolean
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export default function ProjectVideos({ projectId, videos, canManage }: Props) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [activeVideo, setActiveVideo] = useState(0)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, title, project_id: projectId }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Something went wrong")
      setSaving(false)
      return
    }

    setUrl("")
    setTitle("")
    setAdding(false)
    setSaving(false)
    router.refresh()
  }

  async function handleDelete(id: number) {
    if (deleting === id) {
      const res = await fetch(`/api/videos?id=${id}`, { method: "DELETE" })
      if (res.ok) router.refresh()
      setDeleting(null)
    } else {
      setDeleting(id)
    }
  }

  if (videos.length === 0 && !canManage) return null

  const currentVideo = videos[activeVideo]
  const embedUrl = currentVideo ? getYouTubeEmbedUrl(currentVideo.url) : null

  return (
    <div className="video-section">
      <div className="video-section-header">
        <h3>Videos ({videos.length})</h3>
        {canManage && !adding && (
          <button onClick={() => setAdding(true)} className="btn btn-secondary btn-sm">
            + Add Video
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="add-video-inline">
          {error && <div className="form-error">{error}</div>}
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Video title"
              />
            </div>
            <div className="form-group">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? "Adding..." : "Add"}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {videos.length > 0 && (
        <>
          {embedUrl && (
            <div className="video-embed">
              <iframe
                src={embedUrl}
                title={currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {videos.length > 1 && (
            <div className="video-tabs">
              {videos.map((v, i) => (
                <button
                  key={v.id}
                  className={`video-tab ${i === activeVideo ? "active" : ""}`}
                  onClick={() => setActiveVideo(i)}
                >
                  {v.title}
                </button>
              ))}
            </div>
          )}

          {videos.length === 1 && (
            <div className="video-single-title">
              <span>{currentVideo.title}</span>
              <a href={currentVideo.url} target="_blank" rel="noopener noreferrer" className="sidebar-link">
                Watch on YouTube &rarr;
              </a>
            </div>
          )}

          {canManage && (
            <div className="video-manage-list">
              {videos.map((v) => (
                <div key={v.id} className="video-manage-item">
                  <span>{v.title}</span>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="btn btn-danger btn-sm"
                  >
                    {deleting === v.id ? "Confirm?" : "Remove"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
