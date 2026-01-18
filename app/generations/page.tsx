'use client'

import { useState } from 'react'
import { generations } from '@/content/generations'

export default function Generations() {
  const [openDecade, setOpenDecade] = useState<string | null>(null)

  const toggleDecade = (decade: string) => {
    setOpenDecade(openDecade === decade ? null : decade)
  }

  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">History of Each Generation</h1>

      <div className="space-y-4">
        {generations.map((generation) => (
          <div
            key={generation.decade}
            className="rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <button
              onClick={() => toggleDecade(generation.decade)}
              className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {generation.title}
              </h2>
              <svg
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  openDecade === generation.decade ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openDecade === generation.decade && (
              <div className="border-t border-gray-200 p-6">
                <p className="text-gray-700 leading-relaxed">{generation.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
