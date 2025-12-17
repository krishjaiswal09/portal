
import React, { useState, useEffect } from 'react'
import { Course, CourseCategory, CourseSubcategory, Artform } from "@/types/course"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { TopicsCoveredSection } from "./TopicsCoveredSection"
import { artforms } from "@/data/courseData"
import { instructors } from "@/data/classData"
import { X, Upload, Plus } from "lucide-react"

interface CourseDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (courseData: any) => void
  course?: Course | null
  categories: CourseCategory[]
  subcategories: CourseSubcategory[]
}

export function CourseDrawer({ isOpen, onClose, onSave, course, categories, subcategories }: CourseDrawerProps) {
  const [formData, setFormData] = useState({
    name: '',
    artform: '',
    categoryId: '',
    subcategoryId: '',
    description: '',
    introductionVideoUrl: '',
    instructors: [],
    topicsCovered: [],
    learningOutcomes: [''],
    objectives: [''],
    status: 'draft'
  })

  const filteredSubcategories = subcategories.filter(sub => sub.categoryId === formData.categoryId)

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        artform: course.artform,
        categoryId: course.categoryId,
        subcategoryId: course.subcategoryId || '',
        description: course.description,
        introductionVideoUrl: course.introductionVideoUrl || '',
        instructors: course.instructors,
        topicsCovered: course.topicsCovered || [],
        learningOutcomes: course.learningOutcomes?.length ? course.learningOutcomes : [''],
        objectives: course.objectives?.length ? course.objectives : [''],
        status: course.status
      })
    } else {
      setFormData({
        name: '',
        artform: '',
        categoryId: '',
        subcategoryId: '',
        description: '',
        introductionVideoUrl: '',
        instructors: [],
        topicsCovered: [],
        learningOutcomes: [''],
        objectives: [''],
        status: 'draft'
      })
    }
  }, [course])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Filter out empty learning outcomes and objectives
    const cleanedData = {
      ...formData,
      learningOutcomes: formData.learningOutcomes.filter(outcome => outcome.trim()),
      objectives: formData.objectives.filter(objective => objective.trim())
    }
    onSave(cleanedData)
  }

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryId,
      subcategoryId: '' // Reset subcategory when category changes
    }))
  }

  const handleInstructorToggle = (instructor: string) => {
    setFormData(prev => ({
      ...prev,
      instructors: prev.instructors.includes(instructor)
        ? prev.instructors.filter(i => i !== instructor)
        : [...prev.instructors, instructor]
    }))
  }

  const handleLearningOutcomeChange = (index: number, value: string) => {
    const newOutcomes = [...formData.learningOutcomes]
    newOutcomes[index] = value
    setFormData(prev => ({ ...prev, learningOutcomes: newOutcomes }))
  }

  const addLearningOutcome = () => {
    setFormData(prev => ({ ...prev, learningOutcomes: [...prev.learningOutcomes, ''] }))
  }

  const removeLearningOutcome = (index: number) => {
    if (formData.learningOutcomes.length > 1) {
      const newOutcomes = formData.learningOutcomes.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, learningOutcomes: newOutcomes }))
    }
  }

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...formData.objectives]
    newObjectives[index] = value
    setFormData(prev => ({ ...prev, objectives: newObjectives }))
  }

  const addObjective = () => {
    setFormData(prev => ({ ...prev, objectives: [...prev.objectives, ''] }))
  }

  const removeObjective = (index: number) => {
    if (formData.objectives.length > 1) {
      const newObjectives = formData.objectives.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, objectives: newObjectives }))
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>
            {course ? 'Edit Course' : 'Create New Course'}
          </DrawerTitle>
        </DrawerHeader>
        
        <form onSubmit={handleSubmit} className="px-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter course name"
                required
              />
            </div>

            {/* Artform */}
            <div className="space-y-2">
              <Label>Artform *</Label>
              <Select
                value={formData.artform}
                onValueChange={(value) => setFormData(prev => ({ ...prev, artform: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select artform" />
                </SelectTrigger>
                <SelectContent>
                  {artforms.map((artform) => (
                    <SelectItem key={artform} value={artform}>
                      {artform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory */}
            <div className="space-y-2">
              <Label>Subcategory *</Label>
              <Select
                value={formData.subcategoryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subcategoryId: value }))}
                disabled={!formData.categoryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.categoryId ? "Select subcategory" : "Select category first"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: subcategory.color }}
                        />
                        {subcategory.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Course description and objectives"
              rows={4}
            />
          </div>

          {/* Introduction Video URL */}
          <div className="space-y-2">
            <Label htmlFor="introVideo">Introduction Video URL</Label>
            <Input
              id="introVideo"
              value={formData.introductionVideoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, introductionVideoUrl: e.target.value }))}
              placeholder="Enter video URL (YouTube, Vimeo, etc.)"
            />
          </div>

          {/* Instructors */}
          <div className="space-y-2">
            <Label>Assign Instructors</Label>
            <div className="grid grid-cols-2 gap-2">
              {instructors.map((instructor) => (
                <div key={instructor} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={instructor}
                    checked={formData.instructors.includes(instructor)}
                    onChange={() => handleInstructorToggle(instructor)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={instructor} className="text-sm font-normal">
                    {instructor}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Topics Covered */}
          <TopicsCoveredSection
            topics={formData.topicsCovered}
            onTopicsChange={(topics) => setFormData(prev => ({ ...prev, topicsCovered: topics }))}
          />

          {/* Learning Outcomes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Learning Outcomes</Label>
              <Button type="button" onClick={addLearningOutcome} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Outcome
              </Button>
            </div>
            <div className="space-y-3">
              {formData.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={outcome}
                    onChange={(e) => handleLearningOutcomeChange(index, e.target.value)}
                    placeholder="Enter learning outcome"
                    className="flex-1"
                  />
                  {formData.learningOutcomes.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLearningOutcome(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Objectives */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Course Objectives</Label>
              <Button type="button" onClick={addObjective} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Objective
              </Button>
            </div>
            <div className="space-y-3">
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={objective}
                    onChange={(e) => handleObjectiveChange(index, e.target.value)}
                    placeholder="Enter course objective"
                    className="flex-1"
                  />
                  {formData.objectives.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeObjective(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.status === 'published'}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ 
                  ...prev, 
                  status: checked ? 'published' : 'draft' 
                }))
              }
            />
            <Label htmlFor="published">Publish Course</Label>
          </div>
        </form>

        <DrawerFooter>
          <div className="flex gap-2">
            <Button type="submit" onClick={handleSubmit}>
              {course ? 'Update Course' : 'Create Course'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
