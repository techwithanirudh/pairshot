"use client"

import { useState, useEffect } from "react"
import { CameraInterface } from "@/components/camera-interface"
import { ProcessingScreen } from "@/components/processing-screen"
import { ResultScreen } from "@/components/result-screen"
import { Smartphone, Monitor } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function AddMeApp() {
  const [currentScreen, setCurrentScreen] = useState<"camera" | "processing" | "result">("camera")
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleImagesReady = (images: string[]) => {
    setCapturedImages(images)
    setCurrentScreen("processing")

    // Simulate AI processing time
    setTimeout(() => {
      setCurrentScreen("result")
    }, 3000)
  }

  const handleStartOver = () => {
    setCurrentScreen("camera")
    setCapturedImages([])
  }

  if (!isMobile) {
    return (
      <div className="desktop-warning min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6 glass-morphism rounded-3xl p-8">
          <div className="relative">
            <div className="w-20 h-20 mx-auto ai-gradient rounded-3xl flex items-center justify-center pulse-glow">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
              <Monitor className="w-4 h-4 text-destructive-foreground" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-foreground">Mobile Only Experience</h1>
            <p className="text-muted-foreground text-pretty">
              Add Me is designed exclusively for mobile devices. Please open this app on your smartphone to capture and
              combine photos with AI.
            </p>
          </div>

          <div className="bg-muted/50 rounded-2xl p-4 text-sm text-muted-foreground">
            <p className="font-medium mb-2">Why mobile only?</p>
            <p>
              Camera access and photo combining work best on mobile devices where you can easily switch between front
              and back cameras.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-only min-h-screen bg-background">
      {currentScreen === "camera" && <CameraInterface onImagesReady={handleImagesReady} />}
      {currentScreen === "processing" && <ProcessingScreen images={capturedImages} />}
      {currentScreen === "result" && <ResultScreen onStartOver={handleStartOver} />}
    </div>
  )
}
