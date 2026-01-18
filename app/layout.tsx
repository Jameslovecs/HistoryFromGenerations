import type { Metadata } from 'next'
import Navigation from './components/Navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'History From Generations',
  description: 'Understanding Chinese political development through history and generations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  )
}
