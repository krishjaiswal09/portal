
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getStudentCourseModules } from "@/data/studentCourseData"
import { FileText, Play, Image, Headphones, Download, Eye } from "lucide-react"
import { useEffect, useState } from "react"
import { ResourceViewerModal } from "@/components/student/ResourceViewerModal"
import type { TopicResource } from "@/data/studentCourseData"
import { useQuery } from "@tanstack/react-query"
import { Course, CourseTopic } from "@/types/course"
import { fetchApi } from "@/services/api/fetchApi"

interface ModulesTabProps {
  courseId: string
}

export function ModulesTab({ courseId }: ModulesTabProps) {
  const [modules, setModules] = useState<CourseTopic[]>([])
  const [selectedResource, setSelectedResource] = useState<TopicResource | null>(null)
  const getCourseQueries = useQuery({
    queryKey: ["getCourseQueries", courseId],
    queryFn: () =>
      fetchApi<Course>({
        path: `courses/${courseId}`
      }),
    enabled: !!courseId
  })

  useEffect(() => {
    if (!getCourseQueries.isLoading && getCourseQueries.data) {
      setModules(getCourseQueries.data.topics)
    }
  }, [getCourseQueries.isLoading, getCourseQueries.data])

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />
      case 'audio': return <Headphones className="w-4 h-4" />
      case 'image': return <Image className="w-4 h-4" />
      case 'document': return <FileText className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getResourceBadgeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800'
      case 'audio': return 'bg-purple-100 text-purple-800'
      case 'image': return 'bg-blue-100 text-blue-800'
      case 'document': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {modules.map((module) => (
        <Card key={module.id}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
                <p className="text-muted-foreground mt-1">{module.description}</p>
              </div>
              <div className="text-right">
                {/* <p className="text-sm text-muted-foreground mb-1">Progress</p> */}
                <div className="flex items-center gap-2">
                  {/* <Progress value={module.progress_check} className="w-20 h-2" />
                  <span className="text-sm font-medium">{module.progress_check}%</span> */}
                </div>
              </div>

            </div>
            <div className="space-y-3 pt-2">
              {module.resources?.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0">
                      {getResourceIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{resource.title}</p>
                    </div>
                    <Badge className={getResourceBadgeColor(resource.type)}>
                      {resource.type}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedResource(resource)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        // Handle download
                        const link = document.createElement('a')
                        link.href = resource.url
                        link.download = resource.title
                        link.click()
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {module.resources?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-8 mx-auto mb-2" />
                  <p className="text-sm">No resources available for this topic yet.</p>
                </div>
              )}

            </div>
          </CardHeader>

          <CardContent>
            <Accordion type="multiple" className="w-full">
              {module.subtopics.map((topic) => (
                <AccordionItem key={topic.id} value={topic.id}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{topic.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {topic.resources?.length} resource{topic.resources?.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {topic.resources?.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex-shrink-0">
                              {getResourceIcon(resource.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{resource.title}</p>
                            </div>
                            <Badge className={getResourceBadgeColor(resource.type)}>
                              {resource.type}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedResource(resource)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                // Handle download
                                const link = document.createElement('a')
                                link.href = resource.url
                                link.download = resource.title
                                link.click()
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {topic.resources?.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">No resources available for this topic yet.</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}

      {modules?.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No modules available
            </h3>
            <p className="text-sm text-muted-foreground">
              Course modules will appear here as they become available.
            </p>
          </CardContent>
        </Card>
      )}

      {selectedResource && (
        <ResourceViewerModal
          resource={selectedResource}
          open={!!selectedResource}
          onOpenChange={() => setSelectedResource(null)}
        />
      )}
    </div>
  )
}
