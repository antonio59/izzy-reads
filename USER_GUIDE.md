# Izzy-Reads User Guide

## Welcome! 📚

This is your personal reading tracker and public portfolio! Share your love of books with friends and family.

---

## Getting Started

### Viewing Your Portfolio
1. Open your browser
2. Go to: `http://localhost:5173` (or your deployed URL)
3. Explore your 5 tabs!

### Tabs Overview

#### 📚 My Books
See all the books you've read with:
- Book covers
- Ratings (1-5 stars)
- Your reviews
- Genre tags

#### ✍️ My Poems
Share your creative writing:
- Beautiful poetry cards
- Like counter (visitors can like your poems!)
- Share button to send to friends

#### 📝 My Blog
Write about books you love:
- Full blog posts
- Publish when ready
- Share with friends

#### 🎁 Wishlist
Books you want to read:
- Share with family for gift ideas!
- Links to buy from 3 UK stores:
  - Bookshop.org (supports independent bookstores)
  - Amazon.co.uk
  - World of Books (used books)

**Tip**: You can create an Amazon Wishlist and share the link with family so they can ship gifts directly to you!

#### 👤 About Me
Your reading profile (NEW!):
- Your photo and bio
- Favorite genres & authors
- Why you love reading
- Fun facts about you
- Reading goals
- Achievements you've earned

---

## Using the Dashboard (Admin)

### Logging In
1. Bookmark: `http://localhost:5173/login`
2. Enter your email and password
3. Access your private dashboard

**Note**: There's no public login button - keep your admin link private!

### Adding Books
1. Go to Dashboard
2. Click "Add Book"
3. Enter book details:
   - Title
   - Author
   - ISBN (for cover image)
   - Genre
   - Page count
4. Mark as "Read" when finished
5. Add your rating (1-5 stars)
6. Write your review!

### Writing Poems
1. Go to Dashboard → Poems
2. Click "New Poem"
3. Write your poem
4. Add an emoji (optional)
5. Publish to your portfolio!

### Writing Blog Posts
1. Go to Dashboard → Blog
2. Click "New Post"
3. Write about a book you loved
4. Add tags
5. Publish when ready!

### Managing Your Wishlist
1. Add books you want to read
2. They'll appear in your public Wishlist tab
3. Share the link with family!

### Editing About Me
(Coming soon in dashboard)
1. Toggle "Publish" to make it visible
2. Upload a profile photo
3. Edit your bio
4. Add/remove favorite genres
5. Update fun facts
6. Set reading goals

---

## Features Explained

### Reading Stats
Shows automatically on every page:
- **Total Books**: How many books you've finished
- **Total Pages**: All the pages you've read!
- **Books This Year**: Your yearly progress
- **Books This Month**: Current month's reading
- **Average Rating**: Your average star rating
- **Favorite Genre**: The genre you read most
- **Reading Streak**: Days in a row you've read 🔥

### Izzy's Picks
Your top recommendations appear automatically:
- Only shows books you rated 4-5 stars
- Top 6 favorites displayed
- Shows your review quotes
- Helps friends find great books!

### Like & Share
**Poems**:
- Visitors can "like" your poems (heart button)
- Like count shows publicly
- Share button sends poem to friends

**Blog Posts**:
- Share button for social media
- Copy link to clipboard
- Send to friends and family

### Book Covers
Covers load automatically from Open Library:
- Enter the book's ISBN when adding
- Cover appears automatically!
- No need to upload images

---

## Sharing Your Portfolio

### With Friends
1. Copy your portfolio URL
2. Send via text/email
3. They can browse your books, poems, and blog!

### On Social Media
- Share individual poems/posts using share button
- Link to your full portfolio in bio
- Screenshot your reading stats to post!

### With Family (Wishlist)
1. Go to Wishlist tab
2. Click any book's purchase links
3. Family can buy books for you!

**Pro Tip**: Create an Amazon Wishlist:
1. Add your wishlist books to Amazon
2. Create a wishlist on Amazon.co.uk
3. Share the wishlist link with family
4. They can ship gifts directly to you!

---

## Tips & Tricks

### Get More Recommendations
- Rate every book you read
- Give 4-5 stars to favorites
- They'll appear in "Izzy's Picks" automatically!

### Build Your Reading Streak
- Read every day
- Your streak counter increases
- Show off your dedication! 🔥

### Make About Me Special
- Add fun facts people don't know
- Share what inspires you to read
- Update your currently reading book
- List reading goals to track progress

### Grow Your Achievements
Keep track of milestones:
- "Read 100 Books"
- "Finished a series in one week"
- "500 Pages in One Day"
- Add new ones as you achieve them!

### Write Great Reviews
Help others find good books:
- Say what you loved (or didn't love)
- Mention who would enjoy it
- Keep it honest!
- Your quotes appear in recommendations

---

## Frequently Asked Questions

### How do I change my About Me?
In the dashboard (coming soon), you can edit all sections and toggle publish on/off.

### Can I remove the About Me tab?
Yes! Set `isPublished: false` and it will show "Coming Soon" instead.

### How do covers appear automatically?
When you add a book's ISBN, we fetch the cover from Open Library's free database!

### What if a cover doesn't load?
A colorful gradient placeholder appears instead. Still looks great!

### Can visitors leave comments?
Not yet - this keeps your portfolio spam-free and safe. You can add comments later if you want!

### How do I hide the admin login?
It's already hidden! Only you know the `/login` URL.

### Can I customize colors?
Yes! Ask a developer to help change the color themes in the code.

### How many books can I add?
Unlimited! Add as many as you want.

### Can I track book series?
Coming soon! Series tracker is on the roadmap.

### Can I filter books by genre?
Coming soon! Tag and filter system is being built.

---

## Privacy & Safety

### What's Public?
- Books you've marked as read
- Published poems
- Published blog posts
- Your wishlist
- About Me (if published)
- Reading stats

### What's Private?
- Your email and password
- Dashboard access
- Unpublished drafts
- Books not marked as read
- Admin features

### Staying Safe
- Never share your login password
- Keep your `/login` URL private
- Review posts before publishing
- Ask a parent before sharing personal info

---

## Getting Help

### Something Not Working?
1. Refresh the page
2. Check your internet connection
3. Ask a parent or developer for help

### Want to Add Features?
Ideas for future updates:
- Series tracker
- Book tags and filters
- Reading journey timeline
- Friend recommendations
- Book club features

---

## Have Fun Reading! 📖

Remember:
- Share books you love
- Write honest reviews
- Track your progress
- Celebrate milestones
- Inspire others to read!

**Your reading journey is amazing - share it with the world!** 🌟

---

*Built with ❤️ for book lovers everywhere*
