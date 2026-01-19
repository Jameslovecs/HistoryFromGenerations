'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  url: string
  publishedAt: string
}

interface Comment {
  id: string
  name: string
  comment: string
  timestamp: number
}

const STORAGE_KEY_PREFIX = 'news_comments_'

export default function NewsDetail() {
  const params = useParams()
  const id = params.id as string
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentName, setCommentName] = useState('')
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<Comment[]>([])

  // Load comments from localStorage
  useEffect(() => {
    if (id) {
      const storageKey = `${STORAGE_KEY_PREFIX}${id}`
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        try {
          setComments(JSON.parse(stored))
        } catch (err) {
          console.error('Failed to load comments:', err)
        }
      }
    }
  }, [id])

  // Fetch news item
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/top-news')
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }
        const data = await response.json()
        const found = data.find((item: NewsItem) => item.id === id)
        if (found) {
          setNewsItem(found)
        } else {
          setError('News not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchNews()
    }
  }, [id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) {
      return
    }

    const newComment: Comment = {
      id: `${Date.now()}-${Math.random()}`,
      name: commentName.trim() || 'Anonymous',
      comment: commentText.trim(),
      timestamp: Date.now(),
    }

    const updatedComments = [...comments, newComment]
    setComments(updatedComments)

    // Persist to localStorage
    const storageKey = `${STORAGE_KEY_PREFIX}${id}`
    localStorage.setItem(storageKey, JSON.stringify(updatedComments))

    setCommentName('')
    setCommentText('')
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (error || !newsItem) {
    return (
      <div className="py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          {error || 'News not found'}
        </h1>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-8">
      <article className="space-y-6">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            {newsItem.title}
          </h1>
          <div className="mb-4 text-sm text-gray-600">
            <span className="font-medium">{newsItem.source}</span>
            {' • '}
            <span>{newsItem.publishedAt}</span>
          </div>
        </div>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed">{newsItem.summary}</p>
        </div>
        <a
          href={newsItem.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Visit source →
        </a>
      </article>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">Comments</h2>

        <div className="mb-6 space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-md border border-gray-200 bg-gray-50 p-4"
              >
                <div className="mb-1 text-sm font-medium text-gray-900">
                  {comment.name}
                </div>
                <p className="text-gray-700">{comment.comment}</p>
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(comment.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={commentName}
            onChange={(e) => setCommentName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment... *"
            rows={4}
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Submit Comment
          </button>
        </form>
      </section>
    </div>
  )
}
