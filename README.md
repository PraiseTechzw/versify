# Versify ✨

**Transform images into beautiful poetry with AI**

Versify is a modern web application that uses artificial intelligence to generate unique poems inspired by your images. Built with Next.js and powered by Google's Gemini AI, it offers a Discord-inspired interface for creating, customizing, and managing your poetic creations.

![Versify Interface](public/screenshoots/screenshoot-1-with-1-free-poem-if-not-signedin.png)

## 🎯 Live Demo

Experience Versify in action with our interactive demo:

### 🆓 Free Trial Experience
![Free Trial](public/screenshoots/screenshoot-1-with-1-free-poem-if-not-signedin.png)
*Get started instantly with 1 free poem - no signup required!*

### 📸 Gallery Upload Feature
![Gallery Upload](public/screenshoots/screenshoot2-upload-using-galley.png)
*Choose from our curated gallery or upload your own images*

### 👤 Signed-in User Experience
![User Dashboard](public/screenshoots/screenshoot3-user-signedin.png)
*Full access to unlimited poem generation and personal library*

### ⚡ AI Generation in Progress
![Generating Poetry](public/screenshoots/screenshoot4-generating.png)
*Watch as our AI analyzes your image and crafts beautiful poetry*

### 📝 Generated Poem Result
![Generated Poem](public/screenshoots/screenshot-5-poeam-generated.png)
*Beautiful, personalized poems with editing and sharing capabilities*

## ✨ Features

### 🎨 **Beautiful Discord-Inspired Interface**
- **Modern Design System**: Clean, intuitive interface with Discord's design language
- **Glassmorphism Effects**: Beautiful backdrop blur and gradient overlays
- **Smooth Animations**: Polished interactions with fade-in, slide, and shimmer effects
- **Responsive Layout**: Seamless experience across desktop, tablet, and mobile devices
- **Dark Theme Optimized**: Sophisticated dark color scheme that's easy on the eyes

### 🖼️ **Advanced Image-to-Poetry Generation**
- **Smart AI Analysis**: Multi-model AI system analyzes images for objects, emotions, colors, and themes
- **Multiple Poetry Styles**: Choose from Free Verse, Sonnet, Haiku, Limerick, Ballad, and more
- **Creative Controls**: Fine-tune tone, length, symbolism, narrative style, and keyword emphasis
- **Model Fallback System**: Automatic fallback across multiple AI models for reliability
- **Instant Generation**: Get beautiful, unique poems in seconds

### 📚 **Personal Poetry Library**
- **Save & Organize**: Keep all your poems in a secure personal library
- **Smart Collections**: Organize poems into custom collections (Favorites, Drafts, etc.)
- **Advanced Search**: Find poems by title, content, or collection with full-text search
- **Export & Share**: Share your poems or export them in various formats
- **Edit & Regenerate**: Modify existing poems with AI assistance

### 🔐 **Secure User Management**
- **Multiple Auth Options**: Sign up with email/password or Google OAuth
- **Profile Customization**: Personalize your display name and preferences
- **Privacy First**: Your poems are private and secure with Row Level Security
- **Notification Controls**: Manage daily inspiration and event notifications
- **Session Persistence**: Your work is automatically saved as you create

### 🚀 **Premium User Experience**
- **Free Trial**: Generate 1 poem without signup to try the service
- **Real-time Editing**: Edit poems line-by-line with AI suggestions
- **Mobile Optimized**: Full functionality on mobile with touch-friendly controls
- **Accessibility**: Built with WCAG guidelines and screen reader support
- **Performance**: Optimized with caching, image compression, and lazy loading

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

### **Frontend Architecture**
- **Next.js 15** - React framework with App Router and Server Actions
- **TypeScript** - Full type safety across the entire application
- **Tailwind CSS** - Utility-first CSS with custom design system
- **Radix UI** - Accessible, unstyled component primitives
- **Lucide React** - Beautiful, consistent icon library
- **Framer Motion** - Smooth animations and transitions

### **Backend & AI Services**
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Supabase Auth** - Secure authentication with multiple providers
- **Google Gemini AI** - Advanced multimodal AI for image analysis and text generation
- **Genkit Framework** - Structured AI flow management with model fallbacks
- **Server Actions** - Type-safe server-side functions for AI operations

### **Performance & Optimization**
- **Upstash Redis** - Intelligent caching for improved performance
- **Image Optimization** - Automatic compression and format conversion
- **Lazy Loading** - Optimized loading for better user experience
- **Edge Functions** - Fast, globally distributed API responses

### **Development & Deployment**
- **TypeScript** - Static type checking and IntelliSense
- **ESLint** - Code quality and consistency enforcement
- **Turbopack** - Ultra-fast development builds
- **Vercel** - Seamless deployment with automatic previews

## 📁 Project Structure

```
versify/
├── src/
│   ├── ai/                     # AI generation system
│   │   ├── flows/              # Genkit AI flows for different operations
│   │   │   ├── generate-poem-from-image.ts
│   │   │   ├── generate-poem-title.ts
│   │   │   ├── provide-poem-inspiration-insights.ts
│   │   │   └── rewrite-poem-line-with-ai-suggestions.ts
│   │   ├── genkit.ts           # AI configuration and model fallbacks
│   │   └── dev.ts              # Development server configuration
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes and webhooks
│   │   ├── auth/               # Authentication pages and callbacks
│   │   ├── library/            # Personal poem library interface
│   │   ├── settings/           # User settings and preferences
│   │   ├── login/              # Login page
│   │   ├── signup/             # Registration page
│   │   ├── terms/              # Terms of service
│   │   ├── privacy/            # Privacy policy
│   │   └── layout.tsx          # Root layout with providers
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components (Radix-based)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── sheet.tsx
│   │   │   └── versify-logo.tsx
│   │   └── versify/            # App-specific components
│   │       ├── VersifyClient.tsx    # Main application interface
│   │       ├── PhotoUploader.tsx    # Image upload component
│   │       ├── PoemDisplay.tsx      # Poem rendering and editing
│   │       ├── CreativeControls.tsx # AI generation controls
│   │       └── Header.tsx           # Navigation header
│   ├── context/                # React context providers
│   │   └── LibraryContext.tsx  # Poem library state management
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-supabase-user.ts     # User authentication hook
│   │   ├── use-supabase-collection.ts # Database collection hook
│   │   └── use-toast.ts             # Toast notification hook
│   ├── lib/                    # Utility functions and configurations
│   │   ├── actions/            # Server actions for AI operations
│   │   ├── supabase/           # Database operations and auth
│   │   ├── upstash/            # Redis caching utilities
│   │   └── utils.ts            # Common utility functions
├── public/                     # Static assets
│   ├── screenshoots/           # Application screenshots
│   ├── favicon.svg             # Custom Versify favicon
│   ├── icon.png                # App icon
│   └── manifest.json           # PWA manifest
├── scripts/                    # Database and deployment scripts
│   └── 01_migrate_firebase_to_supabase.sql
├── docs/                       # Documentation
│   ├── backend.json            # API documentation
│   └── blueprint.md            # Architecture overview
└── styles/                     # Global styles and themes
    └── globals.css             # Tailwind CSS and custom styles
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