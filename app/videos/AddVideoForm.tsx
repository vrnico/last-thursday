// Last Thursday // Add Video Form
// Client component for moderators/admins to add videos

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddVideoForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, title }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Something went wrong")
      setSaving(false)
      return
    }

    setUrl("")
    setTitle("")
    setOpen(false)
    setSaving(false)
    router.refresh()
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn btn-primary" style={{ marginBottom: "1.5rem" }}>
        + Add Video
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="add-video-form">
      {error && <div className="form-error">{error}</div>}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="video-title">Title</label>
          <input
            id="video-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Monday // Week 4 Intro"
          />
        </div>
        <div className="form-group">
          <label htmlFor="video-url">YouTube URL</label>
          <input
            id="video-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Adding..." : "Add Video"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  )
}
