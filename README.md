# 📰 RSS Reader

A modern, responsive RSS feed reader built with React. Inspired by the clean aesthetics of Reeder and Feedly, this application provides a comfortable reading experience across all devices.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)

## ✨ Features

### Core Functionality
- **OPML Import** - Load feeds from standard OPML files
- **Multi-feed Support** - Subscribe to multiple RSS/Atom feeds
- **Article Reading** - Clean, distraction-free reading experience
- **Search** - Quick search across all articles
- **Star Articles** - Save important articles for later
- **Mark as Read** - Track your reading progress
- **Unread Filter** - Focus on new content only

### User Experience
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Offline Storage** - Read/starred states persist in localStorage
- **Loading Progress** - Visual feedback while fetching feeds
- **Touch-friendly** - Large touch targets for mobile devices
- **Smooth Animations** - Subtle transitions for better UX

### Design
- **Warm Color Palette** - Easy on the eyes with amber accents
- **Typography Optimized** - Comfortable line height and font sizes
- **Dark Mode Ready** - CSS variables support theming
- **Collapsible Sidebar** - Maximize reading space when needed

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:5173`

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI Components |
| **Radix UI** | Accessible Primitives |
| **date-fns** | Date Formatting |
| **React Query** | Data Fetching |

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── ArticleList.tsx  # Article list panel
│   ├── ArticleView.tsx  # Article reading pane
│   ├── FeedSidebar.tsx  # Feed navigation sidebar
│   └── MobileHeader.tsx # Mobile navigation header
├── hooks/
│   └── useRSSReader.ts  # Main RSS reader logic
├── lib/
│   ├── opml-parser.ts   # OPML file parser
│   ├── rss-fetcher.ts   # RSS/Atom feed fetcher
│   ├── storage.ts       # localStorage utilities
│   ├── types.ts         # TypeScript interfaces
│   └── utils.ts         # Utility functions
├── pages/
│   └── Index.tsx        # Main application page
└── index.css            # Global styles & design tokens
```

## 📖 Usage

### Loading Feeds
The application comes pre-loaded with popular tech blogs from an OPML file. Feeds are automatically fetched on startup.

### Navigation
- **Desktop**: Use the sidebar to switch between feeds and view modes
- **Mobile**: Tap the menu icon to open the sidebar sheet
- **Tablet**: Responsive layout adapts to screen size

### Reading Articles
1. Click an article from the list to open it
2. Use the star button to save for later
3. Click "View original" to open the source website
4. On mobile, use the back arrow to return to the list

### View Modes
- **All Articles** - View all articles from all feeds
- **Unread** - Show only unread articles
- **Starred** - Show only starred articles

## 🎨 Customization

### Colors
Edit `src/index.css` to customize the color palette:

```css
:root {
  --primary: 35 90% 50%;        /* Amber accent */
  --background: 40 20% 98%;     /* Warm white */
  --article-title: 30 15% 12%;  /* Deep brown */
}
```

### Adding Feeds
Modify the OPML data in `src/hooks/useRSSReader.ts` to add your own RSS feeds.

## 🔧 Configuration

### CORS Proxy
The app uses `allorigins.win` as a CORS proxy for fetching RSS feeds. You can configure a different proxy in `src/lib/rss-fetcher.ts`:

```typescript
const CORS_PROXY = "https://api.allorigins.win/raw?url=";
```

## 🚢 Deployment

### Using Lovable
Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on **Share → Publish**.

### Custom Domain
To connect a domain, navigate to **Project > Settings > Domains** and click Connect Domain.

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain)

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Design inspired by [Reeder](https://reederapp.com/) and [Feedly](https://feedly.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

Built with ❤️ using [Lovable](https://lovable.dev)
