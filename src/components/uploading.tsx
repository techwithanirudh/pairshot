'use client'

import { useEffect, useState } from 'react'
import { Loader } from '@/components/ai-elements/loader'

interface UploadingProps {
  images: string[] // data URLs
  onComplete: (uploadedUrls: string[]) => void
}

export function Uploading({ images, onComplete }: UploadingProps) {
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function uploadAll() {
      try {
        const uploaded: string[] = []

        for (let i = 0; i < images.length; i++) {
          const dataUrl = images[i]
          const res = await fetch(dataUrl)
          const blob = await res.blob()
          const file = new File([blob], `capture-${Date.now()}-${i}.jpg`, {
            type: blob.type || 'image/jpeg',
          })

          const fd = new FormData()
          fd.append('file', file)

          const resp = await fetch('/api/files/upload', {
            method: 'POST',
            body: fd,
          })

          if (!resp.ok) throw new Error('Upload failed')
          const data = await resp.json()
          const url = data.url ?? data.pathname ?? null
          if (url) uploaded.push(url)

          if (!mounted) return
          setProgress(Math.round(((i + 1) / images.length) * 100))
        }

        if (mounted) onComplete(uploaded)
      } catch (err) {
        console.error('Upload error', err)
        if (mounted) setError('Upload failed')
      }
    }

    uploadAll()

    return () => {
      mounted = false
    }
  }, [images, onComplete])

  return (
    <div className='flex h-full flex-col items-center justify-center gap-4'>
      <Loader />
      <div className='text-center'>Uploading images... {progress}%</div>
      {error && <div className='text-destructive'>{error}</div>}
    </div>
  )
}

export default Uploading
