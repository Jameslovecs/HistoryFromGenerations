import { timelineItems } from '@/content/timeline'

export default function TimelinePage() {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Chinese Political Development Timeline</h1>
  
        <ul className="space-y-4">
          <li className="border rounded-lg p-4">
            <div className="font-semibold">1949</div>
            <div className="text-sm opacity-80">Founding of the PRC (placeholder)</div>
          </li>
          <li className="border rounded-lg p-4">
            <div className="font-semibold">2030</div>
            <div className="text-sm opacity-80">Forecast / placeholder</div>
          </li>
          <li className="border rounded-lg p-4">
            <div className="font-semibold">2050</div>
            <div className="text-sm opacity-80">Forecast / placeholder</div>
          </li>
        </ul>
      </main>
    );
  }