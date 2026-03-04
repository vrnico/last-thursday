// Last Thursday // New Project Page
// Form to create a new project // must be logged in

export const dynamic = "force-dynamic"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import ProjectForm from "@/components/ProjectForm"

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions)

  // Not logged in? Send them to sign in.
  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <section className="form-page">
      <h2>New Project</h2>
      <p className="form-page-subtitle">Add a project to the archive</p>
      <ProjectForm mode="create" />
    </section>
  )
}
