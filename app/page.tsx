// Last Thursday // Home Page
// Shows the project grid // server component for fast loading

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getPublishedProjects, getAllProjects, getUserDrafts } from "@/lib/db"
import ProjectCard from "@/components/ProjectCard"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const user = (session?.user as any) || null

  // Moderators see all projects. Everyone else sees published + their own drafts.
  let projects
  if (user?.role === "moderator") {
    projects = await getAllProjects()
  } else if (user) {
    const published = await getPublishedProjects()
    const drafts = await getUserDrafts(user.id)
    // Merge and deduplicate
    const ids = new Set(published.map((p: any) => p.id))
    projects = [...published, ...drafts.filter((d: any) => !ids.has(d.id))]
  } else {
    projects = await getPublishedProjects()
  }

  return (
    <section className="project-grid">
      <div className="grid-header">
        <h2>Projects</h2>
        <p>Everything we&apos;ve built, week by week.</p>
      </div>
      {projects.length === 0 ? (
        <div className="empty-state">
          <p>No projects yet. Sign in and create the first one.</p>
        </div>
      ) : (
        <div className="cards-container">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}
