// Last Thursday // Permission Checks
// Who can do what // role-based access control
// Roles: user < moderator < admin

// Is this user an admin?
export function isAdmin(user: any): boolean {
  return user?.role === "admin"
}

// Is this user at least a moderator?
export function isModerator(user: any): boolean {
  return user?.role === "moderator" || user?.role === "admin"
}

// Can this user edit this project?
// Moderators and admins can edit anything. Users can only edit their own.
export function canEditProject(user: any, project: any): boolean {
  if (isModerator(user)) return true
  return user.id === project.author_id
}

// Can this user delete this project?
// Same rules as editing.
export function canDeleteProject(user: any, project: any): boolean {
  if (isModerator(user)) return true
  return user.id === project.author_id
}

// Can this user approve/publish projects?
// Only moderators and admins.
export function canApprove(user: any): boolean {
  return isModerator(user)
}

// Can this user manage other users' roles?
// Only admins.
export function canManageUsers(user: any): boolean {
  return isAdmin(user)
}

// Can this user see this project?
// Published projects are visible to everyone.
// Drafts are visible to the author, moderators, and admins.
export function canViewProject(user: any, project: any): boolean {
  if (project.status === "published") return true
  if (!user) return false
  if (isModerator(user)) return true
  return user.id === project.author_id
}
