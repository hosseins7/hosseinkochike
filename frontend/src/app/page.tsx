"use client"

import { useState } from "react"

export default function Home() {
  const [log, setLog] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  const analyzeLog = async () => {
    try {
      setLoading(true)

      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: log
        }),
      })

      const data = await res.json()
      setResponse(data.response)

    } catch (error) {
      setResponse("Error connecting to backend")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-10 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        AI DevOps Assistant
      </h1>

      <textarea
        className="w-full border p-3 mb-4 rounded"
        rows={6}
        placeholder="Paste your server log..."
        value={log}
        onChange={(e) => setLog(e.target.value)}
      />

      <button
        onClick={analyzeLog}
        className="bg-black text-white px-6 py-2 rounded"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {response && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-bold mb-2">AI Response</h2>
          <p>{response}</p>
        </div>
      )}

    </div>
  )
}

