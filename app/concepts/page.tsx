import { concepts, definitionsAndDifferences } from '@/content/concepts'

export default function Concepts() {
  return (
    <div className="max-w-4xl space-y-12">
      <h1 className="text-4xl font-bold text-gray-900">Chinese Political Development</h1>

      <div className="space-y-8">
        {concepts.map((concept, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              {concept.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">{concept.description}</p>
          </div>
        ))}
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
          Definitions and Differences
        </h2>
        <ul className="space-y-2">
          {definitionsAndDifferences.map((item, index) => (
            <li key={index} className="flex items-start text-gray-700">
              <span className="mr-2 text-blue-600">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
