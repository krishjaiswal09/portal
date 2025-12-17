
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Course, CourseTopic, CourseSubtopic } from "@/types/course";
import { ResourceUpload } from "./ResourceUpload";
import { Plus, ChevronDown, ChevronRight, Edit, Trash2, BookOpen, Save, X } from "lucide-react";
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/services/api/fetchApi';
import { useToast } from "@/hooks/use-toast";

interface TopicsCoveredManagementProps {
  courses: Course[];
}

export function TopicsCoveredManagement({
  courses
}: TopicsCoveredManagementProps) {
  const { toast } = useToast();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [editingTopicId, setEditingTopicId] = useState<string>('');
  const [editingSubtopicId, setEditingSubtopicId] = useState<string>('');
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [showAddSubtopic, setShowAddSubtopic] = useState('');
  const [course, setCourse] = useState<Course>();
  // Form states
  const [newTopic, setNewTopic] = useState({
    title: '',
    description: ''
  });
  const [newSubtopic, setNewSubtopic] = useState({
    title: '',
    description: '',
    parentTopicId: ''
  });
  const [editingTopicData, setEditingTopicData] = useState({
    title: '',
    description: ''
  });
  const [editingSubtopicData, setEditingSubtopicData] = useState({
    title: '',
    description: ''
  });

  const getCourseQueries = useQuery({
    queryKey: ["getCourseQueries", selectedCourseId],
    queryFn: () =>
      fetchApi<Course>({
        path: `courses/${selectedCourseId}`
      }),
    enabled: !!selectedCourseId
  });

  const addTopicsMutation = useMutation({
    mutationKey: [],
    mutationFn: (data: any) =>
      fetchApi<any>({
        path: 'courses/topics',
        method: 'POST',
        data: data,
      }),
    onSuccess: () => {
      toast({
        title: "Topic Added Successfully",
        description: `The topic has been added.`,
        duration: 3000,
      });
      getCourseQueries.refetch();
      setNewTopic({ title: '', description: '' });
    },
    onError: (error) => {
      toast({
        title: "Failed to add Topic",
        description: `There was an error: ${error.message}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  });

  const addSubtopicsMutation = useMutation({
    mutationKey: ["addSubtopicsMutation"],
    mutationFn: (data: any) =>
      fetchApi<any>({
        path: 'courses/subtopics',
        method: 'POST',
        data: data,
      }),
    onSuccess: () => {
      toast({
        title: "Subtopic Added Successfully",
        description: `The subtopic has been added.`,
        duration: 3000,
      });
      getCourseQueries.refetch();
      setNewSubtopic({ title: '', description: "", parentTopicId: "" });
    },
    onError: (error) => {
      toast({
        title: "Failed to add Subtopic",
        description: `There was an error: ${error.message}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  });

  const editTopicsMutation = useMutation({
    mutationKey: [],
    mutationFn: (data: any) =>
      fetchApi<any>({
        path: `courses/topics/${data?.id}`,
        method: 'PATCH',
        data: data,
      }),

    onSuccess: () => {
      toast({
        title: "Topic Updated Successfully",
        description: `The topic has been updated.`,
        duration: 3000,
      });
      getCourseQueries.refetch();
      setEditingTopicId('')
      setEditingTopicData({ title: '', description: '' });
    },
    onError: (error) => {
      toast({
        title: "Failed to update Topic",
        description: `There was an error: ${error.message}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  });

  const editSubTopicsMutation = useMutation({
    mutationKey: ["editSubTopicsMutation"],
    mutationFn: (data: any) =>
      fetchApi<any>({
        path: 'courses/subtopics',
        method: 'POST',
        data: data,
      }),
    onSuccess: () => {
      toast({
        title: "Subtopic Updated Successfully",
        description: `The subtopic has been updated.`,
        duration: 3000,
      });
      getCourseQueries.refetch();
      setEditingSubtopicData({ title: '', description: "" });
    },
    onError: (error) => {
      toast({
        title: "Failed to update Subtopic",
        description: `There was an error: ${error.message}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  });

  const deleteTopicsMutation = useMutation({
    mutationKey: ["deleteTopicsMutation"],
    mutationFn: (id: any) =>
      fetchApi<any>({
        path: `courses/topics/${id}`,
        method: 'DELETE',
      }),
    onSuccess: () => {
      toast({
        title: "Topic Deleted Successfully",
        description: `The subtopic has been deleted.`,
        duration: 3000,
      });
      getCourseQueries.refetch();
    },
    onError: (error) => {
      toast({
        title: "Failed to delete Topic",
        description: `There was an error: ${error.message}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  });

  const deleteSubtopicsMutation = useMutation({
    mutationKey: ["deleteSubtopicsMutation"],
    mutationFn: (id: any) =>
      fetchApi<any>({
        path: `courses/subtopics/${id}`,
        method: 'DELETE',
      }),
    onSuccess: () => {
      toast({
        title: "Subtopic Deleted Successfully",
        description: `The subtopic has been deleted.`,
        duration: 3000,
      });
      getCourseQueries.refetch();
    },
    onError: (error) => {
      toast({
        title: "Failed to delete Subtopic",
        description: `There was an error: ${error.message}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  });

  const addResourcesMutation = useMutation({
    mutationKey: ["addResourcesMutation"],
    mutationFn: (resourceData: any) =>
      fetchApi<any>({
        path: `courses/resources`,
        method: 'POST',
        data: resourceData
      }),
    onSuccess: () => {
      toast({
        title: "Resource Added Successfully",
        description: `The resource has been added.`,
        duration: 3000,
      });
      getCourseQueries.refetch();
    },
    onError: (error) => {
      toast({
        title: "Failed to add resource",
        description: `There was an error: ${error.message}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  });

  const removeResourcesMutation = useMutation({
    mutationKey: ["removeResourcesMutation"],
    mutationFn: (id: String) =>
      fetchApi<any>({
        path: `courses/resources/${id}`,
        method: 'DELETE',
      }),
    onSuccess: () => {
      toast({
        title: "Resource Deleted Successfully",
        description: `The resource has been deleted.`,
        duration: 3000,
      });
      getCourseQueries.refetch();
    },
    onError: (error) => {
      toast({
        title: "Failed to delete resource",
        description: `There was an error: ${error.message}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  });

  useEffect(() => {
    if (
      !getCourseQueries.isLoading &&
      getCourseQueries.data
    ) {
      setCourse(getCourseQueries.data);
    }
  }, [getCourseQueries.isLoading, getCourseQueries.data]);


  const topics = course?.topics || [];

  const toggleTopicExpanded = (topicId: string, onlyExpanded: boolean = false) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      !onlyExpanded && newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const handleEditTopic = (topic: CourseTopic) => {
    setEditingTopicId(topic.id);
    setEditingTopicData({
      title: topic.title,
      description: topic.description || ''
    });
  };

  const handleSaveTopicEdit = (topicId: string) => {
    if (!course) return;
    editTopicsMutation.mutate({
      id: topicId,
      title: editingTopicData.title,
      description: editingTopicData.description,
    })
  };

  const handleEditSubtopic = (subtopic: CourseSubtopic) => {
    setEditingSubtopicId(subtopic.id);
    setEditingSubtopicData({
      title: subtopic.title,
      description: subtopic.description || ''
    });
  };

  const handleSaveSubtopicEdit = (subtopicId: string) => {
    if (!course) return;
    editSubTopicsMutation.mutate([{
      id: subtopicId,
      title: editingSubtopicData.title,
      description: editingSubtopicData.description,
    }])
    setEditingSubtopicId('');
  };

  const handleAddTopic = () => {
    if (!course || !newTopic.title.trim()) return;

    addTopicsMutation.mutate({
      course_id: selectedCourseId,
      title: newTopic.title,
      description: newTopic.description,
      weightage: 10,
      order: 1,
    })
    setShowAddTopic(false);
  };

  const handleAddSubtopic = (parentTopicId: string) => {
    if (!course || !newSubtopic.title.trim()) return;

    const topicIndex = topics.findIndex(t => t.id === parentTopicId);
    if (topicIndex === -1) return;

    const topic = topics[topicIndex];
    addSubtopicsMutation.mutate([{
      topic_id: parentTopicId,
      title: newSubtopic.title,
      description: newSubtopic.description,
      order: topic.subtopics.length + 1,
    }])
    setShowAddSubtopic('');
  };

  const handleDeleteTopic = (topicId: string) => {
    deleteTopicsMutation.mutate(topicId)
  };

  const handleDeleteSubtopic = (subtopicId: string) => {
    deleteSubtopicsMutation.mutate(subtopicId)
  };

  const updateTopicResources = (topic_id: string, resources: any) => {
    if (!course) return;

    addResourcesMutation.mutate({
      topic_id,
      ...resources,
      visibility: true
    })
  };
  const removeResources = (resources: any) => {
    if (!course) return;
    removeResourcesMutation.mutate(resources.id)
  };

  const updateSubtopicResources = (_topic_id: string, subtopic_id: string, resources: any) => {
    if (!course) return;
    addResourcesMutation.mutate({
      subtopic_id,
      ...resources,
      visibility: true
    })
  };

  return (
    <div className="space-y-4">
      {/* Course Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Select Course</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a course to manage topics" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {course && (
            <div className="text-sm text-muted-foreground bg-muted/50 rounded p-2">
              <p><strong>Course:</strong> {course.title}</p>
              <p><strong>Topics:</strong> {topics.length}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {course && (
        <>
          {/* Quick Add Topic */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Topics Structure</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowAddTopic(!showAddTopic)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Topic
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {showAddTopic && (
                <div className="border rounded-lg p-3 space-y-2">
                  <Input
                    placeholder="Topic title"
                    value={newTopic.title}
                    onChange={(e) => setNewTopic({
                      ...newTopic,
                      title: e.target.value
                    })}
                    className="h-8"
                  />
                  <Textarea
                    placeholder="Topic description (optional)"
                    value={newTopic.description}
                    onChange={(e) => setNewTopic({
                      ...newTopic,
                      description: e.target.value
                    })}
                    rows={2}
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleAddTopic} size="sm" disabled={!newTopic.title.trim()}>
                      Add Topic
                    </Button>
                    <Button onClick={() => setShowAddTopic(false)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Topics List */}
              {topics.length > 0 ? (
                <div className="space-y-2">
                  {topics.map((topic, topicIndex) => (
                    <Collapsible key={topic.id} open={expandedTopics.has(topic.id)} onOpenChange={() => toggleTopicExpanded(topic.id)}>
                      <div className="border rounded-lg">
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer">
                            <div className="flex items-center gap-2">
                              {expandedTopics.has(topic.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <Badge variant="outline" className="text-xs">
                                Topic {topicIndex + 1}
                              </Badge>
                              {editingTopicId === topic.id ? (
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                  <Input
                                    value={editingTopicData.title}
                                    onChange={(e) => setEditingTopicData({
                                      ...editingTopicData,
                                      title: e.target.value
                                    })}
                                    className="h-8"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSaveTopicEdit(topic.id)}
                                    className="h-6 px-2"
                                  >
                                    <Save className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingTopicId('')}
                                    className="h-6 px-2"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <span className="font-medium">{topic.title}</span>
                              )}
                              {topic.resources?.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {topic.resources.length} resource(s)
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditTopic(topic);
                                }}
                                className="h-6 px-2"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                title='Add Subtopics'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowAddSubtopic(showAddSubtopic === topic.id ? '' : topic.id);
                                  toggleTopicExpanded(topic.id, true)
                                }}
                                className="h-6 px-2"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTopic(topic.id);
                                }}
                                className="h-6 px-2"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="px-3 pb-3">
                          {/* Edit Topic Description */}
                          {editingTopicId === topic.id && (
                            <div className="ml-6 mb-3">
                              <Textarea
                                placeholder="Topic description (optional)"
                                value={editingTopicData.description}
                                onChange={(e) => setEditingTopicData({
                                  ...editingTopicData,
                                  description: e.target.value
                                })}
                                rows={2}
                                className="text-sm"
                              />
                            </div>
                          )}

                          {topic.description && editingTopicId !== topic.id && (
                            <p className="text-sm text-gray-600 mb-3 ml-6">{topic.description}</p>
                          )}

                          {/* Topic Resources */}
                          <div className="ml-6 mb-3">
                            <ResourceUpload
                              resources={topic.resources}
                              onResourcesChange={(resources) => updateTopicResources(topic.id, resources)}
                              onResourcesRemove={(resources) => removeResources(resources)}
                              compact={true}
                              defaultName={topic.title}
                            />
                          </div>

                          {/* Add Subtopic Form */}
                          {showAddSubtopic === topic.id && (
                            <div className="ml-6 mb-3 border-l-2 border-dashed border-muted pl-3 space-y-2">
                              <Input
                                placeholder="Subtopic title"
                                value={newSubtopic.title}
                                onChange={(e) => setNewSubtopic({
                                  ...newSubtopic,
                                  title: e.target.value
                                })}
                                className="h-8"
                              />

                              <Textarea
                                placeholder="Subtopic description (optional)"
                                value={newSubtopic.description}
                                onChange={(e) => setNewSubtopic({
                                  ...newSubtopic,
                                  description: e.target.value
                                })}
                                rows={2}
                                className="text-sm mb-2"
                              />

                              <div className="flex gap-2">
                                <Button onClick={() => handleAddSubtopic(topic.id)} size="sm" disabled={!newSubtopic.title.trim()}>
                                  Add Subtopic
                                </Button>
                                <Button onClick={() => setShowAddSubtopic('')} variant="outline" size="sm">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Subtopics */}
                          {topic.subtopics.length > 0 && (
                            <div className="ml-6 space-y-2">
                              {topic.subtopics.map((subtopic, subtopicIndex) => (
                                <div key={subtopic.id} className="bg-muted/30 rounded-md p-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="secondary" className="text-xs">
                                          {topicIndex + 1}.{subtopicIndex + 1}
                                        </Badge>
                                        {editingSubtopicId === subtopic.id ? (
                                          <div className="flex items-center gap-2 flex-1">
                                            <Input
                                              value={editingSubtopicData.title}
                                              onChange={(e) => setEditingSubtopicData({
                                                ...editingSubtopicData,
                                                title: e.target.value
                                              })}
                                              className="h-8"
                                            />
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => handleSaveSubtopicEdit(subtopic.id)}
                                              className="h-6 px-2"
                                            >
                                              <Save className="h-3 w-3" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => setEditingSubtopicId('')}
                                              className="h-6 px-2"
                                            >
                                              <X className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        ) : (
                                          <span className="text-sm font-medium">{subtopic.title}</span>
                                        )}
                                      </div>
                                      {editingSubtopicId === subtopic.id && (
                                        <Textarea
                                          placeholder="Subtopic description (optional)"
                                          value={editingSubtopicData.description}
                                          onChange={(e) => setEditingSubtopicData({
                                            ...editingSubtopicData,
                                            description: e.target.value
                                          })}
                                          rows={2}
                                          className="text-sm mb-2"
                                        />
                                      )}
                                      {subtopic.description && editingSubtopicId !== subtopic.id && (
                                        <p className="text-xs text-muted-foreground mb-2">{subtopic.description}</p>
                                      )}
                                      <ResourceUpload
                                        resources={subtopic.resources}
                                        onResourcesChange={(resources) => updateSubtopicResources(topic.id, subtopic.id, resources)}
                                        onResourcesRemove={(resources) => removeResources(resources)}
                                        compact={true}
                                        defaultName={subtopic.title}
                                      />
                                    </div>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditSubtopic(subtopic)}
                                        className="h-6 px-2"
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteSubtopic(subtopic.id)}
                                        className="h-6 px-2"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No topics added yet</p>
                  <p className="text-sm">Add topics to structure your course content</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
