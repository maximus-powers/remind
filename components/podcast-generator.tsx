"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function PodcastGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'processing' | 'error' | 'done'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval)
            return 100
          }
          return prevProgress + 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isGenerating])

  const handleGenerate = async () => {
    setIsGenerating(true)
    setProgress(0)
    setStatus('processing')
    setStatusMessage('Writing lesson script')
    try {
      const response = await fetch('/api/data/audio', { method: 'POST' })
      const result = await response.json()
      if (response.ok) {
        setProgress(25)
        setStatusMessage('Converting script to audio')
        const script = result.script
        const rowId = result.rowId
        const sections = ['section1', 'section2', 'section3']

        for (const section of sections) {
            setStatusMessage(`Converting script to audio for ${script[section].tab_name}`)
          const sectionResponse = await fetch(`/api/data/audio/${section}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ section: script[section], sectionKey: section, rowId }),
          })

          if (!sectionResponse.ok) {
            throw new Error(`Error processing section: ${section}`)
          }

          if (section === 'section1') {
            setProgress(50)
          } else if (section === 'section2') {
            setProgress(75)
          } else {
            setProgress(100)
            setStatus('done')
          }
        }

        setStatusMessage('Podcast generated successfully!')
      } else {
        console.error(result.error)
        setStatus('error')
        setStatusMessage('Error occurred. Please try again.')
      }
    } catch (error) {
      console.error(error)
      setStatus('error')
      setStatusMessage('Error occurred. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="mx-auto p-1 mb-5">
      <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
        Generate Podcast
      </Button>
      {isGenerating && (
        <div className="">
          <Progress value={progress} className="w-full my-2" />
          <p className="text-center text-sm text-gray-500">{progress.toFixed(0)}% - {statusMessage}</p>
        </div>
      )}
      {status === 'error' && <p className="text-center text-sm text-red-500">Error occurred. Please try again.</p>}
      {status === 'done' && <p className="text-center text-sm text-green-500">Podcast generated successfully!</p>}
    </div>
  )
}

