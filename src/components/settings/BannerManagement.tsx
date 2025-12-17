
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, Upload, Edit, Trash2, Plus, X } from "lucide-react";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Banner, BannerFormData } from "@/types/banner";
import { fetchApi } from "@/services/api/fetchApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserRoleType } from "@/pages/AddUser";
import { hasPermission } from "@/utils/checkPermission";

export function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<BannerFormData>({
    title: "",
    image: null,
    ctaButton: { text: "", url: "" },
    // dateRange: { startDate: undefined, endDate: undefined },
    audience: {
      userRoles: [],
      courses: [],
      artForms: [],
      ageGroups: [],
      timezones: [],
      countries: []
    },
    isActive: true
  });

  const bannerQueries = useQuery({
    queryKey: ["bannerQueries"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "setting/banner",
      }),
  });

  const createBannerImageMutation = useMutation({
    mutationFn: (bannerImage: any) =>
      fetchApi<any>({
        path: `setting/banner/add-file/${bannerImage.id}`,
        method: 'PATCH',
        data: bannerImage.fileData
      }),
  });

  const createUpdateBannerMutation = useMutation({
    mutationKey: [editingBanner?.id],
    mutationFn: (banner: any) =>
      fetchApi<any>({
        path: `setting/banner${banner?.id ? `/${banner?.id}` : ""}`,
        method: banner?.id ? 'PATCH' : 'POST',
        data: banner.data
      }),
    onSuccess: async (data, variables) => {
      const fileData = new FormData();
      fileData.append("file", formData.image);
      await createBannerImageMutation.mutateAsync({
        id: data.id,
        fileData
      })
      bannerQueries.refetch()
      setShowUploadModal(false);
      resetForm();
      toast({
        title: `Banner ${variables.id ? "Updated" : "Created"} Successfully`,
        description: `Banner ${variables.id ? "Updated" : "Created"} Successfully`,
        duration: 3000
      });
    },
    onError: (error, variables) => {
      toast({
        title: `Error ${variables.id ? "Updating" : "Creating"} Banner`,
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
        duration: 3000
      });
    }
  });

  const deleteBannerMutation = useMutation({
    mutationFn: (bannerId: string) =>
      fetchApi<any>({
        path: `setting/banner/${bannerId}`,
        method: 'DELETE',
      }),
    onSuccess: () => {
      bannerQueries.refetch()
      toast({
        title: "Banner Deleted Successfully",
        duration: 3000
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Deleting Banner",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
        duration: 5000
      });
    },
  });

  useEffect(() => {
    if (
      !bannerQueries.isLoading &&
      bannerQueries.data
    ) {
      const bannerData = bannerQueries.data.map((v) => ({
        id: v.id,
        title: v.banner_title,
        imageUrl: v.banner_link,
        ctaButton: {
          text: v.cta_button,
          url: v.cta_button_link,
        },
        // dateRange: {
        //   startDate: v.start_date,
        //   endDate: v.end_date,
        // },
        audience: {
          userRoles: v.user_role_details?.map(u => u.name),
          // courses: string[];
          // artForms: string[];
          // ageGroups: string[];
          // timezones: string[];
          // countries: string[];
        },
        isActive: v.is_active,
        createdAt: v.created_at,
        updatedAt: v.updated_at,
      }))
      setBanners(bannerData);
    }
  }, [bannerQueries.isLoading, bannerQueries.data]);

  const resetForm = () => {
    setFormData({
      title: "",
      image: null,
      ctaButton: { text: "", url: "" },
      // dateRange: { startDate: undefined, endDate: undefined },
      audience: {
        userRoles: [],
        courses: [],
        artForms: [],
        ageGroups: [],
        timezones: [],
        countries: []
      },
      isActive: true
    });
    setImagePreview(null);
    setEditingBanner(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setFormData({ ...formData, image: file });
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or GIF image.",
          variant: "destructive"
        });
      }
    }
  };

  const handleMultiSelectChange = (field: keyof BannerFormData['audience'], value: string) => {
    const currentValues = formData.audience[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    setFormData({
      ...formData,
      audience: { ...formData.audience, [field]: newValues }
    });
  };

  const removeFromMultiSelect = (field: keyof BannerFormData['audience'], value: string) => {
    setFormData({
      ...formData,
      audience: {
        ...formData.audience,
        [field]: formData.audience[field].filter(v => v !== value)
      }
    });
  };

  const handleSaveBanner = async () => {
    if (!formData.image && !editingBanner) {
      toast({
        title: "Image required",
        description: "Please upload a banner image.",
        variant: "destructive"
      });
      return;
    }

    // if (!formData.dateRange.startDate || !formData.dateRange.endDate) {
    //   toast({
    //     title: "Date range required",
    //     description: "Please select start and end dates.",
    //     variant: "destructive"
    //   });
    //   return;
    // }

    const mappedRoles = formData.audience.userRoles.map(role => {
      switch (role) {
        case UserRoleType.Admin: return 2;
        case UserRoleType.Instructor: return 3;
        case UserRoleType.Student: return 4;
        case UserRoleType.Parent: return 5;
        case UserRoleType.Support: return 6;
        case UserRoleType.AccountManager: return 7; // Assign a numerical ID
        case UserRoleType.ContentManager: return 8; // Assign a numerical ID
        default: return 4; // Default to student if unknown
      }
    });

    const bannerData = {
      banner_title: formData.title || undefined,
      cta_button: formData.ctaButton?.text,
      cta_button_link: formData.ctaButton?.url,
      // start_date: formData.dateRange.startDate!.toISOString(),
      // end_date: formData.dateRange.endDate!.toISOString(),
      user_role: mappedRoles,
      is_active: formData.isActive
    };

    createUpdateBannerMutation.mutate({ id: editingBanner?.id, data: bannerData })
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      image: null,
      ctaButton: banner.ctaButton || { text: "", url: "" },
      // dateRange: {
      //   startDate: new Date(banner.dateRange.startDate),
      //   endDate: new Date(banner.dateRange.endDate)
      // },
      audience: banner?.audience,
      isActive: banner.isActive
    });
    setImagePreview(banner.imageUrl);
    setShowUploadModal(true);
  };

  const handleDeleteBanner = (bannerId: string) => {
    deleteBannerMutation.mutate(bannerId)
  };

  const toggleBannerStatus = (bannerId: string, check: boolean) => {
    createUpdateBannerMutation.mutate({
      id: bannerId, data: {
        is_active: check
      }
    })
  };

  const formatAudienceSummary = (audience: Banner['audience']) => {
    const parts = [];
    if (audience.userRoles?.length > 0) parts.push(`Roles: ${audience.userRoles.slice(0, 2).join(", ")}${audience.userRoles.length > 2 ? "..." : ""}`);
    if (audience.artForms?.length > 0) parts.push(`Arts: ${audience.artForms.slice(0, 2).join(", ")}${audience.artForms.length > 2 ? "..." : ""}`);
    return parts.join(" • ") || "All audiences";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {hasPermission("HAS_CREATE_BANNER_MANAGEMENT") && (
          <Button onClick={() => setShowUploadModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Banner
          </Button>
        )}
      </div>

      {/* Banner List */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Banners</CardTitle>
        </CardHeader>
        <CardContent>
          {banners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No banners created yet. Click "Create Banner" to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Preview</TableHead>
                    <TableHead>Title</TableHead>
                    {/* <TableHead>Active Dates</TableHead> */}
                    <TableHead>Audience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <img
                          src={banner.imageUrl}
                          alt={banner.title || "Banner"}
                          className="w-16 h-10 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{banner.title || "Untitled Banner"}</div>
                          {banner.ctaButton && (
                            <div className="text-xs text-muted-foreground">
                              CTA: {banner.ctaButton.text}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        <div className="text-sm">
                          <div>{format(new Date(banner.dateRange.startDate), "MMM dd, yyyy")}</div>
                          <div className="text-muted-foreground">to {format(new Date(banner.dateRange.endDate), "MMM dd, yyyy")}</div>
                        </div>
                      </TableCell> */}
                      <TableCell>
                        <div className="text-sm">{formatAudienceSummary(banner.audience)}</div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={banner.isActive}
                          onCheckedChange={() => toggleBannerStatus(banner.id, !banner?.isActive)}
                          disabled={!hasPermission("HAS_EDIT_BANNER_MANAGEMENT")}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {hasPermission("HAS_EDIT_BANNER_MANAGEMENT") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditBanner(banner)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {hasPermission("HAS_DELETE_BANNER_MANAGEMENT") && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this banner? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteBanner(banner.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload/Edit Modal */}
      <Dialog open={showUploadModal} onOpenChange={(open) => {
        if (!open) resetForm();
        setShowUploadModal(open);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBanner ? "Edit Banner" : "Create New Banner"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label>Banner Image *</Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, image: null });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <Label htmlFor="banner-upload" className="cursor-pointer">
                        <span className="text-primary hover:underline">Click to upload</span> or drag and drop
                      </Label>
                      <p className="text-xs text-muted-foreground">JPG, PNG, GIF up to 10MB</p>
                    </div>
                    <Input
                      id="banner-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="banner-title">Banner Title (Optional)</Label>
                  <Input
                    id="banner-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., New Course Launch"
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>CTA Button (Optional)</Label>
                  <Input
                    placeholder="Button text (e.g., Join Now)"
                    value={formData.ctaButton?.text || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      ctaButton: { ...formData.ctaButton!, text: e.target.value }
                    })}
                  />
                  <Input
                    placeholder="Button URL (e.g., /courses/guitar)"
                    value={formData.ctaButton?.url || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      ctaButton: { ...formData.ctaButton!, url: e.target.value }
                    })}
                  />
                </div>

                {/* Date Range */}
                {/* <div className="space-y-2">
                  <Label>Date Range *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("justify-start text-left font-normal", !formData.dateRange.startDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dateRange.startDate ? format(formData.dateRange.startDate, "MMM dd, yyyy") : "Start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.dateRange.startDate}
                          onSelect={(date) => setFormData({
                            ...formData,
                            dateRange: { ...formData.dateRange, startDate: date }
                          })}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("justify-start text-left font-normal", !formData.dateRange.endDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dateRange.endDate ? format(formData.dateRange.endDate, "MMM dd, yyyy") : "End date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.dateRange.endDate}
                          onSelect={(date) => setFormData({
                            ...formData,
                            dateRange: { ...formData.dateRange, endDate: date }
                          })}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div> */}
              </div>

              {/* Audience Targeting */}
              <div className="space-y-4">
                <h4 className="font-medium">Audience Targeting</h4>

                {/* User Roles */}
                <div>
                  <Label>User Roles</Label>
                  <Select onValueChange={(value) => handleMultiSelectChange('userRoles', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select user roles" />
                    </SelectTrigger>
                    <SelectContent>
                      {([
                        UserRoleType.Student,
                        UserRoleType.Admin,
                        UserRoleType.Support,
                        UserRoleType.Instructor,
                        UserRoleType.Parent
                      ]).map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.audience.userRoles.map(role => (
                      <Badge key={role} variant="secondary" className="gap-1">
                        {role}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromMultiSelect('userRoles', role)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="banner-status">Active Status</Label>
                <p className="text-sm text-muted-foreground">Banner will be shown to users when active</p>
              </div>
              <Switch
                id="banner-status"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveBanner}>
                {editingBanner ? "Update Banner" : "Create Banner"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
