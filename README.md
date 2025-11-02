# Izzy Reads - Young Reader's Book Tracker

A delightful, child-friendly web application designed for young readers (ages 8-12) to track their reading journey, discover new books, write poems, and share their thoughts in a safe, supervised environment.

## 🌟 Features

### For Young Readers
- **📚 3D Bookshelf**: Colorful book spines that look like a real bookshelf!
- **🔍 Book Search**: Search 20M+ books from Open Library with beautiful covers
- **✍️ Poetry Corner**: Write poems with fun templates (Haiku, Acrostic, Free Verse, Rhyming)
- **💖 Wishlist Management**: Track books to read next
- **📖 Reading Blog**: Write book reviews with guided templates
- **🐛 Bookworm Character**: Grows as you read more books!
- **📊 Reading Stats**: Visual progress tracking and achievements
- **🎨 Child-Friendly Design**: Bright gradients, emojis, fun animations

### For Parents
- **🛡️ Parental Dashboard**: Monitor and manage child's reading activity
- **👀 Content Review**: Approve blog posts before publishing
- **⚙️ Parental Controls**: Manage privacy settings and content filters
- **📈 Progress Monitoring**: Track reading habits and celebrate achievements
- **🔒 Safety Features**: Private by default with no external communication

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account (free tier works great!)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd isabella-reads
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Copy your project URL and anon key
   - Create a `.env` file in the project root:
   ```bash
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Setting Up Keep-Alive (Prevent Supabase from Pausing)

Supabase free tier pauses projects after 7 days of inactivity. To prevent this:

1. Go to your GitHub repository settings
2. Add these secrets (Settings → Secrets and variables → Actions):
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

3. The GitHub Actions workflow will automatically ping Supabase every 6 hours to keep it active!

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Backend**: Supabase (for future full-stack implementation)

## 📱 Usage

### Child Mode
1. **Dashboard**: View reading stats, recent books, and quick actions
2. **Bookshelf**: Add and manage books you've read with ratings and notes
3. **Wishlist**: Keep track of books you want to read
4. **Blog**: Write reviews and thoughts about books with helpful templates

### Parent Mode
1. Toggle to Parent Mode using the shield icon in the navigation
2. **Overview**: Monitor reading activity and progress
3. **Content Review**: Approve or reject blog posts
4. **Settings**: Configure parental controls and reading goals

## 🎨 Design Principles

- **Child-Friendly**: Bright colors, fun animations, simple language
- **Intuitive**: Large buttons, clear icons, minimal text
- **Encouraging**: Positive reinforcement and celebration of achievements
- **Safe**: No external links, private by default, parental oversight

## 🔒 Privacy & Safety

- All data stored locally in browser (no server required for MVP)
- No personal information sharing
- No social features with strangers
- Parent access to all child data
- Content filtering for age-appropriate material

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Bookshelf.tsx    # Book management
│   ├── Wishlist.tsx     # Wishlist management
│   ├── Blog.tsx         # Blog functionality
│   ├── ParentDashboard.tsx # Parent controls
│   └── Navigation.tsx   # Navigation component
├── contexts/            # React contexts
│   ├── BookContext.tsx  # Book state management
│   └── UserContext.tsx  # User state management
├── types/               # TypeScript types
│   └── index.ts         # Type definitions
└── utils/               # Utility functions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Future Enhancements

- **Supabase Integration**: Full backend with user authentication
- **Book API Integration**: Automatic book information fetching
- **Reading Streaks**: Track consecutive reading days
- **Achievement Badges**: Unlock badges for reading milestones
- **Parent-Child Messaging**: Safe communication features
- **Reading Recommendations**: AI-powered book suggestions
- **Offline Support**: Progressive Web App capabilities

## 🤝 Contributing

This project is designed for educational purposes and family use. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Designed with love for young readers everywhere
- Inspired by the joy of reading and learning
- Built with modern web technologies for a delightful user experience

---

**Happy Reading! 📚✨**
