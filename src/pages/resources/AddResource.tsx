
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { MultiSelect } from "@/components/ui/multi-select"
import { Save, ArrowLeft, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { artForms, languages } from "@/data/resourceData"

const AddResource = () => {
  const navigate = useNavigate()
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    artForms: [] as string[],
    assignedCourses: [] as string[],
    classLevels: [] as string[],
    assignedInstructors: [] as string[],
    resourceType: '',
    visibility: 'Public' as 'Public' | 'Private',
    accessType: 'Downloadable' as 'View Only' | 'Downloadable',
    tags: '',
    language: 'English'
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadedFile) {
      toast.error('Please upload a file')
      return
    }
    toast.success('Resource uploaded successfully!')
    navigate('/resources/manage')
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      artForms: [],
      assignedCourses: [],
      classLevels: [],
      assignedInstructors: [],
      resourceType: '',
      visibility: 'Public',
      accessType: 'Downloadable',
      tags: '',
      language: 'English'
    })
    setUploadedFile(null)
    setThumbnailFile(null)
  }

  const artFormOptions = artForms.map(form => ({ label: form, value: form }))
  const classLevelOptions = [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' }
  ]

  return (
    <DashboardLayout title="Add New Resource">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/resources/manage')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
              Add New Resource
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Upload and configure a new educational resource
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Upload File</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Main File Upload */}
                <div className="space-y-2">
                  <Label>Resource File *</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {uploadedFile ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Upload className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-600">{uploadedFile.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setUploadedFile(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-12 w-12 mx-auto text-gray-400" />
                        <div>
                          <p className="text-lg font-medium">Drop your file here</p>
                          <p className="text-sm text-muted-foreground">
                            Supports PDF, MP4, JPG, PNG, MP3, PPTX, DOCX
                          </p>
                        </div>
                        <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.mp4,.jpg,.jpeg,.png,.mp3,.pptx,.docx"
                    onChange={handleFileUpload}
                  />
                </div>

                {/* Thumbnail Upload */}
                <div className="space-y-2">
                  <Label>Preview Thumbnail (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="flex-1"
                    />
                    {thumbnailFile && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600">{thumbnailFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setThumbnailFile(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resource Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Resource Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="title">Resource Title *</Label>
                <Input 
                  id="title" 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                  required 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Resource Type</Label>
                <Select value={formData.resourceType} onValueChange={(value) => setFormData(prev => ({...prev, resourceType: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="PDF">Notes/PDF</SelectItem>
                    <SelectItem value="Audio">Audio</SelectItem>
                    <SelectItem value="Image">Image</SelectItem>
                    <SelectItem value="Assignment">Assignment</SelectItem>
                    <SelectItem value="Sheet Music">Sheet Music</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({...prev, language: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Art Forms</Label>
                <MultiSelect
                  options={artFormOptions}
                  selected={formData.artForms}
                  onChange={(selected) => setFormData(prev => ({...prev, artForms: selected}))}
                  placeholder="Select art forms..."
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input 
                  id="tags" 
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({...prev, tags: e.target.value}))}
                  placeholder="e.g., beginner, theory, practice"
                />
              </div>
            </CardContent>
          </Card>

          {/* Assignment & Visibility */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Assignment & Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Class Levels</Label>
                <MultiSelect
                  options={classLevelOptions}
                  selected={formData.classLevels}
                  onChange={(selected) => setFormData(prev => ({...prev, classLevels: selected}))}
                  placeholder="Select class levels..."
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <Select value={formData.visibility} onValueChange={(value: 'Public' | 'Private') => setFormData(prev => ({...prev, visibility: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Public">Public</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Access Type</Label>
                  <Select value={formData.accessType} onValueChange={(value: 'View Only' | 'Downloadable') => setFormData(prev => ({...prev, accessType: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="View Only">View Only</SelectItem>
                      <SelectItem value="Downloadable">Downloadable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              Reset Form
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Upload & Save
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default AddResource
