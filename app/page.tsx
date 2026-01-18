import Link from 'next/link'
import { newsItems } from '@/data/news'

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Top News</h1>
      
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
            <Link
              href={`/news/${item.id}`}
              className="inline-block w-fit rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Comment
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
