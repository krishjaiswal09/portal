
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CourseCategory, CourseSubcategory } from "@/types/course";
import { Plus, Edit, Trash2, FolderOpen, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { hasPermission } from '@/utils/checkPermission';

interface CategoryManagementProps {
  categories: CourseCategory[];
  subcategories: CourseSubcategory[];
  onCreateCategory: (category: Omit<CourseCategory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditCategory: (id: string, category: Partial<CourseCategory>) => void;
  onDeleteCategory: (id: string) => void;
}

export function CategoryManagement({
  categories,
  subcategories,
  onCreateCategory,
  onEditCategory,
  onDeleteCategory
}: CategoryManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      onEditCategory(editingCategory.id, formData);
      setEditingCategory(null);
    } else {
      onCreateCategory(formData);
    }
    setFormData({
      name: '',
      description: ''
    });
    setShowAddForm(false);
  };

  const handleEdit = (category: CourseCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Category Management</h2>
          <p className="text-muted-foreground">Manage course categories</p>
        </div>
        {
          hasPermission("HAS_CREATE_COURSE_CATEGORY") && <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        }
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Categories ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Subcategories</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => {
                  const subcategoryCount = category.subCategories?.length;
                  return (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-muted-foreground truncate">
                          {category.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {subcategoryCount} subcategories
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {
                            hasPermission("HAS_EDIT_COURSE_CATEGORY") && <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                          {
                            hasPermission("HAS_DELETE_COURSE_CATEGORY") && <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                                    Delete Category
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{category.name}"?
                                    {subcategoryCount > 0 && (
                                      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                                        <p className="text-amber-800 font-medium">Impact Warning:</p>
                                        <p className="text-amber-700 text-sm">
                                          This will also delete {subcategoryCount} subcategories and may affect related courses.
                                        </p>
                                      </div>
                                    )}
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onDeleteCategory(category.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete Category
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          }
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No categories created yet</p>
              <p className="text-sm">Add your first category to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
