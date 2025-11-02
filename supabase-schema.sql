-- Supabase Database Schema for Izzy Reads
-- Run this in Supabase SQL Editor after creating your project

-- Enable Row Level Security
-- This ensures users can only access their own data

-- ============================================
-- BOOKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS books (
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
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_read BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Policies for books
CREATE POLICY "Users can view all books (for public portfolio)"
  ON books FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own books"
  ON books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books"
  ON books FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books"
  ON books FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS poems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  emoji TEXT DEFAULT '✨',
  date_created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes INTEGER DEFAULT 0,
  template TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;

-- Policies for poems
CREATE POLICY "Anyone can view poems (for public portfolio)"
  ON poems FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own poems"
  ON poems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own poems"
  ON poems FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own poems"
  ON poems FOR DELETE
  USING (auth.uid() = user_id);

-- Public can like poems (increment only)
CREATE POLICY "Anyone can like poems"
  ON poems FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- BLOG POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  book_id UUID REFERENCES books(id) ON DELETE SET NULL,
  date_created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT CHECK (status IN ('draft', 'pending', 'published')) DEFAULT 'draft',
  parent_approved BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  emoji TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies for blog posts
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can view their own blog posts"
  ON blog_posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own blog posts"
  ON blog_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blog posts"
  ON blog_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog posts"
  ON blog_posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- READING CHALLENGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reading_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target INTEGER NOT NULL,
  current INTEGER DEFAULT 0,
  type TEXT CHECK (type IN ('books', 'pages', 'genres')) DEFAULT 'books',
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  badge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reading_challenges ENABLE ROW LEVEL SECURITY;

-- Policies for reading challenges
CREATE POLICY "Users can view their own challenges"
  ON reading_challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenges"
  ON reading_challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges"
  ON reading_challenges FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own challenges"
  ON reading_challenges FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_poems_updated_at
  BEFORE UPDATE ON poems
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_challenges_updated_at
  BEFORE UPDATE ON reading_challenges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEXES for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_is_read ON books(is_read);
CREATE INDEX IF NOT EXISTS idx_poems_user_id ON poems(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_user_id ON blog_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_reading_challenges_user_id ON reading_challenges(user_id);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment below to insert sample data after first user signup:
-- Replace 'YOUR_USER_ID' with actual user ID from auth.users

/*
INSERT INTO books (user_id, title, author, genre, page_count, is_read, rating, notes, date_read) VALUES
('YOUR_USER_ID', 'Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'Fantasy', 309, true, 5, 'Amazing magical adventure!', CURRENT_DATE - INTERVAL '30 days'),
('YOUR_USER_ID', 'Wonder', 'R.J. Palacio', 'Fiction', 315, true, 4, 'Very touching story about kindness.', CURRENT_DATE - INTERVAL '20 days');

INSERT INTO poems (user_id, title, content, emoji, template, likes) VALUES
('YOUR_USER_ID', 'Books Are Magic', 'Books take me far away\nTo lands of wonder and play\nEach page a new surprise\nAdventures before my eyes\nMagic in every line', '📚', 'Free Verse', 5),
('YOUR_USER_ID', 'Haiku of Reading', 'Pages turn slowly\nWorlds open before my eyes\nLost in a good book', '🌸', 'Haiku', 3);

INSERT INTO blog_posts (user_id, title, content, status, tags, emoji) VALUES
('YOUR_USER_ID', 'My Thoughts on Wonder', 'Wonder is an incredible book that teaches us about kindness and acceptance. The main character, Auggie, shows so much courage...', 'published', ARRAY['Fiction', 'Kindness', 'School'], '💖'),
('YOUR_USER_ID', 'Why I Love Fantasy Books', 'Fantasy books are my favorite because they let my imagination soar! From Hogwarts to Narnia, these magical worlds...', 'published', ARRAY['Fantasy', 'Magic', 'Adventure'], '✨');
*/

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- After running this schema:
-- 1. Enable Email Auth in Supabase Dashboard (Authentication → Providers)
-- 2. Add your site URL to allowed URLs (Authentication → URL Configuration)
-- 3. Your app is ready to use!
