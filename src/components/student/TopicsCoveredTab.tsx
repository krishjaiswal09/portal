import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchApi } from "@/services/api/fetchApi"
import { CourseTopic } from "@/types/course"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle, Circle, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface TopicsCoveredTabProps {
  courseId: string;
  user: any;
}

interface TopicProgress {
  topicId: string;
  completed: boolean;
  subtopics: SubtopicProgress[];
}

interface SubtopicProgress {
  subtopicId: string;
  completed: boolean;
}

export function TopicsCoveredTab({ courseId, user }: TopicsCoveredTabProps) {
  const [topics, setTopics] = useState<CourseTopic[]>([])
  const [topicProgress, setTopicProgress] = useState<Map<string, TopicProgress>>(new Map())

  const getCourseQueries = useQuery({
    queryKey: ["getCourseTopicsQueries", courseId],
    queryFn: () =>
      fetchApi<CourseTopic[]>({
        path: `courses/topics/${courseId}`
      }),
    enabled: !!courseId
  })

  const userProgressQuery = useQuery({
    queryKey: ["userProgress", user?.id, courseId],
    queryFn: async () =>
      fetchApi<any>({
        path: `courses/progress/${user?.id}/${courseId}`,
      }),
    enabled: !!courseId && !!user?.id,
  })

  useEffect(() => {
    if (userProgressQuery.data && getCourseQueries.data) {
      const progressMap = new Map<string, TopicProgress>()
      const progressData = userProgressQuery.data

      getCourseQueries.data.forEach((topic: any) => {
        const topicId = topic.id.toString()

        const topicProgressData = progressData.find((p: any) =>
          p.topic_id === topicId && !p.subtopic_id && p.is_completed
        )

        const subtopics = topic.subtopics?.map((subtopic: any) => {
          const subtopicProgress = progressData.find((p: any) =>
            p.topic_id === topicId && p.subtopic_id === subtopic.id.toString() && p.is_completed
          )
          return {
            subtopicId: subtopic.id.toString(),
            completed: !!subtopicProgress
          }
        }) || []

        const allSubtopicsCompleted = subtopics.length > 0 && subtopics.every(st => st.completed)
        const isTopicCompleted = !!topicProgressData || allSubtopicsCompleted

        progressMap.set(topicId, {
          topicId,
          completed: isTopicCompleted,
          subtopics
        })
      })

      setTopicProgress(progressMap)
      setTopics(getCourseQueries.data)
    } else if (getCourseQueries.data) {
      setTopics(getCourseQueries.data)
    }
  }, [userProgressQuery.data, getCourseQueries.data])

  if (getCourseQueries.isLoading || userProgressQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading topics...</span>
      </div>
    )
  }

  if (getCourseQueries.error || userProgressQuery.error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Circle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">
            Error loading topics
          </h3>
          <p className="text-sm text-muted-foreground">
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {topics.map((topic) => {
        const completedSubtopics = topicProgress.get(topic.id.toString())?.subtopics.filter(st => st.completed).length || 0
        const totalSubtopics = topic.subtopics?.length || 0

        return (
          <Card key={topic.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {topicProgress.get(topic.id.toString())?.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <span className={topicProgress.get(topic.id.toString())?.completed ? "line-through text-muted-foreground" : ""}>
                    {topic.title}
                  </span>
                </CardTitle>
                <div className="flex items-center gap-3">
                  {totalSubtopics > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {completedSubtopics}/{totalSubtopics} completed
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>

            {topic.subtopics && topic.subtopics.length > 0 && (
              <CardContent>
                <div className="space-y-3">
                  {topic.subtopics.map((subtopic) => (
                    <div
                      key={subtopic.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {topicProgress.get(topic.id.toString())?.subtopics.find(st => st.subtopicId === subtopic.id.toString())?.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          topicProgress.get(topic.id.toString())?.subtopics.find(st => st.subtopicId === subtopic.id.toString())?.completed
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}>
                          {subtopic.title}
                        </p>
                        {subtopic.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {subtopic.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}

      {topics.length === 0 && !getCourseQueries.isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <Circle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No topics available
            </h3>
            <p className="text-sm text-muted-foreground">
              Topics will appear here as you progress through the course.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}