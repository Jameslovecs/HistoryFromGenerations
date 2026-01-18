'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { newsItems } from '@/data/news'

export default function NewsDetail() {
  const params = useParams()
  const id = params.id as string
  const newsItem = newsItems.find((item) => item.id === id)

  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<string[]>([])

  if (!newsItem) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">News not found</h1>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentText.trim()) {
      setComments([...comments, commentText])
      setCommentText('')
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <article className="space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">{newsItem.title}</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed">{newsItem.content}</p>
        </div>
      </article>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">Comments</h2>
        
        <div className="mb-6 space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment, index) => (
              <div
                key={index}
                className="rounded-md border border-gray-200 bg-gray-50 p-4"
              >
                <p className="text-gray-700">{comment}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment..."
            rows={4}
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
