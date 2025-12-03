import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [generated, setGenerated] = useState('')

  const generate = (e) => {
    e.preventDefault()
    if (!input) return
    const encoded = encodeURIComponent(input)
    const link = `${window.location.origin}/track?url=${encoded}`
    setGenerated(link)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4">Trackable Link Generator</h1>
        <p className="mb-4 text-sm text-gray-600">Paste any product URL (Amazon, Flipkart, etc.) and generate a trackable redirect that asks visitors for consent before redirecting.</p>

        <form onSubmit={generate} className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="https://www.amazon.in/...."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="url"
            required
          />
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Generate</button>
            <button type="button" onClick={() => { setInput(''); setGenerated('') }} className="px-4 py-2 border rounded">Reset</button>
          </div>
        </form>

        {generated && (
          <div className="mt-4">
            <label className="text-xs text-gray-500">Share this link:</label>
            <textarea className="w-full mt-1 border rounded p-2" rows={3} value={generated} readOnly />
            <p className="text-xs text-gray-500 mt-2">When a visitor opens this link they'll see a consent page, and then be redirected to the product.</p>
          </div>
        )}

        <hr className="my-4" />
        <p className="text-xs text-gray-500">Admin: visit <code>/api/admin?token=YOUR_ADMIN_TOKEN</code> to see recent visits (replace YOUR_ADMIN_TOKEN with the env var you set).</p>
      </div>
    </div>
  )
}
