"use client"

import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"

export default function Home() {

  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async () => {

    if (!input.trim()) return

    const userMessage = {
      role: "user",
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {

      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: input
        })
      })

      const data = await res.json()

      const aiMessage = {
        role: "assistant",
        content: data.response
      }

      setMessages(prev => [...prev, aiMessage])

    } catch {

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Error connecting to backend"
        }
      ])
    }

    setLoading(false)
  }

  const handleKey = (e:any) => {

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }

  }

  return (

    <div className="flex h-screen bg-gray-950 text-gray-100">

      {/* SIDEBAR */}

      <div className="w-64 border-r border-gray-800 flex flex-col">

        <div className="p-4 font-bold text-lg">
          ⚙️ DevOps Copilot
        </div>

        <button
          onClick={()=>setMessages([])}
          className="mx-3 mb-4 p-2 bg-gray-800 rounded hover:bg-gray-700"
        >
          + New Chat
        </button>

        <div className="px-3 text-sm text-gray-400 mb-2">
          Tools
        </div>

        <div className="px-3 space-y-2 text-sm">

          <div className="p-2 rounded bg-gray-900">
            Docker Logs
          </div>

          <div className="p-2 rounded bg-gray-900">
            Kubernetes YAML
          </div>

          <div className="p-2 rounded bg-gray-900">
            CI/CD Debug
          </div>

          <div className="p-2 rounded bg-gray-900">
            Image Analysis
          </div>

        </div>

      </div>

      {/* MAIN */}

      <div className="flex flex-col flex-1">

        {/* HEADER */}

        <div className="border-b border-gray-800 p-4 flex justify-between">

          <div className="font-semibold">
            AI DevOps Assistant
          </div>

          <div className="text-sm text-green-400">
            llama3:8b
          </div>

        </div>

        {/* CHAT */}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {messages.map((msg, i) => (

            <div
              key={i}
              className={`max-w-3xl ${
                msg.role === "user"
                  ? "ml-auto"
                  : ""
              }`}
            >

              <div
                className={`p-4 rounded-xl ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-900 border border-gray-800"
                }`}
              >

                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>

              </div>

            </div>

          ))}

          {loading && (

            <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl w-24">

              <div className="flex gap-1">

                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"/>

                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"/>

                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"/>

              </div>

            </div>

          )}

          <div ref={bottomRef} />

        </div>

        {/* INPUT */}

        <div className="border-t border-gray-800 p-4">

          <div className="flex gap-3">

            <textarea
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-3 resize-none focus:outline-none"
              rows={2}
              placeholder="Ask about Docker, Kubernetes, CI/CD..."
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              onKeyDown={handleKey}
            />

            <button
              onClick={sendMessage}
              className="px-6 bg-blue-600 rounded-lg hover:bg-blue-500"
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

