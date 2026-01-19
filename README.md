# History From Generations

A Next.js (App Router) + TypeScript + Tailwind MVP for exploring Chinese political development through history and generations.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```bash
   GEMINI_API_KEY=your-api-key-here
   ```
   
   Get your API key from: https://aistudio.google.com/app/apikey

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features

- **Home Page**: Displays top 3 news stories powered by Gemini API with Google Search grounding
- **Concepts**: Learn about key Chinese political concepts (Party, Government, Country)
- **Timeline**: View the timeline of Chinese political development
- **Generations**: Explore how different generations have shaped modern China
- **News Detail**: Read full articles and add comments (persisted in localStorage)

## Tech Stack

- Next.js 14.2 (App Router)
- TypeScript
- Tailwind CSS
- Google Gemini API with Google Search grounding
- localStorage for comments (client-side persistence)

## Project Structure

```
app/
  api/
    top-news/       # API route for fetching top news via Gemini
  components/       # Reusable components (Navigation)
  news/[id]/        # News detail pages
  ...               # Other pages (concepts, timeline, generations)
data/               # Legacy data (deprecated)
content/            # Static content for concepts, timeline, generations
```

## API Configuration

The `/api/top-news` endpoint:
- Uses Gemini API with Google Search grounding to fetch real-time news
- Caches results for 6 hours to reduce API calls
- Returns JSON array of news items with title, summary, source, URL, and date
