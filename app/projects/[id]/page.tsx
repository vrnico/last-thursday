// Last Thursday // Project Detail Page
// Shows a single project with all its info, edit/delete/approve buttons

export const dynamic = "force-dynamic"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getProject } from "@/lib/db"
import { canEditProject, canApprove, canViewProject } from "@/lib/permissions"
import { notFound } from "next/navigation"
import Link from "next/link"
import ProjectActions from "./ProjectActions"

type Props = { params: { id: string } }

// Extract YouTube embed ID from various URL formats
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return `https://www.youtube.com/embed/${match[1]}`
  }
  return null
}

export default async function ProjectDetailPage({ params }: Props) {
  const id = parseInt(params.id)
  const project = await getProject(id)

  if (!project) notFound()

  const session = await getServerSession(authOptions)
  const user = (session?.user as any) || null

  if (!canViewProject(user, project)) notFound()

  const showEdit = user && canEditProject(user, project)
  const showApprove = user && canApprove(user) && project.status === "draft"
  const embedUrl = getYouTubeEmbedUrl(project.youtube_url || "")

  return (
    <section className="project-detail">
      <nav className="detail-nav">
        <Link href="/" className="back-btn">&larr; All Projects</Link>
      </nav>

      <div className="detail-header">
        <div className="detail-meta">
          <span className="detail-week">Week {project.week}</span>
          {project.status === "draft" && (
            <span className="detail-draft-badge">Draft</span>
          )}
        </div>
        <h2>{project.title}</h2>
        <p className="detail-description">{project.description}</p>
        <div className="detail-author">
          {project.avatar_url && (
            <img src={project.avatar_url} alt="" className="detail-author-avatar" />
          )}
          <span>by {project.username}</span>
        </div>
      </div>

      {(showEdit || showApprove) && (
        <ProjectActions
          projectId={project.id}
          showEdit={!!showEdit}
          showApprove={!!showApprove}
        />
      )}

      {embedUrl && (
        <div className="video-section">
          <h3>Video</h3>
          <div className="video-embed">
            <iframe
              src={embedUrl}
              title={`${project.title} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <div className="detail-body">
        {project.readme ? (
          <div className="readme-content">
            <h3>README</h3>
            <pre className="readme-text">{project.readme}</pre>
          </div>
        ) : (
          <div className="readme-content">
            <p className="text-muted">No README content yet.</p>
          </div>
        )}

        <div className="detail-sidebar">
          {project.tags && project.tags.length > 0 && (
            <div className="sidebar-section">
              <h4>Tags</h4>
              <div className="card-tags">
                {project.tags.map((tag: string) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {project.demo_url && /^https?:\/\//i.test(project.demo_url) && (
            <div className="sidebar-section">
              <h4>Demo</h4>
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="sidebar-link">
                Launch Demo &rarr;
              </a>
            </div>
          )}

          {project.repo_url && /^https?:\/\//i.test(project.repo_url) && (
            <div className="sidebar-section">
              <h4>Repository</h4>
              <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="sidebar-link">
                View on GitHub &rarr;
              </a>
            </div>
          )}

          {project.youtube_url && /^https?:\/\//i.test(project.youtube_url) && (
            <div className="sidebar-section">
              <h4>Video</h4>
              <a href={project.youtube_url} target="_blank" rel="noopener noreferrer" className="sidebar-link">
                Watch on YouTube &rarr;
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
