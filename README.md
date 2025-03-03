# 🎙️ reMind

reMind is a daily podcast/curriculum from your notes. Built with Next.js 15, it rocks server-side rendering, API routes, and component-based design.

## 🚀 Next.js 15 Architecture

This project uses Next.js 15, which brings:

### 📄 Pages & Routing

- **File-based Routing**: Next.js uses a file-based routing system. The `app` dir has all the pages and API routes.
- **Dynamic Routes**: Defined with square brackets. E.g., `[id]` in `app/api/data/cards/[id]/route.ts`.

### 🔌 API Routes

- **API Routes**: In the `app/api` dir. Handle server-side logic and DB interactions.
- **Data Fetching**: Uses API routes for DB CRUD ops.

### 🧩 Components

- **Component-based Arch**: Reusable UI components in `app/components/ui`.
- **Client-side Components**: Marked with `'use client';` at the top.

### 🎨 Styling

- **Tailwind CSS**: For styling. Config in `tailwind.config.ts`.
- **CSS Modules**: Scoped styling for components.

### ⚛️ State Management

- **React Hooks**: Uses `useState`, `useEffect`, `useRef` for state and side effects.

### 🔐 Auth

- **NextAuth.js**: Auth handled with NextAuth.js. Config in `app/lib/auth.ts`.

### 🔧 Env Vars

- **Env Vars**: Sensitive info like DB creds and API keys in env vars. Defined in `.env`.

### 🚢 Deployment

- **Vercel**: Configured for Vercel. Config in `vercel.json`.

## 🛠️ Getting Started

1. **Install Deps**: Run `pnpm install`.
2. **Set Up Env Vars**: Create a `.env` file with necessary vars.
3. **Run Dev Server**: Run `pnpm dev`.
4. **Build Project**: Run `pnpm build`.
5. **Start Prod Server**: Run `pnpm start`.

## 📜 Scripts

Available scripts in `package.json`:

- `dev`: Start dev server.
- `build`: Build for prod.
- `start`: Start prod server.
- `lint`: Run ESLint.
- `deploy`: Deploy to Vercel.
- `prepare`: Compile TS files.
- `write-pod-script`: Generate podcast script.
- `format`: Format code with Prettier.
- `format:check`: Check code formatting with Prettier.

## 📄 License

MIT License.
