
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Play, Clock, Users, Star, BookOpen, FileText, Video, Music, Image, Edit, Save, X } from "lucide-react";
import { Course, CourseStatus } from "@/types/course";
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/services/api/fetchApi';
import { hasPermission } from '@/utils/checkPermission';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  if (!hasPermission("HAS_READ_COURSE")) {
    return (
      <DashboardLayout title="No Permission">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You do not have permission to view this page.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  const [course, setCourse] = useState<Course>()
  const [showVideo, setShowVideo] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const getCourseQueries = useQuery({
    queryKey: ["getCourseQueries", courseId],
    queryFn: () =>
      fetchApi<any>({
        path: `courses/${courseId}`
      }),
  });

  useEffect(() => {
    if (
      !getCourseQueries.isLoading &&
      getCourseQueries.data
    ) {
      const data = getCourseQueries.data
      const updatedMapping = {
        title: data.title || "",
        description: data.description || "",
        sub_category_id: data.sub_category_id || "",
        categoryId: data.category_id || "",
        introductionVideoUrl: data.introduction_video_url || "",
        learningOutcomes: data.learning_outcomes || '',
        objectives: data.objectives || '',
        displayInCourseCatalog: data.display_as_course_catalog || false,
        displayAsFree: data.display_as_free || false,
        is_published: data.is_published || false,
        linkToManageDemos: data.link_to_manage_demos || false,
        topics: data.topics || []
      }
      setCourse(updatedMapping);
    }
  }, [getCourseQueries.isLoading, getCourseQueries.data]);

  if (!course) {
    return (
      <DashboardLayout title="Course Not Found">

        {!getCourseQueries.isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
            <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/courses/catalog')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Catalog
            </Button>
          </div>)}
      </DashboardLayout>
    );
  }

  const getStatusBadge = () => {
    const status = course.is_published;
    switch (status) {
      case true:
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case false:
        return <Badge className="bg-gray-100 text-gray-800">Unpublished</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-3 w-3" />;
      case 'audio': return <Music className="h-3 w-3" />;
      case 'image': return <Image className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  // Use hierarchical topics structure if available, fallback to old topicsCovered
  const hasHierarchicalTopics = course?.topics && course?.topics.length > 0;

  return (
    <DashboardLayout title={course.title}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/courses')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Catalog
          </Button>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <Button onClick={() => navigate(`/courses/update/${courseId}`)} size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-700 mb-4">{course.description}</p>


              {/* <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>8 weeks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.totalStudents} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.5</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-96">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="topics">Topics Covered</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Tutorial Video */}
            <Card>
              <CardHeader>
                <CardTitle>Course Introduction</CardTitle>
              </CardHeader>
              <CardContent>
                {(showVideo && course.introductionVideoUrl) ? (
                  <video controls width="100%" autoPlay>
                    <source src={course.introductionVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div
                    className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={() => setShowVideo(true)}
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                      <p className="text-gray-600">Course Introduction Video</p>
                      <p className="text-sm text-gray-500">Click to play tutorial</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning Outcomes */}
            {course.learningOutcomes && (
              <Card>
                <CardHeader>
                  <CardTitle>Learning Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(typeof course.learningOutcomes === 'string'
                      ? (course.learningOutcomes as string).split('\n').filter(outcome => outcome.trim())
                      : course.learningOutcomes
                    ).map((outcome, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Objectives */}
            {course.objectives && (
              <Card>
                <CardHeader>
                  <CardTitle>Course Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(typeof course.objectives === 'string'
                      ? (course.objectives as string).split('\n').filter(objective => objective.trim())
                      : course.objectives
                    ).map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Topics Covered in This Course</CardTitle>
              </CardHeader>
              <CardContent>
                {hasHierarchicalTopics ? (
                  <div className="space-y-6">
                    {course.topics?.map((topic, topicIndex) => (
                      <div key={topic.id} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {topicIndex + 1}. {topic.title}
                        </h3>
                        {topic.description && (
                          <p className="text-gray-600 mb-3">{topic.description}</p>
                        )}

                        {/* Topic Resources */}
                        {topic.resources.length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-2">
                              {topic.resources.map((resource) => (
                                <Badge
                                  key={resource.id}
                                  variant="outline"
                                  className="flex items-center gap-1 cursor-pointer hover:bg-gray-100"
                                  onClick={() => {
                                    setSelectedResource(resource);
                                    setResourceModalOpen(true);
                                  }}
                                >
                                  {getResourceIcon(resource.type)}
                                  <span className="text-xs">{resource.title}</span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Subtopics */}
                        {topic.subtopics.length > 0 && (
                          <div className="ml-4 space-y-3">
                            {topic.subtopics.map((subtopic, subtopicIndex) => (
                              <div key={subtopic.id} className="bg-gray-50 rounded-lg p-3">
                                <h4 className="font-medium text-gray-800 mb-1">
                                  {topicIndex + 1}.{subtopicIndex + 1} {subtopic.title}
                                </h4>
                                {subtopic.description && (
                                  <p className="text-sm text-gray-600 mb-2">{subtopic.description}</p>
                                )}

                                {subtopic.resources.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {subtopic.resources.map((resource) => (
                                      <Badge
                                        key={resource.id}
                                        variant="secondary"
                                        className="flex items-center gap-1 text-xs cursor-pointer hover:bg-gray-300"
                                        onClick={() => {
                                          setSelectedResource(resource);
                                          setResourceModalOpen(true);
                                        }}
                                      >
                                        {getResourceIcon(resource.type)}
                                        <span>{resource.title}</span>
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Fallback to old grouped topics structure
                  <div className="space-y-8">
                    {[
                      {
                        category: "Basics",
                        topics: course.topicsCovered?.slice(0, 3)
                      },
                      {
                        category: "Advanced Techniques",
                        topics: course.topicsCovered?.slice(3, 5)
                      },
                      {
                        category: "Performance & Practice",
                        topics: course.topicsCovered?.slice(5)
                      }
                    ].map((group, groupIndex) => (
                      <div key={groupIndex} className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b-0 pb-2">
                          {group.category}
                        </h2>
                        <div className="space-y-2 ml-4">
                          {group.topics?.map((topic, topicIndex) => (
                            <div key={topicIndex} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-base text-gray-700">{topic}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Resource Modal */}
        <Dialog open={resourceModalOpen} onOpenChange={setResourceModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>{selectedResource?.title}</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[80vh]">
              {selectedResource && (
                <div className="space-y-4">
                  {selectedResource.type === 'video' && (
                    <video controls className="w-full">
                      <source src={selectedResource.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {(selectedResource.type === 'image' || selectedResource.url?.toLowerCase().includes('.png') || selectedResource.url?.toLowerCase().includes('.jpg') || selectedResource.url?.toLowerCase().includes('.jpeg') || selectedResource.url?.toLowerCase().includes('.gif') || selectedResource.url?.toLowerCase().includes('.webp')) && (
                    <img
                      src={selectedResource.url}
                      alt={selectedResource.title}
                      className="w-full h-auto max-h-[70vh] object-contain"
                      onError={(e) => {
                        console.error('Image failed to load:', selectedResource.url);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  {selectedResource.type === 'audio' && (
                    <audio controls className="w-full">
                      <source src={selectedResource.url} type="audio/mpeg" />
                      Your browser does not support the audio tag.
                    </audio>
                  )}
                  {(selectedResource.type === 'pdf' || selectedResource.type === 'document') && (
                    <iframe
                      src={selectedResource.url}
                      className="w-full h-[70vh]"
                      title={selectedResource.title}
                    />
                  )}
                  {selectedResource.description && (
                    <p className="text-gray-600">{selectedResource.description}</p>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetail;
