// Last Thursday // Edit Project Page
// Pre-populates the form with existing project data

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getProject } from "@/lib/db"
import { canEditProject } from "@/lib/permissions"
import { notFound, redirect } from "next/navigation"
import ProjectForm from "@/components/ProjectForm"

type Props = { params: { id: string } }

export default async function EditProjectPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/api/auth/signin")

  const user = (session.user as any)
  const id = parseInt(params.id)
  const project = await getProject(id)

  if (!project) notFound()
  if (!canEditProject(user, project)) notFound()

  return (
    <section className="form-page">
      <h2>Edit Project</h2>
      <p className="form-page-subtitle">Update {project.title}</p>
      <ProjectForm
        mode="edit"
        initial={{
          id: project.id,
          title: project.title,
          description: project.description,
          week: project.week,
          tags: project.tags || [],
          demo_url: project.demo_url || "",
          repo_url: project.repo_url || "",
          readme: project.readme || "",
        }}
      />
    </section>
  )
}
