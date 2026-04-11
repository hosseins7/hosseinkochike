import "./globals.css"
import { Vazirmatn } from "next/font/google"

const vazir = Vazirmatn({
  subsets:["arabic"],
  display:"swap"
})

export default function RootLayout({children}:{children:React.ReactNode}) {

  return (

    <html lang="fa" dir="rtl">

      <body className={vazir.className + " bg-[#0f172a] text-white"}>

        {children}

      </body>

    </html>

  )

}

