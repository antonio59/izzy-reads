# Izzy Reads - Quick Setup Guide

## ✅ What's Already Done

- ✅ Tailwind CSS configured (UI should look beautiful now!)
- ✅ Supabase client ready to connect
- ✅ Keep-alive GitHub Actions workflow created
- ✅ All features implemented (3D bookshelf, book search, poems)

---

## 🔧 What You Need To Do

### 1. Set Up Your Supabase Project (5 minutes)

1. **Go to** [supabase.com](https://supabase.com) and sign in
2. **Click** "New Project"
3. **Name it** something like "izzy-reads"
4. **Choose** a database password (save it somewhere safe)
5. **Select** a region close to you
6. **Wait** for the project to be created (~2 minutes)

### 2. Get Your Supabase Credentials

Once your project is ready:

1. **Click** on "Settings" (gear icon in sidebar)
2. **Go to** "API" section
3. **Copy** these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 3. Add Credentials to Your App

**Open** the `.env` file in the project root and replace:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Save** the file and restart the dev server:

```bash
npm run dev
```

### 4. Set Up Keep-Alive (Prevent Supabase from Pausing)

**If you're using GitHub:**

1. **Push** your code to GitHub (if not already)
2. **Go to** your GitHub repository
3. **Click** Settings → Secrets and variables → Actions
4. **Click** "New repository secret"
5. **Add** these two secrets:
   
   **Secret 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: Your Supabase project URL
   
   **Secret 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon key

6. **Done!** GitHub Actions will ping Supabase every 6 hours automatically

---

## 📊 Optional: Create Database Tables

If you want to save data to Supabase (instead of just local storage), you'll need to create these tables:

### Books Table

```sql
create table books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text not null,
  cover_url text,
  isbn text,
  genre text,
  page_count integer,
  description text,
  age_rating text,
  date_added date default now(),
  date_read date,
  rating integer,
  is_read boolean default false,
  notes text,
  user_id uuid references auth.users(id)
);

-- Enable Row Level Security
alter table books enable row level security;

-- Allow users to read all books
create policy "Books are viewable by everyone"
  on books for select
  to authenticated
  using (true);

-- Allow users to insert their own books
create policy "Users can insert their own books"
  on books for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Allow users to update their own books
create policy "Users can update their own books"
  on books for update
  to authenticated
  using (auth.uid() = user_id);

-- Allow users to delete their own books
create policy "Users can delete their own books"
  on books for delete
  to authenticated
  using (auth.uid() = user_id);
```

### Poems Table

```sql
create table poems (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  emoji text,
  date_created timestamp default now(),
  likes integer default 0,
  template text,
  user_id uuid references auth.users(id)
);

-- Enable Row Level Security
alter table poems enable row level security;

-- Similar policies as books table
create policy "Poems are viewable by everyone"
  on poems for select
  to authenticated
  using (true);

create policy "Users can insert their own poems"
  on poems for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own poems"
  on poems for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own poems"
  on poems for delete
  to authenticated
  using (auth.uid() = user_id);
```

**To run these:**
1. Go to Supabase Dashboard
2. Click "SQL Editor" in sidebar
3. Click "New Query"
4. Paste the SQL above
5. Click "Run"

---

## 🎉 You're All Set!

Now you can:
- ✅ Access the app at `http://localhost:5173`
- ✅ Search for real books from Open Library
- ✅ Add books to the 3D bookshelf
- ✅ Write poems with templates
- ✅ Keep Supabase active with GitHub Actions

**The UI should look beautiful with all the colorful gradients and animations!**

---

## 🆘 Troubleshooting

### UI looks broken?
- Make sure dev server is running: `npm run dev`
- Check that tailwind.config.js exists
- Clear browser cache and refresh

### Can't connect to Supabase?
- Check your .env file has correct credentials
- Restart dev server after changing .env
- Check browser console for errors

### Keep-alive not working?
- Make sure GitHub secrets are added correctly
- Check GitHub Actions tab to see workflow runs
- Can manually trigger workflow from Actions tab

---

## 📝 Next Steps

1. Create a Supabase account
2. Add credentials to .env
3. (Optional) Create database tables for persistent storage
4. Push to GitHub and add secrets for keep-alive
5. Enjoy using Izzy Reads! 🎉

