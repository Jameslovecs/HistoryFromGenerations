import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  url: string
  publishedAt: string
}

interface CachedNewsData {
  date: string
  data: NewsItem[]
}

// Cache selected model name to avoid repeated discovery
let cachedModelName: string | null = null
const PREFERRED_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro']

const CACHE_FILE_PATH = path.join(process.cwd(), 'data', 'cachedNews.json')
const FALLBACK_FILE_PATH = path.join(process.cwd(), 'data', 'fallbackNews.json')

function getDateKey(): string {
  return new Date().toISOString().split('T')[0] // YYYY-MM-DD
}

async function readCacheFile(): Promise<CachedNewsData | null> {
  try {
    const content = await fs.readFile(CACHE_FILE_PATH, 'utf-8')
    return JSON.parse(content) as CachedNewsData
  } catch (err) {
    return null
  }
}

async function writeCacheFile(data: NewsItem[]): Promise<void> {
  try {
    const cacheData: CachedNewsData = {
      date: getDateKey(),
      data,
    }
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(cacheData, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to write cache file:', err)
  }
}

async function readFallbackNews(): Promise<NewsItem[]> {
  try {
    const content = await fs.readFile(FALLBACK_FILE_PATH, 'utf-8')
    return JSON.parse(content) as NewsItem[]
  } catch (err) {
    console.error('Failed to read fallback news:', err)
    // Return hardcoded fallback if file read fails
    return [
      {
        id: 'fallback-1',
        title: 'China\'s Economic Reforms Show Continued Progress',
        summary: 'Recent policy announcements highlight ongoing modernization efforts.',
        source: 'Example News',
        url: 'https://example.com',
        publishedAt: getDateKey(),
      },
    ]
  }
}

async function selectAvailableModel(client: GoogleGenAI): Promise<{ model: string; availableModels?: string[] }> {
  let availableModelNames: string[] = []
  
  try {
    if (typeof (client as any).models?.list === 'function') {
      const models = await (client as any).models.list()
      availableModelNames = Array.isArray(models) 
        ? models.map((m: any) => m.name || m).filter(Boolean)
        : []
    } else if (typeof (client as any).listModels === 'function') {
      const models = await (client as any).listModels()
      availableModelNames = Array.isArray(models)
        ? models.map((m: any) => m.name || m).filter(Boolean)
        : []
    }
  } catch (err) {
    // List API not available or failed
  }

  return { model: PREFERRED_MODELS[0], availableModels: availableModelNames }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function extractJSON(text: string): string | null {
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (jsonMatch) {
    return jsonMatch[0]
  }
  const codeBlockMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/)
  if (codeBlockMatch) {
    return codeBlockMatch[1]
  }
  return null
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const forceRefresh = url.searchParams.get('refresh') === '1'
    const today = getDateKey()

    // Debug mode: return list of available models
    if (url.searchParams.get('debug') === '1') {
      const apiKey = process.env.GEMINI_API_KEY
      if (!apiKey) {
        return NextResponse.json({ error: 'GEMINI_API_KEY not configured' })
      }
      const client = new GoogleGenAI({ apiKey })
      const modelInfo = await selectAvailableModel(client)
      return NextResponse.json({
        cachedModel: cachedModelName,
        selectedModel: modelInfo.model,
        preferredModels: PREFERRED_MODELS,
        availableModels: modelInfo.availableModels || 'Could not list (fallback mode)',
      })
    }

    // Check disk cache first (unless refresh is requested)
    if (!forceRefresh) {
      const cached = await readCacheFile()
      if (cached && cached.date === today && Array.isArray(cached.data) && cached.data.length > 0) {
        return NextResponse.json(cached.data)
      }
    }

    // Attempt Gemini API call
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      // No API key, return fallback
      const fallback = await readFallbackNews()
      return NextResponse.json({ data: fallback, isFallback: true, error: 'GEMINI_API_KEY not configured' })
    }

    const client = new GoogleGenAI({ apiKey })
    
    // Select available model
    let modelName = cachedModelName
    if (!modelName) {
      const modelInfo = await selectAvailableModel(client)
      modelName = modelInfo.model
    }

    const prompt = `Today is ${today}. Find and return the top 3 most important and current news stories from today or very recent days about Chinese political development, international relations involving China, or major policy announcements.

Return ONLY a valid JSON array with exactly 3 items, no markdown, no explanation, just the JSON:
[
  {
    "title": "News headline",
    "summary": "Brief summary in 40 words or less",
    "source": "Source name (e.g., BBC, Reuters, Xinhua)",
    "url": "Full URL to the article",
    "publishedAt": "YYYY-MM-DD"
  }
]

Ensure:
- All fields are strings
- Summary is 40 words or less
- URL is a valid, accessible link
- publishedAt is YYYY-MM-DD format
- Titles are clear and descriptive`

    let result
    let geminiError: Error | null = null
    const modelsToTry = modelName ? [modelName, ...PREFERRED_MODELS.filter(m => m !== modelName)] : PREFERRED_MODELS
    
    // Try Gemini API call
    for (const tryModel of modelsToTry) {
      try {
        result = await client.models.generateContent({
          model: tryModel,
          contents: prompt,
          tools: [{ googleSearchRetrieval: {} }],
        })
        cachedModelName = tryModel
        break
      } catch (err) {
        geminiError = err instanceof Error ? err : new Error(String(err))
        const errorMessage = geminiError.message
        // If it's a model not found error, try next model
        if (errorMessage.includes('not found') || errorMessage.includes('404')) {
          continue
        }
        // For other errors (429 quota, etc.), break and use fallback
        break
      }
    }

    // If Gemini call succeeded, process and cache the result
    if (result) {
      let text = result.text
      let jsonText = extractJSON(text) || text

      let newsItems: NewsItem[]
      try {
        newsItems = JSON.parse(jsonText)
      } catch (parseError) {
        jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim()
        try {
          newsItems = JSON.parse(jsonText)
        } catch (secondError) {
          // JSON parse failed, fall through to fallback
          result = null
        }
      }

      if (result && newsItems && Array.isArray(newsItems) && newsItems.length > 0) {
        // Transform and validate
        const transformed: NewsItem[] = newsItems.slice(0, 3).map((item) => ({
          id: `${slugify(item.title || 'news')}-${item.publishedAt || today}`,
          title: item.title || 'Untitled',
          summary: item.summary || '',
          source: item.source || 'Unknown',
          url: item.url || '',
          publishedAt: item.publishedAt || today,
        }))

        // Save to disk cache
        await writeCacheFile(transformed)

        return NextResponse.json(transformed)
      }
    }

    // Gemini call failed or returned invalid data - return fallback
    const fallback = await readFallbackNews()
    const errorMessage = geminiError
      ? (geminiError.message.includes('429') || geminiError.message.includes('RESOURCE_EXHAUSTED')
          ? 'API quota exceeded'
          : geminiError.message)
      : 'Failed to fetch news'

    return NextResponse.json({ data: fallback, isFallback: true, error: errorMessage })

  } catch (error) {
    console.error('Error fetching top news:', error)
    // Always return fallback, never 500
    const fallback = await readFallbackNews()
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ data: fallback, isFallback: true, error: errorMessage })
  }
}
