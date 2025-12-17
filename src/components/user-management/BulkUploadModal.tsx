
import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Upload, Download, CheckCircle, XCircle, FileText, AlertTriangle } from "lucide-react"

interface BulkUploadModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

interface UploadResult {
  row: number
  name: string
  email: string
  status: 'success' | 'error'
  error?: string
}

export function BulkUploadModal({ isOpen, onOpenChange }: BulkUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type === 'text/csv') {
      setSelectedFile(files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const simulateUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)
    
    // Simulate processing rows
    const mockResults: UploadResult[] = [
      { row: 1, name: 'John Doe', email: 'john@example.com', status: 'success' },
      { row: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'success' },
      { row: 3, name: 'Bob Wilson', email: 'invalid-email', status: 'error', error: 'Invalid email format' },
      { row: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'success' },
      { row: 5, name: '', email: 'missing@example.com', status: 'error', error: 'Name is required' },
    ]

    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 500))
      setUploadProgress(i)
    }

    setUploadResults(mockResults)
    setIsUploading(false)
  }

  const downloadSampleCSV = () => {
    const csvContent = `Name,Email,Role,Country,Age Type,Phone
Priya Sharma,priya@example.com,instructor,India,adult,+91 98765 43210
John Smith,john@example.com,student,United States,adult,+1 555 123 4567
Emma Johnson,emma@example.com,student,United States,kid,`

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_users.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const resetUpload = () => {
    setSelectedFile(null)
    setUploadResults([])
    setUploadProgress(0)
    setIsUploading(false)
  }

  const successCount = uploadResults.filter(r => r.status === 'success').length
  const errorCount = uploadResults.filter(r => r.status === 'error').length

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair text-foreground">
            Bulk User Import
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto">
          {/* Instructions */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Import Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-foreground">
                Upload a CSV file with user information. The file should contain the following columns:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <span>• Name (required)</span>
                <span>• Email (required)</span>
                <span>• Role (student, instructor, parent)</span>
                <span>• Country</span>
                <span>• Age Type (kid, adult)</span>
                <span>• Phone (optional)</span>
              </div>
              <Button
                onClick={downloadSampleCSV}
                variant="outline"
                size="sm"
                className="border-border text-foreground hover:bg-accent"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Sample CSV
              </Button>
            </CardContent>
          </Card>

          {/* Upload Area */}
          {!uploadResults.length && (
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground text-lg mb-2">
                    Drag and drop your CSV file here
                  </p>
                  <p className="text-muted-foreground mb-4">or</p>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button
                        asChild
                        variant="outline"
                        className="border-border text-foreground hover:bg-accent"
                      >
                        <span>Choose File</span>
                      </Button>
                    </label>
                    
                    {selectedFile && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-foreground">Selected: {selectedFile.name}</p>
                        <p className="text-muted-foreground text-sm">
                          Size: {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedFile && !isUploading && (
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={simulateUpload}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Start Import
                    </Button>
                    <Button
                      onClick={resetUpload}
                      variant="outline"
                      className="border-border text-foreground hover:bg-accent"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">Processing users...</span>
                    <span className="text-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Results */}
          {uploadResults.length > 0 && !isUploading && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center justify-between">
                  <span>Import Results</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-500">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      {successCount} Success
                    </span>
                    <span className="text-red-500">
                      <XCircle className="w-4 h-4 inline mr-1" />
                      {errorCount} Errors
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {uploadResults.map((result) => (
                    <div
                      key={result.row}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        result.status === 'success'
                          ? 'bg-green-500/20 border border-green-500/30'
                          : 'bg-red-500/20 border border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {result.status === 'success' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <div>
                          <p className="text-foreground font-medium">
                            Row {result.row}: {result.name || 'N/A'}
                          </p>
                          <p className="text-muted-foreground text-sm">{result.email}</p>
                          {result.error && (
                            <p className="text-red-500 text-sm">{result.error}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={resetUpload}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Import Another File
                  </Button>
                  {errorCount > 0 && (
                    <Button
                      variant="outline"
                      className="border-border text-foreground hover:bg-accent"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Retry Failed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
