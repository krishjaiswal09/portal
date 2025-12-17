
import React, { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BannerData {
  id: string
  banner_link: string
  banner_title: string
  description: string
  cta_button: string
  cta_button_link: string
}

interface AdminBannerSectionProps {
  banners: BannerData[]
}

export function AdminBannerSection({ banners }: AdminBannerSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length)
      }, 5000) // Auto-advance every 5 seconds

      return () => clearInterval(interval)
    }
  }, [banners.length])

  if (!banners || banners.length === 0) return null

  const currentBanner = banners[currentIndex]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <Card className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-orange-500 to-pink-500">
        {currentBanner.banner_link && (
          <img
            src={currentBanner.banner_link}
            alt={currentBanner.banner_title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60" />

        <div className="relative z-10 p-6 h-full flex flex-col justify-center text-white">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-2">
            {currentBanner.banner_title}
          </h2>
          <p className="text-lg mb-4 opacity-90">
            {currentBanner.description}
          </p>
          <Button
            className="bg-white text-orange-600 hover:bg-gray-100 w-fit font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => window.open(currentBanner.cta_button_link, '_blank')}
          >
            {currentBanner.cta_button}
          </Button>
        </div>

        {banners.length > 1 && (
          <>
            <Button
              onClick={prevSlide}
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 border-0 rounded-full w-12 h-12 transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              onClick={nextSlide}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 border-0 rounded-full w-12 h-12 transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-125 shadow-lg' : 'bg-white/50 hover:bg-white/75'
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
