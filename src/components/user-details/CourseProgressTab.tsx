import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type User } from "../user-management/mockData";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";

interface CourseProgressTabProps {
  user: User;
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

interface Course {
  id: string;
  name: string;
  artform: string;
  topics: Topic[];
}

interface Topic {
  id: string;
  title: string;
  subtopics: Subtopic[];
}

interface Subtopic {
  id: string;
  title: string;
}

export function CourseProgressTab({ user }: CourseProgressTabProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [topicProgress, setTopicProgress] = useState<
    Map<string, TopicProgress>
  >(new Map());

  const getCourses = useQuery({
    queryKey: ["coursesByUserId"],
    queryFn: async () =>
      fetchApi<any>({
        path: `courses/me/${user.id}`,
      }),
  });

  const courseByIdQuery = useQuery({
    queryKey: ["courseById", selectedCourse],
    queryFn: async () =>
      fetchApi<any>({
        path: `courses/${selectedCourse}`,
        params: {
          userId: user.id
        }
      }),
    enabled: !!selectedCourse,
  });

  const userProgressQuery = useQuery({
    queryKey: ["userProgress", user.id, selectedCourse],
    queryFn: async () =>
      fetchApi<any>({
        path: `courses/progress/${user.id}/${selectedCourse}`,
      }),
    enabled: !!selectedCourse && !!user.id,
  });

  console.log(courseByIdQuery.data, "courseByIdQuery");

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId);
    setExpandedTopics(new Set());
    setTopicProgress(new Map());
  };

  // Initialize progress from API data
  useEffect(() => {
    if (userProgressQuery.data && courseByIdQuery.data) {
      const progressMap = new Map<string, TopicProgress>();
      const progressData = userProgressQuery.data;

      courseByIdQuery.data.topics?.forEach((topic: any) => {
        const topicId = topic.id.toString();

        // Check if topic itself is completed (when subtopic_id is null/undefined)
        const topicProgress = progressData.find((p: any) =>
          p.topic_id === topicId && !p.subtopic_id && p.is_completed
        );

        const subtopics = topic.subtopics?.map((subtopic: any) => {
          const subtopicProgress = progressData.find((p: any) =>
            p.topic_id === topicId && p.subtopic_id === subtopic.id.toString() && p.is_completed
          );
          return {
            subtopicId: subtopic.id.toString(),
            completed: !!subtopicProgress
          };
        }) || [];

        // Topic is completed if explicitly marked or all subtopics are completed
        const allSubtopicsCompleted = subtopics.length > 0 && subtopics.every(st => st.completed);
        const isTopicCompleted = !!topicProgress || allSubtopicsCompleted;

        progressMap.set(topicId, {
          topicId,
          completed: isTopicCompleted,
          subtopics
        });
      });

      setTopicProgress(progressMap);
    }
  }, [userProgressQuery.data, courseByIdQuery.data]);

  const toggleTopicExpansion = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const handleTopicCheckbox = (topicId: string, checked: boolean) => {
    const newProgress = new Map(topicProgress);
    const currentTopic = newProgress.get(topicId) || {
      topicId,
      completed: false,
      subtopics: [],
    };

    currentTopic.completed = checked;
    // If topic is checked, mark all subtopics as checked
    if (checked) {
      const course = courseByIdQuery.data;
      const topic = course?.topics.find((t) => t.id.toString() === topicId);
      if (topic) {
        currentTopic.subtopics = topic.subtopics.map((st) => ({
          subtopicId: st.id.toString(),
          completed: true,
        }));
      }
    } else {
      // If topic is unchecked, uncheck all subtopics
      currentTopic.subtopics = currentTopic.subtopics.map((st) => ({
        ...st,
        completed: false,
      }));
    }

    newProgress.set(topicId, currentTopic);
    setTopicProgress(newProgress);

    // Update progress via API
    if (selectedCourse && user.id) {
      updateProgressMutation.mutate({
        user_id: parseInt(user.id.toString()),
        course_id: parseInt(selectedCourse),
        topic_id: parseInt(topicId),
        completed: checked,
      });
    }
  };

  const handleSubtopicCheckbox = (
    topicId: string,
    subtopicId: string,
    checked: boolean
  ) => {
    const newProgress = new Map(topicProgress);
    const currentTopic = newProgress.get(topicId) || {
      topicId,
      completed: false,
      subtopics: [],
    };

    const subtopicIndex = currentTopic.subtopics.findIndex(
      (st) => st.subtopicId === subtopicId
    );
    if (subtopicIndex >= 0) {
      currentTopic.subtopics[subtopicIndex].completed = checked;
    } else {
      currentTopic.subtopics.push({
        subtopicId,
        completed: checked,
      });
    }

    // Check if all subtopics are completed to mark topic as completed
    const course = courseByIdQuery.data;
    const topic = course?.topics.find((t) => t.id.toString() === topicId);
    if (topic) {
      const allSubtopicsCompleted = topic.subtopics.every((st) => {
        const subtopicProgress = currentTopic.subtopics.find(
          (stp) => stp.subtopicId === st.id.toString()
        );
        return subtopicProgress?.completed || false;
      });
      currentTopic.completed = allSubtopicsCompleted;
    }

    newProgress.set(topicId, currentTopic);
    setTopicProgress(newProgress);

    // Update progress via API
    if (selectedCourse && user.id) {
      updateProgressMutation.mutate({
        user_id: parseInt(user.id.toString()),
        course_id: parseInt(selectedCourse),
        topic_id: parseInt(topicId),
        subtopic_id: parseInt(subtopicId),
        completed: checked,
      });
    }
  };

  const getTopicCompletionCount = (topicId: string) => {
    const currentTopicProgress = topicProgress.get(topicId);
    if (!currentTopicProgress) return { completed: 0, total: 0 };

    const course = courseByIdQuery.data;
    const topic = course?.topics.find((t) => t.id.toString() === topicId);
    const total = topic?.subtopics.length || 0;
    const completed = currentTopicProgress.subtopics.filter(
      (st) => st.completed
    ).length;

    return { completed, total };
  };

  const selectedCourseData = courseByIdQuery.data;

  const hasAnyProgress = Array.from(topicProgress.values()).some(
    (progress) =>
      progress.completed || progress.subtopics.some((st) => st.completed)
  );

  const updateProgressMutation = useMutation({
    mutationFn: (data: {
      user_id: number;
      course_id: number;
      topic_id: number;
      subtopic_id?: number;
      completed?: boolean;
    }) =>
      fetchApi({
        path: "courses/updateProgress",
        method: "PATCH",
        data,
      }),
    onSuccess: () => {
      console.log("Progress updated successfully");
    },
  });

  // const handleSubmit = () => {
  //   if (!selectedCourse || !user.id) return;

  //   // Update progress for each completed topic/subtopic
  //   for (const [topicId, progress] of topicProgress.entries()) {
  //     if (progress.completed) {
  //       // Update topic progress
  //       updateProgressMutation.mutate({
  //         user_id: parseInt(user.id),
  //         course_id: parseInt(selectedCourse),
  //         topic_id: parseInt(topicId),
  //       });
  //     }

  //     // Update subtopic progress
  //     progress.subtopics.forEach((subtopic) => {
  //       if (subtopic.completed) {
  //         updateProgressMutation.mutate({
  //           user_id: parseInt(user.id),
  //           course_id: parseInt(selectedCourse),
  //           topic_id: parseInt(topicId),
  //           subtopic_id: parseInt(subtopic.subtopicId),
  //         });
  //       }
  //     });
  //   }
  // };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Course Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Course</label>
            <Select value={selectedCourse} onValueChange={handleCourseSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a course to view progress" />
              </SelectTrigger>
              <SelectContent>
                {getCourses?.data?.map((course: any) => (
                  <SelectItem key={course.course_id} value={course.course_id.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span>{course.title}</span>
                      {/* <Badge variant="outline" className="ml-2">
                        {course.artform}
                      </Badge> */}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Topics and Subtopics */}
          {selectedCourseData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {selectedCourseData.title}
                </h3>
              </div>

              <div className="space-y-3">
                {selectedCourseData.topics?.map((topic) => {
                  const topicId = topic.id.toString();
                  const isExpanded = expandedTopics.has(topicId);
                  const currentTopicProgress = topicProgress.get(topicId);
                  const { completed, total } = getTopicCompletionCount(topicId);

                  return (
                    <div
                      key={topic.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={currentTopicProgress?.completed || false}
                            onCheckedChange={(checked) =>
                              handleTopicCheckbox(topicId, checked as boolean)
                            }
                          />
                          <button
                            onClick={() => toggleTopicExpansion(topicId)}
                            className="flex items-center gap-2 text-left hover:text-primary"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                            <span className="font-medium">{topic.title}</span>
                          </button>
                        </div>
                        <Badge variant="outline">
                          {completed}/{total} completed
                        </Badge>
                      </div>

                      {isExpanded && (
                        <div className="ml-8 space-y-2">
                          {topic.subtopics.map((subtopic) => {
                            const subtopicId = subtopic.id.toString();
                            const subtopicCompleted =
                              currentTopicProgress?.subtopics.find(
                                (st) => st.subtopicId === subtopicId
                              )?.completed || false;

                            return (
                              <div
                                key={subtopic.id}
                                className="flex items-center gap-3"
                              >
                                <Checkbox
                                  checked={subtopicCompleted}
                                  onCheckedChange={(checked) =>
                                    handleSubtopicCheckbox(
                                      topicId,
                                      subtopicId,
                                      checked as boolean
                                    )
                                  }
                                />
                                <span className="text-sm">
                                  {subtopic.title}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!selectedCourseData && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a course to view topics and track progress</p>
            </div>
          )}

          {/* {selectedCourseData && (
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSubmit}
                disabled={!hasAnyProgress}
                className="min-w-32"
              >
                Submit Progress
              </Button>
            </div>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
}
