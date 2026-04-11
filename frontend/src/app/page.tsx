"use client"

import {useState,useEffect,useRef} from "react"
import {v4 as uuid} from "uuid"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import {oneDark} from "react-syntax-highlighter/dist/esm/styles/prism"
import {loadChats,saveChats} from "../lib/chat"

export default function Home(){

const [chats,setChats]=useState<any>({})
const [chatId,setChatId]=useState("")
const [input,setInput]=useState("")
const [loading,setLoading]=useState(false)

const bottomRef=useRef<any>(null)

useEffect(()=>{

const data=loadChats()

setChats(data)

const first=Object.keys(data)[0]

if(first) setChatId(first)

},[])

useEffect(()=>{

bottomRef.current?.scrollIntoView({behavior:"smooth"})

},[chats])

const newChat=()=>{

const id=uuid()

const newChats={...chats,[id]:[]}

setChats(newChats)

setChatId(id)

saveChats(newChats)

}

const send=async()=>{

if(!input.trim())return

const user={role:"user",content:input}

const updated={

...chats,
[chatId]:[...chats[chatId],user]

}

setChats(updated)

saveChats(updated)

setInput("")

setLoading(true)

try{

const res=await fetch("http://localhost:8000/ask",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({prompt:input})
})

const data=await res.json()

const ai={role:"assistant",content:data.response}

const updated2={

...updated,
[chatId]:[...updated[chatId],ai]

}

setChats(updated2)

saveChats(updated2)

}catch{

}

setLoading(false)

}

const messages=chats[chatId]||[]

return(

<div className="flex h-screen">

<div className="w-64 bg-[#020617] border-r border-gray-800 p-4 space-y-4">

<div className="text-lg">DevOps Copilot</div>

<button
onClick={newChat}
className="w-full bg-blue-600 p-2 rounded"
>
+ New Chat
</button>

<div className="space-y-2">

{Object.keys(chats).map(id=>(

<div
key={id}
onClick={()=>setChatId(id)}
className="p-2 bg-gray-900 rounded cursor-pointer"
>

Chat {id.slice(0,4)}

</div>

))}

</div>

</div>

<div className="flex-1 flex flex-col">

<div className="border-b border-gray-800 p-4">
AI DevOps Assistant
</div>

<div className="flex-1 overflow-y-auto p-6 space-y-6">

{messages.map((m:any,i:number)=>(

<div
key={i}
className={
m.role==="user"
?"flex justify-start"
:"flex justify-end"
}
>

<div
className={
m.role==="user"
?"bg-blue-600 p-4 rounded-xl max-w-xl"
:"bg-gray-900 border border-gray-800 p-4 rounded-xl max-w-xl"
}
>

<ReactMarkdown
remarkPlugins={[remarkGfm]}
components={{
code({inline,className,children}){

const match=/language-(\w+)/.exec(className||"")

return !inline && match?(
<SyntaxHighlighter
style={oneDark}
language={match[1]}
>
{String(children)}
</SyntaxHighlighter>
):(
<code className="bg-black px-1 rounded">
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

{loading &&(

<div className="text-gray-400">
thinking...
</div>

)}

<div ref={bottomRef}/>

</div>

<div className="border-t border-gray-800 p-4 flex gap-3">

<input
className="flex-1 bg-gray-900 border border-gray-700 p-3 rounded"
value={input}
onChange={(e)=>setInput(e.target.value)}
onKeyDown={(e)=>{if(e.key==="Enter")send()}}
placeholder="Ask about Docker, Kubernetes..."
/>

<button
onClick={send}
className="bg-blue-600 px-6 rounded"
>
Send
</button>

</div>

</div>

</div>

)

}

