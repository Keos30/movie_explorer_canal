'use client'

import Homepage from './main_page/page'


export default function Home() {
  return (
      <main className="dark text-foreground bg-background">
        <div
          style={{ backgroundImage: `url('/background.jpg')` }}
          className="h-screen bg-cover bg-center text-white border-b-8 border-b-solid border-b-slate-400"
        >
          <Homepage/>
        </div>
      </main>
  )
}
