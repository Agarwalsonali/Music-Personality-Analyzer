# Music Personality Analyzer

A modern, production-ready Next.js 15 application for analyzing and visualizing your Spotify music personality, inspired by Spotify Wrapped.

## 🎵 Features

- **Next.js 15** with App Router and TypeScript
- **Modern Dark Theme** enabled by default with light mode support
- **Responsive Design** optimized for all devices
- **Spotify Integration** for personalized music analysis
- **Beautiful Visualizations** using Recharts and Framer Motion animations
- **ShadCN UI Components** for consistent UI
- **Tailwind CSS** for rapid styling
- **Audio Features Analysis** using Spotify API
- **Report Generation** with html-to-image export
- **Type-Safe** TypeScript throughout
- **Responsive Charts** and data visualizations
- **Custom Hooks** for music analysis logic
- **Organized Service Layer** for API integration

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Components**: [ShadCN UI](https://ui.shadcn.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion)
- **Charts**: [Recharts](https://recharts.org)
- **Icon Library**: [Lucide React](https://lucide.dev)
- **Image Export**: [html-to-image](https://github.com/bubkoo/html-to-image)
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)
- **UI Utilities**: clsx, tailwind-merge, class-variance-authority
- **UI Framework**: [Radix UI](https://www.radix-ui.com)

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── analyzer/
│   │   └── page.tsx            # Music analyzer page
│   └── about/
│       └── page.tsx            # About page
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components (Button, Card, Input, Dialog, Badge)
│   ├── layout/                  # Layout components (Navbar)
│   └── providers/               # App providers (Theme Provider)
├── types/                       # TypeScript type definitions
│   └── index.ts                # Music personality and Spotify types
├── utils/                       # Utility functions
│   └── lib/utils.ts            # Common utilities and helpers
├── services/                    # API services
│   └── spotify.ts              # Spotify API integration service
├── hooks/                       # Custom React hooks
│   └── useMusicAnalysis.ts      # Hook for music personality analysis
└── lib/                        # Library utilities
    └── utils.ts                # Utility functions (cn, formatting, etc.)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or later
- npm or yarn package manager

### Installation

1. **Clone or extract the project**

```bash
cd Music_personality_analyzer
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your Spotify API credentials:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/auth/callback
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3000/api
```

### Get Spotify Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Accept the terms and create the app
4. You'll receive Client ID and Client Secret
5. Add the redirect URI: `http://127.0.0.1:3000/api/auth/callback`

### Running Development Server

```bash
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser.

## 📝 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm build

# Start production server
npm start

# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Type checking
npm run type-check
```

## 🎨 Customization

### Colors and Theme

The theme is configured in `tailwind.config.ts`. Dark theme is enabled by default:

```css
:root {
  --background: 0 0% 0%;
  --foreground: 0 0% 100%;
  --primary: 142 71% 45%;
  --accent: 280 85% 65%;
  /* ... more variables */
}
```

### Adding New Components

Components are built using ShadCN UI pattern:

```tsx
// src/components/ui/new-component.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NewComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

const NewComponent = React.forwardRef<HTMLDivElement, NewComponentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('base-classes', className)} {...props} />
  )
);
NewComponent.displayName = 'NewComponent';

export { NewComponent };
```

## 🔐 API Integration

### Using the Spotify Service

```tsx
import { spotifyService } from '@/services/spotify';

// Set access token
spotifyService.setAccessToken(userToken);

// Get current user
const user = await spotifyService.getCurrentUser();

// Get top tracks
const tracks = await spotifyService.getTopTracks(20, 'long_term');

// Get audio features for track
const features = await spotifyService.getTrackAudioFeatures(trackId);

// Get recommendations
const recommendations = await spotifyService.getRecommendations(artistIds, genreIds, trackIds);
```

### Custom Hooks

```tsx
import { useMusicAnalysis } from '@/hooks/useMusicAnalysis';

export function MyComponent() {
  const { loading, error, personality, analyzeMusicPersonality } = useMusicAnalysis();

  return (
    <button onClick={analyzeMusicPersonality} disabled={loading}>
      {loading ? 'Analyzing...' : 'Analyze'}
    </button>
  );
}
```

## 📦 Exporting Reports

```tsx
import { toPng } from 'html-to-image';
import { downloadImage } from '@/lib/utils';

// Export report as image
const element = document.getElementById('report');
const dataUrl = await toPng(element);
downloadImage(dataUrl, 'music-personality-report.png');
```

## 🌙 Dark Mode

Theme switching is handled by `next-themes`:

```tsx
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle Theme</button>
  );
}
```

## 📊 Charts and Visualizations

The app uses Recharts for data visualization. Examples:

```tsx
import { BarChart, Bar, PieChart, Pie, LineChart, Line } from 'recharts'

// Bar chart
<BarChart data={data}>
  <Bar dataKey="value" fill="#1DB954" />
</BarChart>

// Pie chart
<PieChart>
  <Pie data={data} dataKey="value" fill="#1DB954" />
</PieChart>
```

## 🎬 Animations

Framer Motion is pre-configured for smooth animations:

```tsx
import { motion } from 'framer-motion';

export function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      Content
    </motion.div>
  );
}
```

## 🧪 Testing

For testing, you can add Jest and React Testing Library:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

Made with ❤️ for music lovers everywhere.
