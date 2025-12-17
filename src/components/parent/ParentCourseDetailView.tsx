
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ArrowLeft, Clock, Users, Calendar, BookOpen, Play, FileText, Headphones, Image, Download, Eye, ChevronDown, ChevronUp } from "lucide-react"

interface Course {
  id: string
  name: string
  instructor: string
  artform: string
  progress: number
  nextClass?: string
  status: 'active' | 'completed' | 'paused'
}

interface ParentCourseDetailViewProps {
  course: Course
  onBack: () => void
}

const ParentCourseDetailView = ({ course, onBack }: ParentCourseDetailViewProps) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'breathing': true, // Start with Breathing Techniques expanded as shown in image
    'swar': false,
    'raag-yaman': false
  })

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }

  // Mock data based on image 5
  const moduleData = [
    {
      id: 'foundation',
      title: 'Foundation Module',
      description: 'Basic concepts and vocal exercises',
      progress: 100,
      resources: []
    },
    {
      id: 'breathing',
      title: 'Breathing Techniques',
      description: '',
      progress: 0,
      resourceCount: 2,
      resources: [
        {
          id: '1',
          name: 'Breathing Exercise Video',
          type: 'video'
        },
        {
          id: '2',
          name: 'Practice Sheet',
          type: 'document'
        }
      ]
    },
    {
      id: 'swar',
      title: 'Swar Practice',
      description: '',
      progress: 0,
      resourceCount: 2,
      resources: [
        {
          id: '3',
          name: 'Swar Exercise Audio',
          type: 'audio'
        },
        {
          id: '4',
          name: 'Swar Chart',
          type: 'image'
        }
      ]
    },
    {
      id: 'raag',
      title: 'Raag Module',
      description: 'Introduction to classical ragas',
      progress: 75,
      resources: []
    },
    {
      id: 'raag-yaman',
      title: 'Raag Yaman',
      description: '',
      progress: 0,
      resourceCount: 3,
      resources: [
        {
          id: '5',
          name: 'Yaman Scale Practice',
          type: 'audio'
        },
        {
          id: '6',
          name: 'Yaman Composition',
          type: 'video'
        },
        {
          id: '7',
          name: 'Yaman Notation',
          type: 'document'
        }
      ]
    }
  ]

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4" />
      case 'audio':
        return <Headphones className="w-4 h-4" />
      case 'document':
        return <FileText className="w-4 h-4" />
      case 'image':
        return <Image className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getResourceBadgeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-800'
      case 'audio':
        return 'bg-purple-100 text-purple-800'
      case 'document':
        return 'bg-green-100 text-green-800'
      case 'image':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </Button>

      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-lg flex-shrink-0">
            {/* Course image with gradient background */}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.artform}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Next: {course.nextClass}</span>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">{course.status}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Overall Progress</span>
                <span className="text-gray-600">8/12 topics completed</span>
              </div>
              <Progress value={course.progress} className="h-2" />
              <p className="text-sm text-gray-600">{course.progress}% Complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="topics" className="data-[state=active]:bg-white">Topics Covered</TabsTrigger>
          <TabsTrigger value="modules" className="data-[state=active]:bg-white">Modules</TabsTrigger>
          <TabsTrigger value="classes" className="data-[state=active]:bg-white">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Topics Covered in This Course</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Topics content will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          {moduleData.map((module) => {
            const isExpandable = module.resources && module.resources.length > 0
            const isExpanded = expandedModules[module.id]

            return (
              <div key={module.id} className="bg-white rounded-lg border">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{module.title}</h3>
                        {module.progress > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Progress</span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${module.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{module.progress}%</span>
                          </div>
                        )}
                      </div>
                      {module.description && (
                        <p className="text-gray-600 mb-3">{module.description}</p>
                      )}
                      {module.resourceCount && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{module.resourceCount} resources</span>
                          {isExpandable && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleModule(module.id)}
                              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable Resources */}
                {isExpandable && (
                  <Collapsible open={isExpanded} onOpenChange={() => toggleModule(module.id)}>
                    <CollapsibleContent>
                      <div className="px-6 pb-6 space-y-3">
                        {module.resources.map((resource) => (
                          <div key={resource.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                                {getResourceIcon(resource.type)}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{resource.name}</h4>
                                <Badge className={`${getResourceBadgeColor(resource.type)} text-xs`}>
                                  {resource.type}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="flex items-center gap-1">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            )
          })}
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Class schedule content will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { ParentCourseDetailView }
