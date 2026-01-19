'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  url: string
  publishedAt: string
}

interface NewsResponse {
  data?: NewsItem[]
  isFallback?: boolean
  error?: string
}

export default function Home() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFallback, setIsFallback] = useState(false)

  const fetchNews = async () => {
    setLoading(true)
    setError(null)
    setIsFallback(false)
    try {
      const response = await fetch('/api/top-news')
      // Always parse JSON even if response is not OK (fallback will be returned)
      const responseData: NewsResponse | NewsItem[] = await response.json()
      
      // Handle both old array format and new wrapper format
      if (Array.isArray(responseData)) {
        // Old format: array directly
        setNewsItems(responseData)
      } else if (responseData.isFallback) {
        // New format: wrapper with isFallback flag
        setIsFallback(true)
        setNewsItems(responseData.data || [])
      } else {
        // Fallback for any other structure
        setNewsItems(responseData.data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Top News</h1>

      {isFallback && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Showing fallback news (API quota exceeded).
        </div>
      )}

      {loading && (
        <div className="py-12 text-center text-gray-600">Loading...</div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="mb-4 text-red-800">{error}</p>
          <button
            onClick={fetchNews}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                {item.title}
              </h2>
              <p className="mb-4 flex-grow text-gray-600 line-clamp-3">
                {item.summary}
              </p>
              <div className="mb-4 text-xs text-gray-500">
                {item.source} • {item.publishedAt}
              </div>
              <div className="flex gap-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Read
                </a>
                <Link
                  href={`/news/${item.id}`}
                  className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Comment
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
