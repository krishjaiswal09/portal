import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  ChevronDown,
  ChevronRight,
  Edit,
  LayoutGrid,
  List,
  Trash2,
} from "lucide-react";
import { AddCategoryModal } from "./AddCategoryModal";
import { AddClassTypeModal } from "./AddClassTypeModal";
import { EditClassTypeModal } from "./EditClassTypeModal";
import { Category, ClassType } from "@/types/classType";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useToast } from "@/hooks/use-toast";
import { hasPermission } from "@/utils/checkPermission";

const formatCurrency = (amount: number, currency: string) => {
  const symbols: Record<string, string> = {
    USD: "$",
    INR: "₹",
    CAD: "C$",
    EUR: "€",
    GBP: "£",
  };
  return `${amount?.toLocaleString()} ${currency}`;
};

const formatPaymentMethod = (method: string) => {
  const methods: Record<string, string> = {
    credit_card: "Credit Card",
    bank_transfer: "Bank Transfer",
    cash: "Cash",
    upi: "UPI",
    paypal: "PayPal",
  };
  return methods[method] || method;
};

export function ClassTypeManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["1"]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const classTypeQueries = useQuery({
    queryKey: ["classTypeQueries"],
    queryFn: () =>
      fetchApi<ClassType[]>({
        path: "classes/class-type",
      }),
  });

  const classTypeCategoriesQueries = useQuery({
    queryKey: ["classTypeCategoriesQueries"],
    queryFn: () =>
      fetchApi<Category[]>({
        path: "class-type-category",
      }),
  });

  const deleteClassTypeMutation = useMutation({
    mutationFn: (id: string) =>
      fetchApi({
        path: `classes/class-type/${id}`,
        method: "DELETE",
      }),
  });

  const editClassTypeMutation = useMutation({
    mutationFn: (data: { id: string; payload: Partial<ClassType> }) =>
      fetchApi({
        path: `classes/class-type/${data.id}`,
        method: "PATCH",
        data: data.payload,
      }),
  });

  const addClassCategoryMutation = useMutation({
    mutationFn: (classType: { name: string }) =>
      fetchApi<Category>({
        path: `class-type-category`,
        method: "POST",
        data: classType,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classTypeCategoriesQueries"],
      });
      toast({
        title: "Class Category Added Successfully",
        duration: 3000,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Adding Class Category",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const deleteClassCategoryMutation = useMutation({
    mutationFn: (id: string) =>
      fetchApi<Category>({
        path: `class-type-category/${id}`,
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classTypeCategoriesQueries"],
      });
      toast({
        title: "Class Category Deleted Successfully",
        variant: "destructive",
        duration: 3000,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Deleting Class Category",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const editClassCategoryMutation = useMutation({
    mutationFn: (params: { name: string; id: string; status?: boolean }) =>
      fetchApi<Category>({
        path: `class-type-category/${params.id}`,
        method: "PUT",
        data: { name: params.name, is_active: params.status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classTypeCategoriesQueries"],
      });
      toast({
        title: "Class Category Updated Successfully",
        duration: 3000,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Class Category",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  useEffect(() => {
    if (
      !classTypeCategoriesQueries.isLoading &&
      classTypeCategoriesQueries.data
    ) {
      setCategories(classTypeCategoriesQueries.data);
    }
  }, [classTypeCategoriesQueries.isLoading, classTypeCategoriesQueries.data]);

  useEffect(() => {
    if (!classTypeQueries.isLoading && classTypeQueries.data) {
      setClassTypes(classTypeQueries.data);
    }
  }, [classTypeQueries.isLoading, classTypeQueries.data, categories]);

  const handleAddCategory = (name: string) => {
    addClassCategoryMutation.mutate({
      name,
    });
  };

  const handleEditCategory = (name: string, id: string) => {
    editClassCategoryMutation.mutate({
      name,
      id,
    });
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    deleteClassCategoryMutation.mutate(categoryId);
  };

  const handleToggleCategory = (category: Category) => {
    editClassCategoryMutation.mutate({
      name: category.name,
      status: !category.is_active,
      id: category.id,
    });
  };

  const handleAddClassType = (classType: ClassType) => {
    queryClient.invalidateQueries({ queryKey: ["classTypeQueries"] });
    queryClient.invalidateQueries({ queryKey: ["classTypeCategoriesQueries"] });
  };

  const handleEditClassType = (payload: any) => {
    editClassTypeMutation.mutate(
      {
        id: payload.id,
        payload: {
          name: payload.name,
          credit: payload.credit,
          price: payload.price,
          payment_gateway: payload.payment_gateway,
          currency: payload.currency,
          duration: payload.duration,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["classTypeQueries"] });
          queryClient.invalidateQueries({
            queryKey: ["classTypeCategoriesQueries"],
          });
          toast({
            title: "Group Type Updated",
            description: `${payload.name} has been updated successfully.`,
            duration: 3000,
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error Updating Group Type",
            description:
              error?.message ||
              "An unexpected error occurred while updating the group type.",
            variant: "destructive",
            duration: 5000,
          });
        },
      }
    );
  };

  const handleDeleteClassType = (
    classTypeId: string,
    classTypeName: string
  ) => {
    deleteClassTypeMutation.mutate(classTypeId, {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["classTypeQueries"] });
        queryClient.invalidateQueries({
          queryKey: ["classTypeCategoriesQueries"],
        });
        toast({
          title: "Group Type Deleted",
          description: `${classTypeName} has been deleted successfully.`,
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error Deleting Group Type",
          description: error?.message || "An unexpected error occurred.",
          variant: "destructive",
          duration: 5000,
        });
      },
    });
  };

  const handleToggleClassType = (classType: any) => {
    const newActiveStatus = !classType.is_active;
    editClassTypeMutation.mutate(
      {
        id: classType.id,
        payload: { is_active: newActiveStatus },
      },
      {
        onSuccess: () => {
          setClassTypes((prev) =>
            prev?.map((ct) =>
              ct.id === classType.id
                ? { ...ct, is_active: newActiveStatus }
                : ct
            )
          );
          queryClient.invalidateQueries({ queryKey: ["classTypeQueries"] });
          toast({
            title: "Group Type Updated",
            description: `${classType.name} has been ${newActiveStatus ? "activated" : "deactivated"
              } successfully.`,
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error Updating Group Type",
            description: error?.message || "An unexpected error occurred.",
            variant: "destructive",
            duration: 5000,
          });
        },
      }
    );
  };

  const handleToggleExpanded = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev?.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getClassTypesForCategory = (categoryId: string) => {
    return classTypes?.filter((ct) => ct.category === categoryId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-medium">Group Type Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage categories and group types with payment links
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            {" "}
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            {" "}
            <List className="w-4 h-4" />
          </Button>
          {hasPermission("HAS_CREATE_CLASS_TYPE") && (
            <AddCategoryModal onAddCategory={handleAddCategory} />
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {categories?.map((category) => {
          const categoryClassTypes = getClassTypesForCategory(category.id);
          const isExpanded = expandedCategories?.includes(category.id);

          return (
            <Card key={category.id}>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleExpanded(category.id)}
                      className="p-0"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {category.name}
                      <Badge
                        variant={category.is_active ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {category.is_active ? "Enabled" : "Disabled"}
                      </Badge>
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {categoryClassTypes.length} group types
                    </span>
                    {hasPermission("HAS_EDIT_CLASS_TYPE") && (
                      <AddCategoryModal
                        onAddCategory={(name, id) =>
                          id && handleEditCategory(name, id)
                        }
                        cname={category.name}
                        id={category.id}
                      />
                    )}
                    {hasPermission("HAS_DELETE_CLASS_TYPE") && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{category.name}"?
                            This will also delete all{" "}
                            {categoryClassTypes.length} group type(s) in this
                            category. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDeleteCategory(category.id, category.name)
                            }
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                      </AlertDialog>
                    )}
                    <Switch
                      checked={category.is_active}
                      onCheckedChange={() => handleToggleCategory(category)}
                      disabled={!hasPermission("HAS_EDIT_CLASS_TYPE")}
                    />
                  </div>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="space-y-4 px-4 pb-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Group Types</h4>
                    {hasPermission("HAS_CREATE_CLASS_TYPE") && (
                      <AddClassTypeModal
                        categoryId={category.id}
                        onAddClassType={handleAddClassType}
                      />
                    )}
                  </div>

                  {categoryClassTypes.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2 text-center">
                      No group types added yet.
                    </p>
                  ) : (
                    <div
                      className={`grid ${viewMode === "grid"
                          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                          : "gap-2"
                        }`}
                    >
                      {categoryClassTypes?.map((classType) => (
                        <div
                          key={classType.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md bg-muted/40"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-medium truncate">
                                {classType.name}
                              </h5>
                              <Badge
                                variant={
                                  classType.is_active ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                {classType.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Credits: {classType.credit}</span>
                              <span>
                                Price:{" "}
                                {formatCurrency(
                                  classType.price,
                                  classType.currency_name
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                              <span>
                                Duration: {classType.duration || 60} mins
                              </span>
                              <span>
                                Payment:{" "}
                                {formatPaymentMethod(
                                  classType.payment_gateway_name || "credit_card"
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-4">
                            {hasPermission("HAS_EDIT_CLASS_TYPE") && (
                              <EditClassTypeModal
                                classType={classType}
                                onEditClassType={handleEditClassType}
                              />
                            )}
                            {hasPermission("HAS_DELETE_CLASS_TYPE") && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Group Type
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "
                                    {classType.name}"? This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteClassType(
                                        classType.id,
                                        classType.name
                                      )
                                    }
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                              </AlertDialog>
                            )}
                            <Switch
                              checked={classType.is_active}
                              onCheckedChange={() =>
                                handleToggleClassType(classType)
                              }
                              disabled={!hasPermission("HAS_EDIT_CLASS_TYPE")}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No categories created yet. Click "Add Category" to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
