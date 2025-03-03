# 🎙️ reMind

**reMind turns your notes into daily podcasts, creating a personalized curriculum that helps you retain knowledge long-term.**

## 🧠 The Problem reMind Solves

Not being in school can make you feel like your intellect is fading. Despite YouTube rabbit holes and "inTELlecTuaL" endeavors, remembering what you learn is challenging. reMind addresses this by:

1. Converting your notes into structured audio lessons
2. Delivering them as podcasts to fit into your existing routines
3. Creating a systematized review process to improve retention

What started as a personal project is now available for anyone who wants to maintain their learning journey.

## 🚀 Tech Stack

This open-source project uses:

* **Frontend**: Next.js 15 (app directory) + TypeScript + Tailwind + shadcn/ui
* **Backend**: Node.js API (deployed as serverless functions on Vercel)
* **Database**: MySQL + Backblaze B2 (audio file storage)
* **AI**: OpenAI for content generation and TTS via their API

## 📐 Architecture

### 📄 Pages & Routing
- **File-based Routing**: The `app` directory contains all pages and API routes
- **Dynamic Routes**: Using square brackets syntax (e.g., `app/api/data/cards/[id]/route.ts`)

### 🔌 API Routes
- **Serverless Functions**: API routes in `app/api` handle server-side logic and database operations
- **Data Fetching**: Clean separation between frontend and backend

### 🧩 Components
- **Component Library**: Reusable UI components in `app/components/ui`
- **Client Components**: Marked with `'use client';` directive

### 🎨 Styling
- **Tailwind CSS**: Utility-first styling configured in `tailwind.config.ts`
- **CSS Modules**: Component-scoped styling

### ⚛️ State Management
- **React Hooks**: Using `useState`, `useEffect`, `useRef` for state and side effects

### 🔐 Authentication
- **Auth.js**: Simple, secure authentication (formerly NextAuth.js)
- **Configuration**: Setup in `app/lib/auth.ts`

### 🔧 Environment Variables
- **Security**: Sensitive information stored in `.env` files
- **Configuration**: Database credentials, API keys, and other secrets

## ⚙️ Implementation Highlights

- **Prettier Integration**: Automatic code formatting on save (VSCode) or via `pnpm run format`
- **Backblaze B2 Storage**: Fast audio file delivery (replaces slow base64 database storage)
- **Vercel AI SDK**: Lightweight alternative to LangChain for AI interactions
- **OpenAI Integration**: Direct API calls for text-to-speech functionality
- **v0**: Used for generating shadcn/ui boilerplate components
- **Serverless Function Optimization**: Processing chunked to avoid Vercel's 60s timeout limits on the free plan

## 🛠️ Getting Started

1. **Install Dependencies**: `pnpm install`
2. **Environment Setup**: Create a `.env` file with required variables
3. **Development Server**: `pnpm dev`
4. **Build for Production**: `pnpm build`
5. **Production Server**: `pnpm start`

## 📜 Available Scripts

- `dev`: Start development server
- `build`: Build for production
- `start`: Start production server
- `lint`: Run ESLint
- `deploy`: Deploy to Vercel
- `prepare`: Compile TypeScript files
- `write-pod-script`: Generate podcast script
- `format`: Format code with Prettier
- `format:check`: Check code formatting

## 🔮 Future Development

Planned features include:
- **AI-Generated Content**: A button to generate additional facts for a category based on existing cards
- Share your ideas by submitting feedback!

## 📄 License

Released under the MIT License.

---

**Try it now for free!** Feedback and pull requests are welcome!
