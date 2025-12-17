
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, FileText, Play, Image, Headphones } from "lucide-react"
import type { TopicResource } from "@/data/studentCourseData"

interface ResourceViewerModalProps {
  resource: TopicResource
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResourceViewerModal({ resource, open, onOpenChange }: ResourceViewerModalProps) {

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = resource.url
    link.download = resource.title
    link.click()
  }

  const renderResourceContent = () => {
    switch (resource.type) {
      case 'image':
        return (
          <div className="w-full max-h-96 overflow-hidden rounded-lg border">
            <img
              src={resource.url}
              alt={resource.title}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
          </div>
        )

      case 'video':
        return (
          <div className="w-full rounded-lg border overflow-hidden">
            <video
              controls
              className="w-full max-h-96"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.classList.remove('hidden')
              }}
            >
              <source src={resource.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="hidden p-8 text-center">
              <Play className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Unable to load video</p>
            </div>
          </div>
        )

      case 'audio':
        return (
          <div className="w-full p-6 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-center mb-4">
              <Headphones className="w-12 h-12 text-muted-foreground" />
            </div>
            <audio
              controls
              className="w-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.classList.remove('hidden')
              }}
            >
              <source src={resource.url} type="audio/mpeg" />
              <source src={resource.url} type="audio/wav" />
              Your browser does not support the audio tag.
            </audio>
            <div className="hidden text-center mt-4">
              <p className="text-muted-foreground">Unable to load audio</p>
            </div>
          </div>
        )

      case 'document':
        return (
          <div className="w-full p-8 border rounded-lg bg-muted/50 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">{resource.title}</p>
            <p className="text-muted-foreground mb-4">
              This document will open in a new tab or download to your device.
            </p>
            <Button onClick={() => window.open(resource.url, '_blank')}>
              Open Document
            </Button>
          </div>
        )

      default:
        return (
          <div className="w-full p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Preview not available for this resource type.</p>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <DialogTitle className="text-xl">{resource.title}</DialogTitle>
            {resource.description && (
              <p className="text-muted-foreground mt-1">{resource.description}</p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </DialogHeader>

        <div className="mt-4">
          {renderResourceContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
