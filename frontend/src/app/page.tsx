"use client"

import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { loadChats, saveChats } from "../lib/chat"

export default function Home() {

  const [chats, setChats] = useState<any>({})
  const [chatId, setChatId] = useState("")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const bottomRef = useRef<any>(null)

  useEffect(() => {
    const data = loadChats()
    setChats(data)
    const first = Object.keys(data)[0]
    if (first) setChatId(first)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chats])

  const newChat = () => {
    const id = crypto.randomUUID()
    const newChats = { ...chats, [id]: [] }
    setChats(newChats)
    setChatId(id)
    saveChats(newChats)
  }

  const send = async () => {
    if (!input.trim()) return

    const user = { role: "user", content: input }
    const updated = { ...chats, [chatId]: [...(chats[chatId] || []), user] }

    setChats(updated)
    saveChats(updated)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      })

      const data = await res.json()
      const ai = { role: "assistant", content: data.response }
      const updated2 = { ...updated, [chatId]: [...updated[chatId], ai] }

      setChats(updated2)
      saveChats(updated2)

    } catch (e) {
      const ai = { role: "assistant", content: "Error connecting to backend" }
      const updated2 = { ...updated, [chatId]: [...updated[chatId], ai] }
      setChats(updated2)
    }

    setLoading(false)
  }

  const messages = chats[chatId] || []

  return (
    <div style={{ display: "flex", height: "100vh", background: "#020617", color: "white" }}>

      {/* SIDEBAR */}
      <div style={{ width: "250px", borderRight: "1px solid #1e293b", padding: "20px" }}>
        <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>DevOps Copilot</div>

        <button 
          onClick={newChat} 
          style={{ width: "100%", background: "#2563eb", padding: "10px", borderRadius: "6px", marginBottom: "20px" }}>
          + New Chat
        </button>

        {Object.keys(chats).map(id => (
          <div 
            key={id} 
            onClick={() => setChatId(id)}
            style={{ padding: "10px", background: "#0f172a", marginBottom: "8px", borderRadius: "6px", cursor: "pointer" }}
          >
            Chat {id.slice(0, 4)}
          </div>
        ))}
      </div>

      {/* MAIN AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        <div style={{ borderBottom: "1px solid #1e293b", padding: "15px" }}>
          AI DevOps Assistant
        </div>

        {/* CHAT */}
        <div style={{ flex: 1, overflowY: "auto", padding: "25px" }}>

          {messages.map((m: any, i: number) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-start" : "flex-end", marginBottom: "15px" }}>
              <div style={{
                background: m.role === "user" ? "#2563eb" : "#0f172a",
                padding: "12px",
                borderRadius: "10px",
                maxWidth: "600px",
                border: m.role === "user" ? "none" : "1px solid #1e293b"
              }}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || "")
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code style={{ background: "black", padding: "2px 5px", borderRadius: "4px" }}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && <div style={{ color: "gray" }}>thinking...</div>}

          <div ref={bottomRef} />
        </div>

        {/* INPUT AREA */}
        <div style={{ borderTop: "1px solid #1e293b", padding: "15px", display: "flex", gap: "10px" }}>
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Ask about Docker, Kubernetes..."
            style={{ flex: 1, padding: "10px", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "white" }}
          />

          <button 
            onClick={send}
            style={{ background: "#2563eb", padding: "10px 20px", borderRadius: "6px" }}>
            Send
          </button>
        </div>

      </div>
    </div>
  )
}

