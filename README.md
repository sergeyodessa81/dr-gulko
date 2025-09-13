# Dr. Gulko - German Learning Platform

A Next.js AI-powered German learning platform with 6 specialized labs and free tier quota system.

## Features

- **AI Teacher**: Conversational practice with corrections
- **Writing Lab**: Email and essay feedback
- **Mock Tests**: Goethe/TELC exam preparation
- **Medical German**: Clinical vocabulary and scenarios
- **Error Tracking**: Session-based mistake analysis
- **All Levels**: A0-C1 placement and structured learning

## Environment Variables

Create a `.env.local` file:

\`\`\`env
# AI Configuration
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
AI_API_KEY=your_api_key_here

# Alternative providers:
# AI_PROVIDER=groq
# AI_MODEL=llama-3.1-70b-versatile
# GROQ_API_KEY=your_groq_key

# AI_PROVIDER=anthropic
# AI_MODEL=claude-3-haiku-20240307
# ANTHROPIC_API_KEY=your_anthropic_key
\`\`\`

## Free Tier

- 10 AI responses per browser per 24 hours
- No authentication required
- Quota tracked via secure cookies
- Conversations reset on page refresh

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to start learning German!

## Deployment

Deploy to Vercel with Edge runtime support for optimal AI streaming performance.
