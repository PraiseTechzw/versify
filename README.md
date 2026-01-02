# Versify 🍃

**Transform images into beautiful poetry with AI**

Versify is a modern web application that uses artificial intelligence to generate unique poems inspired by your images. Built with Next.js and powered by Google's Gemini AI, it offers a Discord-inspired interface for creating, customizing, and managing your poetic creations.

![Versify Banner](public/placeholder-logo.svg)

## ✨ Features

### 🖼️ Image-to-Poetry Generation
- **Smart Image Analysis**: AI analyzes your images to detect objects, emotions, colors, and themes
- **Multiple Poetry Styles**: Choose from Free Verse, Sonnet, Haiku, Limerick, and more
- **Creative Controls**: Fine-tune tone, length, symbolism, and narrative style
- **Instant Generation**: Get beautiful poems in seconds

### 🎨 Discord-Inspired UI
- **Modern Design**: Clean, intuitive interface inspired by Discord's design language
- **Responsive Layout**: Seamless experience across desktop, tablet, and mobile devices
- **Dark Theme**: Easy on the eyes with a sophisticated dark color scheme
- **Smooth Interactions**: Polished user experience with thoughtful animations

### 📚 Personal Library
- **Save & Organize**: Keep all your poems in a personal library
- **Collections**: Organize poems into custom collections (Favorites, Drafts, etc.)
- **Search & Filter**: Easily find poems by title, content, or collection
- **Export Options**: Share your poems or export them in various formats

### 🔐 User Management
- **Secure Authentication**: Sign up with email/password or Google OAuth
- **Profile Management**: Customize your display name and preferences
- **Privacy Controls**: Your poems are private and secure
- **Notification Settings**: Control daily inspiration and event notifications

### 🛠️ Advanced Features
- **Real-time Editing**: Edit and regenerate poems with AI assistance
- **Session Persistence**: Your work is automatically saved as you create
- **Mobile Optimized**: Full functionality on mobile devices with touch-friendly controls
- **Accessibility**: Built with accessibility best practices in mind

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account (for database and authentication)
- Google AI API key (for Gemini AI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/versify.git
   cd versify
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Google AI (Gemini) API Key
   GEMINI_API_KEY=your_gemini_api_key
   
   # Optional: Redis for caching (Upstash)
   KV_REST_API_URL=your_redis_url
   KV_REST_API_TOKEN=your_redis_token
   ```

4. **Set up the database**
   
   Run the SQL migration script in your Supabase dashboard:
   ```bash
   # Execute the contents of scripts/01_migrate_firebase_to_supabase.sql
   # in your Supabase SQL editor
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:9002](http://localhost:9002)

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend & Services
- **Supabase** - Database, authentication, and real-time features
- **Google Gemini AI** - Advanced AI for poem generation
- **Genkit** - AI framework for structured generation
- **Upstash Redis** - Optional caching layer

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Turbopack** - Fast development builds

## 📁 Project Structure

```
versify/
├── src/
│   ├── ai/                 # AI generation logic
│   │   └── flows/          # Genkit AI flows
│   ├── app/                # Next.js App Router pages
│   │   ├── auth/           # Authentication pages
│   │   ├── library/        # Poem library
│   │   └── settings/       # User settings
│   ├── components/         # React components
│   │   ├── ui/             # Reusable UI components
│   │   └── versify/        # App-specific components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions and configs
├── public/                 # Static assets
├── scripts/                # Database migration scripts
└── docs/                   # Documentation
```

## 🔧 Configuration

### Configuration

#### Server Actions Body Size Limit

The app is configured to handle image uploads up to 10MB. If you need to adjust this limit, modify the `next.config.ts` file:

```typescript
const nextConfig: NextConfig = {
  serverActions: {
    bodySizeLimit: '10mb', // Adjust as needed
  },
  // ... other config
}
```

#### Image Compression

The app automatically compresses images larger than 800KB to ensure optimal performance:

- **Automatic Compression**: Large images are compressed client-side before upload
- **Quality Optimization**: Maintains visual quality while reducing file size
- **Dimension Limits**: Images are resized to maximum 1920x1080 resolution
- **Format Conversion**: All images are converted to JPEG for consistency

### Supabase Setup

1. Create a new Supabase project
2. Run the migration script from `scripts/01_migrate_firebase_to_supabase.sql`
3. Configure authentication providers (Email, Google OAuth)
4. Set up Row Level Security (RLS) policies

### Google AI Setup

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add the key to your `.env.local` file
3. Configure rate limits and usage quotas as needed

### Optional: Redis Caching

For improved performance, set up Redis caching with Upstash:

1. Create an Upstash Redis database
2. Add the connection details to your `.env.local`
3. Caching will be automatically enabled

## 🎨 Customization

### Themes and Styling

The app uses a Discord-inspired design system with CSS custom properties:

```css
/* Light theme colors */
--primary: 235 86% 65%;        /* Discord Blurple */
--background: 0 0% 100%;       /* White */
--card: 0 0% 98%;             /* Light gray */

/* Dark theme colors */
--primary: 235 86% 65%;        /* Discord Blurple */
--background: 220 13% 18%;     /* Dark gray */
--card: 225 6% 13%;           /* Darker gray */
```

### AI Prompts

Customize poem generation by modifying the AI flows in `src/ai/flows/`:

- Adjust poetry styles and formats
- Modify tone and mood detection
- Customize image analysis prompts

## 📱 Mobile Support

Versify is fully responsive and optimized for mobile devices:

- Touch-friendly interface
- Collapsible sidebar navigation
- Optimized image handling
- Mobile-first responsive design

## 🔒 Security & Privacy

- **Authentication**: Secure user authentication with Supabase Auth
- **Data Privacy**: User data is encrypted and stored securely
- **Row Level Security**: Database access is restricted by user permissions
- **API Security**: All API endpoints are protected and rate-limited

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on every push to main

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and conventions
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful image analysis and text generation
- **Supabase** - For the excellent backend-as-a-service platform
- **Radix UI** - For accessible and customizable UI components
- **Vercel** - For seamless deployment and hosting
- **The Open Source Community** - For the amazing tools and libraries

## 📞 Support

- **Documentation**: Check our [docs](docs/) folder for detailed guides
- **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/yourusername/versify/issues)
- **Discussions**: Join the conversation in [GitHub Discussions](https://github.com/yourusername/versify/discussions)

---

**Made with ❤️ and AI** - Transform your images into poetry with Versify