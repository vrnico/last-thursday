// Last Thursday // Project Action Buttons
// Client component for edit, delete, and approve actions

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Props = {
  projectId: number
  showEdit: boolean
  showApprove: boolean
}

export default function ProjectActions({ projectId, showEdit, showApprove }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [approving, setApproving] = useState(false)

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true)
      return
    }

    const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" })
    if (res.ok) {
      router.push("/")
      router.refresh()
    }
  }

  async function handleApprove() {
    setApproving(true)
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published" }),
    })
    if (res.ok) {
      router.refresh()
    }
    setApproving(false)
  }

  return (
    <div className="project-actions">
      {showApprove && (
        <button onClick={handleApprove} className="btn btn-approve" disabled={approving}>
          {approving ? "Approving..." : "Approve & Publish"}
        </button>
      )}
      {showEdit && (
        <Link href={`/projects/${projectId}/edit`} className="btn btn-secondary">
          Edit
        </Link>
      )}
      {showEdit && (
        <button onClick={handleDelete} className="btn btn-danger">
          {confirming ? "Confirm delete?" : "Delete"}
        </button>
      )}
    </div>
  )
}
