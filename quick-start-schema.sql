-- QUICK START SCHEMA - Minimal setup for Izzy Reads
-- Copy this entire file and paste into Supabase SQL Editor

-- Books Table
CREATE TABLE books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  isbn TEXT,
  genre TEXT,
  page_count INTEGER,
  description TEXT,
  age_rating TEXT,
  date_added DATE DEFAULT CURRENT_DATE,
  date_read DATE,
  rating INTEGER,
  is_read BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view all books" ON books FOR SELECT USING (true);
CREATE POLICY "Users manage own books" ON books FOR ALL USING (auth.uid() = user_id);

-- Poems Table
CREATE TABLE poems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  emoji TEXT DEFAULT '✨',
  date_created TIMESTAMP DEFAULT NOW(),
  likes INTEGER DEFAULT 0,
  template TEXT
);

ALTER TABLE poems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view poems" ON poems FOR SELECT USING (true);
CREATE POLICY "Users manage own poems" ON poems FOR ALL USING (auth.uid() = user_id);

-- Blog Posts Table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT NOW(),
  date_modified TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'draft',
  parent_approved BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  emoji TEXT
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Users view own posts" ON blog_posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own posts" ON blog_posts FOR ALL USING (auth.uid() = user_id);

-- Done! Now you can use the app with authentication.
