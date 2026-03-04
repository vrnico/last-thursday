# Last Thursday

Project archive for the [Multiverse Schools](https://themultiverse.school) Learn to Code class. Students log in with GitHub, submit projects each week, and moderators approve them for the public site.

**Live:** [last-thursday.vercel.app](https://last-thursday.vercel.app)

## Stack

- **Next.js 14** // app router, server components, API routes
- **Auth.js (NextAuth v4)** // GitHub OAuth
- **Vercel Postgres (Neon)** // SQL database
- **Vercel** // deploy

## Features

- GitHub OAuth login // no passwords to manage
- Full CRUD // create, read, update, delete projects
- Draft/publish workflow // new projects start as drafts, moderators approve
- Role-based access // users edit their own, moderators edit anything
- Server-side rendering // data fetched on the server, no loading spinners

## Project Structure

```
app/
  layout.tsx              # root layout with session provider
  page.tsx                # home page // project grid
  api/
    auth/[...nextauth]/   # GitHub OAuth handler
    projects/             # CRUD endpoints (GET, POST, PUT, DELETE)
  projects/
    [id]/page.tsx          # project detail view
    [id]/edit/page.tsx     # edit form
    new/page.tsx           # create form
lib/
  auth.ts                 # Auth.js config + callbacks
  db.ts                   # SQL queries
  permissions.ts          # role checks (canEdit, canApprove, canView)
components/
  Header.tsx              # nav + auth UI
  ProjectCard.tsx         # card in the grid
  ProjectForm.tsx         # shared create/edit form
```

## Setup

1. Clone the repo
2. Copy `.env.local.example` to `.env.local`
3. Create a GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers)
   - Callback URL: `http://localhost:3000/api/auth/callback/github`
4. Create a Vercel Postgres (Neon) database and add the connection string
5. Generate an auth secret: `openssl rand -base64 32`
6. Fill in `.env.local`:
   ```
   GITHUB_ID=...
   GITHUB_SECRET=...
   NEXTAUTH_SECRET=...
   POSTGRES_URL=...
   ```
7. Run the schema:
   ```sql
   -- paste contents of schema.sql into Neon dashboard
   ```
8. Install and run:
   ```
   npm install
   npm run dev
   ```

## Deploy to Vercel

1. Push to GitHub
2. Import in [vercel.com/new](https://vercel.com/new)
3. Add environment variables in the Vercel dashboard
4. Connect a Postgres database from the Storage tab
5. Run `schema.sql` in the Neon query console
6. Deploy

## Roles

| Role | Can do |
|------|--------|
| **user** | Create projects (as drafts), edit/delete own projects |
| **moderator** | Everything above + approve drafts, edit/delete any project |

To promote a user to moderator, update their role in the database:
```sql
UPDATE users SET role = 'moderator' WHERE username = 'their-github-username';
```

## Class Context

This is the Week 4 project for Learn to Code. The repo includes:
- `day3-start.html` // the static version from before we went full stack
- `css/` and `js/` // original static site assets
- `schema.sql` // database table definitions

Built at [Multiverse Schools](https://themultiverse.school) // 2026.
