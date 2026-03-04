// Last Thursday // Project Card Component
// Displays a project in the grid with status indicator

import Link from "next/link"

type Props = {
  project: {
    id: number
    title: string
    description: string
    week: number
    tags: string[]
    status: string
    username: string
    avatar_url: string
    demo_url: string
  }
}

export default function ProjectCard({ project }: Props) {
  const isDraft = project.status === "draft"

  return (
    <Link href={`/projects/${project.id}`} className="project-card">
      <span
        className={`card-status ${isDraft ? "is-draft" : "is-published"}`}
        title={isDraft ? "Draft // pending approval" : "Published"}
      />
      {isDraft && <span className="draft-label">Draft</span>}
      <span className="card-week">Week {project.week}</span>
      <h3 className="card-title">{project.title}</h3>
      <p className="card-description">{project.description}</p>
      <div className="card-tags">
        {(project.tags || []).map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
      <div className="card-author">
        {project.avatar_url && (
          <img src={project.avatar_url} alt="" className="card-author-avatar" />
        )}
        <span className="card-author-name">{project.username}</span>
      </div>
    </Link>
  )
}
