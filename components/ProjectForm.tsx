// Last Thursday // Project Form Component
// Shared form for creating and editing projects

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
  mode: "create" | "edit"
  initial?: {
    id?: number
    title: string
    description: string
    week: number
    tags: string[]
    demo_url: string
    repo_url: string
    youtube_url: string
    readme: string
  }
}

export default function ProjectForm({ mode, initial }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [title, setTitle] = useState(initial?.title || "")
  const [description, setDescription] = useState(initial?.description || "")
  const [week, setWeek] = useState(initial?.week || 1)
  const [tagsStr, setTagsStr] = useState((initial?.tags || []).join(", "))
  const [demoUrl, setDemoUrl] = useState(initial?.demo_url || "")
  const [repoUrl, setRepoUrl] = useState(initial?.repo_url || "")
  const [youtubeUrl, setYoutubeUrl] = useState(initial?.youtube_url || "")
  const [readme, setReadme] = useState(initial?.readme || "")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const body = {
      title,
      description,
      week,
      tags,
      demo_url: demoUrl,
      repo_url: repoUrl,
      youtube_url: youtubeUrl,
      readme,
    }

    const url = mode === "create" ? "/api/projects" : `/api/projects/${initial?.id}`
    const method = mode === "create" ? "POST" : "PUT"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Something went wrong")
      setSaving(false)
      return
    }

    const project = await res.json()
    router.push(`/projects/${project.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="project-form">
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="What did you build?"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="One or two sentences about the project"
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="week">Week</label>
          <input
            id="week"
            type="number"
            value={week}
            onChange={(e) => setWeek(parseInt(e.target.value))}
            min={1}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            type="text"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            placeholder="HTML, CSS, JavaScript"
          />
          <span className="form-hint">Comma-separated</span>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="demo_url">Demo URL</label>
          <input
            id="demo_url"
            type="url"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="repo_url">Repo URL</label>
          <input
            id="repo_url"
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/..."
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="youtube_url">YouTube Video</label>
        <input
          id="youtube_url"
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <span className="form-hint">Link to a class recording or demo video</span>
      </div>

      <div className="form-group">
        <label htmlFor="readme">README</label>
        <textarea
          id="readme"
          value={readme}
          onChange={(e) => setReadme(e.target.value)}
          placeholder="Detailed project description, setup instructions, etc."
          rows={8}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving
            ? "Saving..."
            : mode === "create"
              ? "Create Project"
              : "Save Changes"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
          Cancel
        </button>
      </div>

      {mode === "create" && (
        <p className="form-note">
          New projects start as drafts. A moderator will review and publish them.
        </p>
      )}
    </form>
  )
}
