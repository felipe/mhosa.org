'use client'

import { useState, useEffect } from 'react'

const newsItems = [
  "Exciting new race added to the summer schedule!",
  "Champion driver John Doe joins our association",
  "Safety improvements implemented at all our tracks",
  "Registration now open for the Fall Championship",
]

export default function NewsBanner() {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-blue-100 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <span className="font-bold text-blue-800 mr-4">Latest News:</span>
          <p className="text-blue-800">{newsItems[currentNewsIndex]}</p>
        </div>
      </div>
    </div>
  )
}

