// Last Thursday // Permission Checks
// Who can do what // role-based access control

// Can this user edit this project?
// Moderators can edit anything. Users can only edit their own.
export function canEditProject(user: any, project: any): boolean {
  if (user.role === "moderator") return true
  return user.id === project.author_id
}

// Can this user delete this project?
// Same rules as editing.
export function canDeleteProject(user: any, project: any): boolean {
  if (user.role === "moderator") return true
  return user.id === project.author_id
}

// Can this user approve/publish projects?
// Only moderators.
export function canApprove(user: any): boolean {
  return user.role === "moderator"
}

// Can this user see this project?
// Published projects are visible to everyone.
// Drafts are visible to the author and moderators.
export function canViewProject(user: any, project: any): boolean {
  if (project.status === "published") return true
  if (!user) return false
  if (user.role === "moderator") return true
  return user.id === project.author_id
}
