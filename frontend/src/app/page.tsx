"use client"

import { useState,useEffect,useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

export default function Home(){

const [messages,setMessages]=useState<any[]>([])
const [input,setInput]=useState("")
const [loading,setLoading]=useState(false)

const bottomRef=useRef<any>(null)

useEffect(()=>{
bottomRef.current?.scrollIntoView({behavior:"smooth"})
},[messages])

const send=async()=>{

if(!input.trim())return

const user={role:"user",content:input}

setMessages(prev=>[...prev,user])
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

setMessages(prev=>[...prev,ai])

}catch{

setMessages(prev=>[
...prev,
{role:"assistant",content:"خطا در اتصال به سرور"}
])

}

setLoading(false)

}

return(

<div className="flex flex-col h-screen">

<div className="border-b border-gray-800 p-4 text-center text-lg">
دستیار DevOps
</div>

<div className="flex-1 overflow-y-auto p-6 space-y-6">

{messages.map((m,i)=>(

<div key={i}
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
code({node,inline,className,children,...props}){

const match=/language-(\w+)/.exec(className||"")

return !inline && match ?(

<SyntaxHighlighter
style={oneDark}
language={match[1]}
PreTag="div"
>
{String(children).replace(/\n$/,"")}
</SyntaxHighlighter>

):(

<code className="bg-black px-1 py-0.5 rounded">
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
در حال فکر کردن...
</div>

)}

<div ref={bottomRef}/>

</div>

<div className="border-t border-gray-800 p-4 flex gap-3">

<input
className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-3"
placeholder="سوال DevOps بپرس..."
value={input}
onChange={(e)=>setInput(e.target.value)}
onKeyDown={(e)=>{if(e.key==="Enter")send()}}
/>

<button
onClick={send}
className="bg-blue-600 px-6 rounded-lg"
>
ارسال
</button>

</div>

</div>

)

}

