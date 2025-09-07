"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Plus, X, FlipHorizontal, Settings } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

interface CameraInterfaceProps {
  onImagesReady: (images: string[]) => void
}

export function CameraInterface({ onImagesReady }: CameraInterfaceProps) {
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [showDock, setShowDock] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [facingMode])

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })

      setStream(newStream)
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      // Play capture sound
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/JdSYE",
      )
      audio.volume = 0.3
      audio.play().catch(() => {}) // Ignore errors if audio can't play

      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedImages([...capturedImages, imageDataUrl])
        setShowDock(true)
      }
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = capturedImages.filter((_, i) => i !== index)
    setCapturedImages(updatedImages)
  }

  const toggleCamera = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user")
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/10 to-pink-500/20" />

      <div className="absolute inset-0">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 backdrop-blur-[0.5px]" />

        {/* Camera grid overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="33.33" y1="0" x2="33.33" y2="100" stroke="white" strokeWidth="0.3" />
            <line x1="66.66" y1="0" x2="66.66" y2="100" stroke="white" strokeWidth="0.3" />
            <line x1="0" y1="33.33" x2="100" y2="33.33" stroke="white" strokeWidth="0.3" />
            <line x1="0" y1="66.66" x2="100" y2="66.66" stroke="white" strokeWidth="0.3" />
          </svg>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-10 pt-12 pb-4"
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <div className="flex items-center justify-between px-6 relative z-10">
          <div className="flex items-center space-x-3">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center"
            >
              <Camera className="w-4 h-4 text-white" />
            </motion.div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
              <h1 className="text-white font-bold text-lg">Add Me</h1>
              <p className="text-white/90 text-sm">Take photos to combine</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 backdrop-blur-md border border-white/20"
                onClick={toggleCamera}
              >
                <FlipHorizontal className="w-5 h-5" />
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 backdrop-blur-md border border-white/20"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {capturedImages.length > 0 && showDock && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-10 px-4 w-full max-w-sm"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-2xl">
              <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide">
                {capturedImages.slice(-4).map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 300, delay: index * 0.1 }}
                    className="relative flex-shrink-0"
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 bg-white/5 backdrop-blur-sm">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => removeImage(capturedImages.length - 4 + index)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/20"
                    >
                      <X className="w-3 h-3 text-white" />
                    </motion.button>
                  </motion.div>
                ))}

                {capturedImages.length > 4 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-shrink-0 w-16 h-16 rounded-2xl border-2 border-dashed border-white/40 flex items-center justify-center bg-white/5 backdrop-blur-sm"
                  >
                    <span className="text-white/60 text-xs font-medium">+{capturedImages.length - 4}</span>
                  </motion.div>
                )}

                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-white/40 flex items-center justify-center flex-shrink-0 bg-white/5 backdrop-blur-sm">
                  <Plus className="w-6 h-6 text-white/60" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="flex items-center justify-center space-x-8">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xl border border-white/30 text-white hover:bg-white/25 shadow-lg"
            >
              <div className="w-6 h-6 bg-white/60 rounded-sm" />
            </Button>
          </motion.div>

          <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", damping: 15, stiffness: 400 }}
          >
            <Button
              onClick={handleCapture}
              className="relative w-20 h-20 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl border-2 border-white/40 hover:from-white/40 hover:to-white/20 transition-all duration-300 shadow-2xl group"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-inner border border-white/50 group-active:scale-95 transition-transform" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/10 to-transparent" />
            </Button>
          </motion.div>

          {capturedImages.length >= 2 ? (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => onImagesReady(capturedImages)}
                className="bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-xl border border-white/30 hover:from-blue-600/90 hover:to-purple-700/90 text-white px-6 py-3 rounded-full font-medium shadow-xl"
              >
                Combine
              </Button>
            </motion.div>
          ) : (
            <div className="w-12 h-12" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {capturedImages.length > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute top-32 right-6 z-10"
          >
            <div className="bg-black/30 backdrop-blur-xl rounded-full px-3 py-1 border border-white/20">
              <span className="text-white text-sm font-medium">{capturedImages.length}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
