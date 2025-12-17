
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, X } from "lucide-react";
import { fetchApi } from '@/services/api/fetchApi';
import { useToast } from "@/hooks/use-toast";
import { CourseCategory, CourseSubcategory } from '@/types/course';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useUploadBucket } from '@/hooks/use-upload-bucket';
import { SectionLoader, InlineLoader } from "@/components/ui/loader";


const initial = {
  title: '',
  categoryId: '',
  sub_category_id: '',
  description: '',
  introductionVideoUrl: '',
  thumbnail_image: '',
  learningOutcomes: '',
  objectives: '',
  displayInCourseCatalog: false,
  is_published: false,
  displayAsFree: false,
  linkToManageDemos: false,
  is_featured: false
}

export function CourseForm() {
  const uploadMutation = useUploadBucket();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isManualCategoryChange = useRef(false);
  const isManualSubcategoryChange = useRef(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>(initial);

  const categoriesQueries = useQuery({
    queryKey: ["categoriesQueries"],
    queryFn: () =>
      fetchApi<CourseCategory[]>({
        path: "courses/categories",
      }),
  });

  const courseByIdQuery = useQuery({
    queryKey: ['coursesById', id],
    queryFn: async () =>
      fetchApi<any>({
        path: `courses/${id}`,
      }),
  });

  const addEditCourseMutation = useMutation({
    mutationKey: [],
    mutationFn: (data: any) =>
      fetchApi<any>({
        path: id ? `courses/${id}` : 'courses',
        method: id ? "PUT" : "POST",
        data,
      }),
    onSuccess: () => {
      toast({
        title: id ? "Course Updated Successfully" : "Course Created Successfully",
        description: `${formData?.title} ${id ? 'updated' : 'added'}.`,
        duration: 3000,
      });
      courseByIdQuery.refetch()
      setIsPublishing(false)
    },
    onError: (error: any) => {
      console.error(`Error ${id ? 'updating' : 'creating'} Course:`, error);
      toast({
        title: `Error ${id ? 'Updating' : 'Creating'} Course`,
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  useEffect(() => {
    if (courseByIdQuery.data && !courseByIdQuery.isLoading) {
      const data = courseByIdQuery.data
      const updatedMapping = {
        title: data.title || "",
        description: data.description || "",
        sub_category_id: data.sub_category_id?.toString() || "",
        categoryId: data.category_id?.toString() || "",
        thumbnail_image: data.thumbnail_image || "",
        introductionVideoUrl: data.introduction_video_url || "",
        learningOutcomes: data.learning_outcomes || "",
        objectives: data.objectives || '',
        displayInCourseCatalog: data.display_as_course_catalog || false,
        displayAsFree: data.display_as_free || false,
        is_published: data.is_published || false,
        linkToManageDemos: data.link_to_manage_demos || false,
        is_featured: data.is_featured || false
      }
      setFormData(id ? updatedMapping : initial);
    }
  }, [courseByIdQuery.isLoading, courseByIdQuery.data]);

  const subcategories = useMemo(() => {
    if (!categoriesQueries.data || !formData?.categoryId) {
      return [];
    }
    const selectedCategory = categoriesQueries.data.find(v => v.id.toString() === formData.categoryId);
    return selectedCategory?.subCategories || [];
  }, [categoriesQueries.data, formData?.categoryId]);

  const handleCategoryChange = (value: string) => {
    if (!isManualCategoryChange.current) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      categoryId: value,
      sub_category_id: '' // Reset subcategory when category changes
    }));
  };

  const handleSubcategoryChange = (value: string) => {
    if (!isManualSubcategoryChange.current) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      sub_category_id: value
    }));
  };

  const renderCategorySelect = useMemo(() => (
    <Select
      value={formData?.categoryId}
      onOpenChange={(open) => {
        if (open) {
          isManualCategoryChange.current = true;
        }
      }}
      onValueChange={handleCategoryChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {categoriesQueries.data?.map(category => (
          <SelectItem key={`${category.id}_Cat`} value={category.id.toString()}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ), [categoriesQueries.isLoading, formData?.categoryId])

  const renderSubCategorySelect = useMemo(() => (
    <Select
      value={formData?.sub_category_id}
      onOpenChange={(open) => {
        if (open) {
          isManualSubcategoryChange.current = true;
        }
      }}
      onValueChange={handleSubcategoryChange}
      disabled={!formData?.categoryId || subcategories?.length === 0}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={formData?.categoryId ? "Select subcategory" : "Select category first"}
        />
      </SelectTrigger>
      <SelectContent>
        {subcategories?.map(subcategory => (
          <SelectItem key={`${subcategory.id}_subCat`} value={subcategory.id.toString()}>
            {subcategory.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ), [subcategories, formData.sub_category_id, formData.categoryId, categoriesQueries.isLoading, formData?.categoryId])




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData?.title || !formData?.categoryId) {
      alert('Please fill in all required fields');
      return
    }

    if (formData?.categoryId && subcategories?.length > 0) {
      if (!formData?.sub_category_id) {
        alert('Please fill in all required fields');
        return
      }
    }

    addEditCourseMutation.mutate({
      title: formData?.title,
      description: formData?.description,
      objectives: formData?.objectives || "",
      learning_outcomes: formData?.learningOutcomes,
      thumbnail_image: formData?.thumbnail_image,
      introduction_video_url: formData?.introductionVideoUrl,
      category_id: +formData?.categoryId,
      sub_category_id: formData?.sub_category_id ? +formData?.sub_category_id : null,
      display_as_course_catalog: formData?.displayInCourseCatalog,
      display_as_free: formData?.displayAsFree,
      link_to_manage_demos: formData?.linkToManageDemos,
      is_featured: formData?.is_featured,
    });

    navigate('/courses');
  };

  if (id && courseByIdQuery.isLoading) {
    return <SectionLoader text="Loading course data..." />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl md:text-2xl">{id ? "Update Course" : "Create New Course"}</CardTitle>
            <div className='flex gap-4'>
              {
                id && <Button
                  variant="secondary"
                  onClick={() => {
                    setIsPublishing(true);
                    addEditCourseMutation.mutate({
                      is_published: !formData?.is_published,
                      category_id: formData?.categoryId ? +formData?.categoryId : 0,
                      sub_category_id: formData?.sub_category_id ? +formData?.sub_category_id : 0
                    });
                  }}
                  className="w-full sm:w-auto"
                >
                  {isPublishing
                    ? formData?.is_published
                      ? "Unpublishing..."
                      : "Publishing..."
                    : formData?.is_published
                      ? "Unpublish"
                      : "Publish"}
                </Button>
              }
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Name and Art Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Course Title *</Label>
                <Input
                  id="name"
                  value={formData?.title}
                  onChange={e => setFormData({
                    ...formData,
                    title: e.target.value
                  })}
                  placeholder="Enter course name"
                  required
                  className="w-full"
                />
              </div>
            </div>

            {/* Category and Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                {renderCategorySelect}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory *</Label>
                {renderSubCategorySelect}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData?.description}
                onChange={e => setFormData({
                  ...formData,
                  description: e.target.value
                })}
                placeholder="Enter course description"
                rows={4}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail_image">Thumbnail Image</Label>
              <Input
                id="thumbnail_image"
                type="file"
                accept='image.*'
                onChange={async (e) => {
                  try {
                    const result = await uploadMutation.mutateAsync({
                      path: 'courses/thumbnail',
                      file: e.target.files[0],
                      prevFileLink: formData.thumbnail_image
                    });

                    setFormData({
                      ...formData,
                      thumbnail_image: result.url
                    })
                  } catch (error) {
                    console.error('Upload error:', error);
                  }
                }}
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="introVideo">Introduction Video URL</Label>
              <Input
                id="introVideo"
                type="file"
                accept='.mp4'
                onChange={async (e) => {
                  try {
                    const result = await uploadMutation.mutateAsync({
                      path: 'courses/intro_video',
                      file: e.target.files[0],
                      prevFileLink: formData.introductionVideoUrl
                    });

                    setFormData({
                      ...formData,
                      introductionVideoUrl: result.url
                    })
                  } catch (error) {
                    console.error('Upload error:', error);
                  }
                }}
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                className="w-full"
              />
            </div>

            {/* Learning Outcomes */}
            <div className="space-y-2">
              <Label htmlFor="learningOutcomes">Learning Outcomes</Label>
              <Textarea
                id="learningOutcomes"
                value={formData?.learningOutcomes}
                onChange={e => setFormData({
                  ...formData,
                  learningOutcomes: e.target.value
                })}
                placeholder="Enter learning outcomes (one per line)"
                rows={4}
                className="w-full"
              />
            </div>

            {/* Course Objectives */}
            <div className="space-y-2">
              <Label htmlFor="objectives">Course Objectives</Label>
              <Textarea
                id="objectives"
                value={formData?.objectives}
                onChange={e => setFormData({
                  ...formData,
                  objectives: e.target.value
                })}
                placeholder="Enter course objectives (one per line)"
                rows={4}
                className="w-full"
              />
            </div>

            {/* Toggle Options */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-semibold">Course Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="displayInCatalog">Display in Course Catalog</Label>
                    <p className="text-sm text-muted-foreground">Make this course visible in the public course catalog</p>
                  </div>
                  <Switch
                    id="displayInCatalog"
                    checked={formData?.displayInCourseCatalog}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      displayInCourseCatalog: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="displayAsFree">Display as Free</Label>
                    <p className="text-sm text-muted-foreground">Mark this course as free for students</p>
                  </div>
                  <Switch
                    id="displayAsFree"
                    checked={formData?.displayAsFree}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      displayAsFree: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="linkToManageDemos">Link to Manage Demos</Label>
                    <p className="text-sm text-muted-foreground">Connect this course to demo management system</p>
                  </div>
                  <Switch
                    id="linkToManageDemos"
                    checked={formData?.linkToManageDemos}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      linkToManageDemos: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="linkToManageDemos">Display in featured course</Label>
                    <p className="text-sm text-muted-foreground">Connect this course to featured management system</p>
                  </div>
                  <Switch
                    id="is_featured"
                    checked={formData?.is_featured}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      is_featured: checked
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button type="submit" className="flex-1 sm:flex-none" disabled={addEditCourseMutation.isPending}>
                {addEditCourseMutation.isPending ? <InlineLoader size="sm" /> : null}
                {addEditCourseMutation.isPending ? (id ? "Updating..." : "Creating...") : (id ? "Update Course" : "Add Course")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/courses')}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
