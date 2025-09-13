# Dr. Gulko German Learning Platform

A simplified, production-ready German learning platform powered by AI. Features 6 specialized labs with a FREE mode offering 10 AI responses per browser per 24 hours - no login required.

## Features

- **AI Teacher** - Personalized German conversations with feedback
- **Writing Lab** - Essay and email training with corrections
- **Mock Tests** - Goethe/TELC exam preparation with scoring
- **Medical German** - Clinical vocabulary and scenarios
- **Error Tracking** - Session-based error analysis and drills
- **All Levels** - Placement testing and structured learning paths (A0-C1)

## Tech Stack

- **Next.js 15+** with App Router and TypeScript
- **Vercel AI SDK** with configurable providers (OpenAI, Groq, Anthropic)
- **Tailwind CSS** + **shadcn/ui** components
- **Edge Runtime** for AI routes
- **Cookie-based quota system** (no database required)

## Environment Variables

Create a `.env.local` file with:

\`\`\`env
# AI Configuration
AI_PROVIDER=openai          # "openai" | "groq" | "anthropic"
AI_MODEL=gpt-4o-mini       # Model name for chosen provider
OPENAI_API_KEY=your_key    # Required if using OpenAI
GROQ_API_KEY=your_key      # Required if using Groq
ANTHROPIC_API_KEY=your_key # Required if using Anthropic
\`\`\`

## Getting Started

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   \`\`\`

3. **Run development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open [http://localhost:3000](http://localhost:3000)**

## Quota System

- **FREE Mode**: 10 AI responses per browser per 24 hours
- **No login required** - quota tracked via signed cookies
- **No persistence** - conversations reset on page refresh
- **Rolling window** - quota resets 24 hours after first use

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo)

Make sure to add your environment variables in the Vercel dashboard.

## API Routes

- `POST /api/chat` - Main chat endpoint with quota enforcement
  - Body: `{ lab, level?, messages }`
  - Returns: Streamed AI response or 429 if quota exceeded

## License

MIT License - see LICENSE file for details.
