-- Last Thursday // Database Schema
-- Run this in the Vercel Postgres dashboard to set up your tables

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  github_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  week INTEGER NOT NULL,
  tags TEXT[] DEFAULT '{}',
  demo_url TEXT DEFAULT '',
  repo_url TEXT DEFAULT '',
  readme TEXT DEFAULT '',
  author_id INTEGER REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
