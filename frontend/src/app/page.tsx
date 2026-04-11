"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();

      const aiMessage = {
        role: "assistant",
        content: data.response || "No response",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to backend" },
      ]);
    }

    setLoading(false);
  };

  const handleKey = (e: any) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <main className="flex flex-col h-screen bg-gray-900 text-white">
      
      <div className="p-4 border-b border-gray-700 text-lg font-semibold">
        DevOps AI Assistant
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xl p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-600 ml-auto"
                : "bg-gray-700"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="bg-gray-700 p-3 rounded-lg w-fit">
            thinking...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700 flex gap-2">
        <input
          className="flex-1 p-3 rounded bg-gray-800 border border-gray-700"
          placeholder="Ask something about DevOps..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-5 py-3 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </main>
  );
}

