// Last Thursday // Database Helpers
// Wraps @vercel/postgres for convenience

import { sql } from "@vercel/postgres"

// Fetch all published projects (what everyone sees)
export async function getPublishedProjects() {
  const result = await sql`
    SELECT p.*, u.username, u.avatar_url
    FROM projects p
    JOIN users u ON p.author_id = u.id
    WHERE p.status = 'published'
    ORDER BY p.week DESC, p.created_at DESC
  `
  return result.rows
}

// Fetch all projects including drafts (what moderators see)
export async function getAllProjects() {
  const result = await sql`
    SELECT p.*, u.username, u.avatar_url
    FROM projects p
    JOIN users u ON p.author_id = u.id
    ORDER BY p.week DESC, p.created_at DESC
  `
  return result.rows
}

// Fetch drafts by a specific user (what the author sees)
export async function getUserDrafts(userId: number) {
  const result = await sql`
    SELECT p.*, u.username, u.avatar_url
    FROM projects p
    JOIN users u ON p.author_id = u.id
    WHERE p.author_id = ${userId} AND p.status = 'draft'
    ORDER BY p.created_at DESC
  `
  return result.rows
}

// Fetch a single project by ID
export async function getProject(id: number) {
  const result = await sql`
    SELECT p.*, u.username, u.avatar_url
    FROM projects p
    JOIN users u ON p.author_id = u.id
    WHERE p.id = ${id}
  `
  return result.rows[0] || null
}

// Create a new project
export async function createProject(data: {
  title: string
  description: string
  week: number
  tags: string[]
  demo_url: string
  repo_url: string
  youtube_url: string
  readme: string
  author_id: number
}) {
  const result = await sql`
    INSERT INTO projects (title, description, week, tags, demo_url, repo_url, youtube_url, readme, author_id, status)
    VALUES (
      ${data.title},
      ${data.description},
      ${data.week},
      ${data.tags as any},
      ${data.demo_url},
      ${data.repo_url},
      ${data.youtube_url},
      ${data.readme},
      ${data.author_id},
      'draft'
    )
    RETURNING *
  `
  return result.rows[0]
}

// Update a project
export async function updateProject(
  id: number,
  data: {
    title?: string
    description?: string
    week?: number
    tags?: string[]
    demo_url?: string
    repo_url?: string
    youtube_url?: string
    readme?: string
    status?: string
  }
) {
  // Build SET clause from provided fields
  const result = await sql`
    UPDATE projects SET
      title = COALESCE(${data.title ?? null}, title),
      description = COALESCE(${data.description ?? null}, description),
      week = COALESCE(${data.week ?? null}, week),
      demo_url = COALESCE(${data.demo_url ?? null}, demo_url),
      repo_url = COALESCE(${data.repo_url ?? null}, repo_url),
      youtube_url = COALESCE(${data.youtube_url ?? null}, youtube_url),
      readme = COALESCE(${data.readme ?? null}, readme),
      status = COALESCE(${data.status ?? null}, status),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return result.rows[0]
}

// Delete a project
export async function deleteProject(id: number) {
  await sql`DELETE FROM projects WHERE id = ${id}`
}

// Get all users (for admin panel)
export async function getAllUsers() {
  const result = await sql`
    SELECT id, username, avatar_url, role, created_at
    FROM users
    ORDER BY created_at ASC
  `
  return result.rows
}

// Update a user's role
export async function updateUserRole(userId: number, role: string) {
  const result = await sql`
    UPDATE users SET role = ${role}
    WHERE id = ${userId}
    RETURNING id, username, avatar_url, role
  `
  return result.rows[0]
}
