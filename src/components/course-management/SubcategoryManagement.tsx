
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CourseCategory, CourseSubcategory } from "@/types/course";
import { Plus, Edit, Trash2, Layers, AlertTriangle } from "lucide-react";
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

interface SubcategoryManagementProps {
  categories: CourseCategory[];
  subcategories: CourseSubcategory[];
  onCreateSubcategory: (subcategory: Omit<CourseSubcategory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditSubcategory: (id: string, subcategory: Partial<CourseSubcategory>) => void;
  onDeleteSubcategory: (id: string) => void;
}

export function SubcategoryManagement({
  categories,
  subcategories,
  onCreateSubcategory,
  onEditSubcategory,
  onDeleteSubcategory
}: SubcategoryManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<CourseSubcategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubcategory) {
      onEditSubcategory(editingSubcategory.id, formData);
      setEditingSubcategory(null);
    } else {
      onCreateSubcategory(formData);
    }
    setFormData({
      name: '',
      description: '',
      categoryId: ''
    });
    setShowAddForm(false);
  };

  const handleEdit = (subcategory: CourseSubcategory) => {
    setEditingSubcategory(subcategory);
    setFormData({
      name: subcategory.name,
      description: subcategory.description,
      categoryId: subcategory.category.id
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingSubcategory(null);
    setFormData({
      name: '',
      description: '',
      categoryId: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subcategory Management</h2>
          <p className="text-muted-foreground">Manage course subcategories</p>
        </div>
        {
          hasPermission("HAS_CREATE_COURSE_CATEGORY") && <Button onClick={() => setShowAddForm(true)} disabled={categories.length === 0}>
            <Plus className="h-4 w-4 mr-2" />
            Add Subcategory
          </Button>
        }
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Layers className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No categories available</p>
            <p className="text-sm text-muted-foreground">Create categories first before adding subcategories</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form */}
      {showAddForm && categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Subcategory Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Parent Category</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={`${category.id}_Cat`} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  {editingSubcategory ? 'Update Subcategory' : 'Create Subcategory'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Subcategories Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Subcategories ({subcategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subcategories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Parent Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subcategories.map((subcategory) => (
                  <TableRow key={subcategory.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                        />
                        <span className="font-medium">{subcategory.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm text-muted-foreground truncate">
                        {subcategory.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {subcategory.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {
                          hasPermission("HAS_EDIT_COURSE_CATEGORY") && <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(subcategory)}
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
                                  Delete Subcategory
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{subcategory.name}"?
                                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                                    <p className="text-amber-800 font-medium">Impact Warning:</p>
                                    <p className="text-amber-700 text-sm">
                                      This may affect courses that belong to this subcategory.
                                    </p>
                                  </div>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDeleteSubcategory(subcategory.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete Subcategory
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Layers className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No subcategories created yet</p>
              <p className="text-sm">Add your first subcategory to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
