
import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RolePermissionsModal } from "@/components/settings/RolePermissionsModal";
import { CreateRoleModal } from "@/components/settings/CreateRoleModal";
import { ClassTypeManagement } from "@/components/settings/ClassTypeManagement";
import { BannerManagement } from "@/components/settings/BannerManagement";
import { NotificationSettingsContent } from "@/components/settings/NotificationSettingsContent";
import { CancelReschedulingSettings } from "@/components/settings/CancelReschedulingSettings";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  MessageSquare,
  Users,
  FileText,
  Shield,
  Database,
  ToggleLeft,
  Upload,
  Download,
  Archive,
  Webhook,
  CreditCard,
  BookOpen,
  Bell,
  Image,
  CalendarX
} from "lucide-react";
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/services/api/fetchApi';
import { PermissionInterface, RoleCreateInterface } from '@/types/settings';
import { useUploadBucket } from '@/hooks/use-upload-bucket';
import { StartTeacherManagement } from '@/components/settings/StartTeacherManagement';
import { hasPermission } from '@/utils/checkPermission';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SectionLoader, InlineLoader } from "@/components/ui/loader";


// Define the state interface
interface CancelRescheduleSettings {
  // Instructor permissions
  instructor_can_cancel_class: boolean;
  instructor_can_reschedule_class: boolean;
  mini_hours_before_instructor_can_cancel_class: string;
  mini_hours_before_instructor_can_reschedule_class: string;
  // Learner permissions
  user_can_cancel_class: boolean;
  user_can_reschedule_class: boolean;
  mini_hours_before_user_can_cancel_class: string;
  mini_hours_before_user_can_reschedule_class: string;
  // Class timing settings
  class_can_start_minutes_before_schedule_time: string;
  delay_limit_for_joining_class: number;
  // Rescheduling limits
  max_days_in_future_for_rescheduling: string;
  id?: string,
  created_at?: string,
  updated_at?: string,
}

export default function AdminSettings() {
  const navigate = useNavigate();

  if (!hasPermission("HAS_READ_SETTING")) {
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

  const uploadMutation = useUploadBucket();
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleCreateInterface | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Payment Mode toggles
  const [razorpayEnabled, setRazorpayEnabled] = useState(true);
  const [stripeEnabled, setStripeEnabled] = useState(false);

  const [policies, setPolicies] = useState<any>({
    terms_of_service: "",
    privacy_policy: "",
    refund_cancellation_policy: "",
    consent_checkboxes_for_registration: true
  })

  const [generalSettings, setGeneralSettings] = useState<any>({
    logo_url: "",
    portal_name: "Art Gharana",
    support_email: "support@artgharana.com",
    support_phone: "+91 98765 43210",
    default_language: "english",
    default_timezone: "asia-kolkata"
  })

  const [communicationSettings, setCommunicationSettings] = useState<any>({
    whatsapp_notification: true,
    whatsapp_message: "",
    email_notification: true,
    email_signature: "Best regards,\nArt Gharana Team\nwww.artgharana.com",
    default_footer: "Follow us on social media for updates and tips!",
  })

  const [featuresSetting, setFeature] = useState<any>({
    progress_reports: false,
    referral_system: false,
    trial_class_booking: false,
    whatsApp_integration: false,
    payment_gateway: false
  })

  const [settings, setSettings] = useState<CancelRescheduleSettings>({
    // Instructor permissions
    instructor_can_cancel_class: true,
    instructor_can_reschedule_class: true,
    mini_hours_before_instructor_can_cancel_class: "24",
    mini_hours_before_instructor_can_reschedule_class: "24",
    // Learner permissions
    user_can_cancel_class: true,
    user_can_reschedule_class: true,
    mini_hours_before_user_can_cancel_class: "12",
    mini_hours_before_user_can_reschedule_class: "12",
    // Class timing settings
    class_can_start_minutes_before_schedule_time: "5",
    delay_limit_for_joining_class: 10,
    // Rescheduling limits
    max_days_in_future_for_rescheduling: "15",

    id: null,
    created_at: null,
    updated_at: null,
  });

  const { toast } = useToast();

  const allTabs = [
    { id: "general", label: "General", icon: Settings, changed: false, permission: "HAS_READ_SETTING" },
    { id: "communication", label: "Communication", icon: MessageSquare, changed: false, permission: "HAS_READ_COMMUNICATION_SETTING" },
    { id: "notifications", label: "Notifications", icon: Bell, changed: false, permission: "HAS_READ_NOTIFICATION_SETTING" },
    { id: "roles", label: "Roles & Access", icon: Users, changed: false, permission: "HAS_READ_USER_ROLE" },
    { id: "class-types", label: "Class Types", icon: BookOpen, changed: false, permission: "HAS_READ_CLASS_TYPE" },
    { id: "cancel-reschedule", label: "Cancel & Reschedule", icon: CalendarX, changed: false, permission: "HAS_READ_CANCEL_&_RESCHEDULE" },
    { id: "banners", label: "Banner Management", icon: Image, changed: false, permission: "HAS_READ_BANNER_MANAGEMENT" },
    { id: "policies", label: "Policies", icon: FileText, changed: false, permission: "HAS_READ_SETTING" },
    { id: "star-teacher", label: "Star Teacher", icon: FileText, changed: false, permission: "HAS_READ_STAR_TEACHER" },
    { id: "integrations", label: "Data & Integrations", icon: Database, changed: false, permission: "HAS_READ_DATA_&_INTEGRATION" },
    { id: "features", label: "Feature Toggles", icon: ToggleLeft, changed: false, permission: "HAS_READ_FEATURE_TOGGLE" },
  ];

  const [tabs, setTabs] = useState(
    allTabs.filter(tab => hasPermission(tab.permission))
  );

  const [userRoles, setUserRoles] = useState<RoleCreateInterface[]>([]);

  const features = [
    { name: "Progress Reports", description: "Detailed student progress tracking", id: "progress_reports", enabled: true },
    { name: "Referral System", description: "Student referral rewards program", id: "referral_system", enabled: false },
    { name: "Trial Class Booking", description: "Allow website visitors to book trial classes", id: "trial_class_booking", enabled: true },
    { name: "WhatsApp Integration", description: "WhatsApp notifications and messaging", id: "whatsApp_integration", enabled: true },
    { name: "Payment Gateway", description: "Online payment processing", id: "payment_gateway", enabled: true },
  ];

  // Get current active tab permission mapping
  const getActiveTabPermissions = () => {
    switch (activeTab) {
      case "general":
        return hasPermission("HAS_EDIT_SETTING");
      case "communication":
        return hasPermission("HAS_EDIT_COMMUNICATION_SETTING");
      case "policies":
        return hasPermission("HAS_EDIT_SETTING");
      case "features":
        return hasPermission("HAS_EDIT_FEATURE_TOGGLE");
      case "cancel-reschedule":
        return hasPermission("HAS_EDIT_CANCEL_&_RESCHEDULE");
      default:
        return false;
    }
  };

  const usersRolesQueries = useQuery({
    queryKey: ["usersRolesQueries"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "roles",
      }),
  });

  const policiesQueries = useQuery({
    queryKey: ["policiesQueries"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "setting/policy",
      }),
  });

  const featureQueries = useQuery({
    queryKey: ["featureQueries"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "setting/feature-toggle",
      }),
  });

  const generalSettingsQueries = useQuery({
    queryKey: ["generalSettingsQueries"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "setting/portal-settings",
      }),
  });

  const communicationSettingsQueries = useQuery({
    queryKey: ["communicationSettingsQueries"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "setting/communication-settings",
      }),
  });

  const cancelRescheduleQueries = useQuery({
    queryKey: ["cancelRescheduleQueries"],
    queryFn: () =>
      fetchApi<any>({
        path: "setting/cancel-reschedule",
      }),
  });

  const addUserRolesMutation = useMutation({
    mutationFn: (roles: any) =>
      fetchApi<any>({
        path: `roles`,
        method: 'POST',
        data: roles
      }),
    onSuccess: (_data, variables) => {
      usersRolesQueries.refetch();
      toast({
        title: "Role Created",
        description: `New role "${variables.name}" has been created successfully.`,
        duration: 3000
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating new role",
        description: `New role has not been created.`,
        variant: "destructive",
        duration: 5000
      });
    },
  });

  const editUserRolesMutation = useMutation({
    mutationFn: (roles: any) => fetchApi<any>({
      path: `roles/${roles.id}`,
      method: 'PATCH',
      data: roles.data
    }),
    onSuccess: (_data, variables) => {
      usersRolesQueries.refetch();
      toast({
        title: "Role Updated",
        description: `Role "${variables?.data?.name}" has been updated successfully.`,
        duration: 3000
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating role",
        description: `Role has not been updated.`,
        variant: "destructive",
        duration: 5000
      });
    },
  });

  const updatePoliciesMutation = useMutation({
    mutationFn: (policy: any) =>
      fetchApi<any>({
        path: `setting/policy`,
        method: 'PATCH',
        data: policy
      }),
    onSuccess: () => policiesQueries.refetch()
  });

  const updateCancelRescheduleMutation = useMutation({
    mutationFn: (cancelReschedule: any) =>
      fetchApi<any>({
        path: `setting/cancel-reschedule`,
        method: 'PATCH',
        data: cancelReschedule
      }),
    onSuccess: () => cancelRescheduleQueries.refetch()
  });

  const updateFeatureMutation = useMutation({
    mutationFn: (feature: any) =>
      fetchApi<any>({
        path: `setting/feature-toggle`,
        method: 'PATCH',
        data: feature
      }),
    onSuccess: () => featureQueries.refetch()
  });

  const updateGeneralSettingsMutation = useMutation({
    mutationFn: (feature: any) =>
      fetchApi<any>({
        path: `setting/portal-settings`,
        method: 'PUT',
        data: feature
      }),
    onSuccess: () => generalSettingsQueries.refetch()
  });

  const updateCommunicationSettingsMutation = useMutation({
    mutationFn: (feature: any) =>
      fetchApi<any>({
        path: `setting/communication-settings`,
        method: 'PUT',
        data: feature
      }),
    onSuccess: () => communicationSettingsQueries.refetch()
  });

  useEffect(() => {
    if (
      !policiesQueries.isLoading &&
      policiesQueries.data
    ) {
      setPolicies(policiesQueries.data);
    }
  }, [policiesQueries.isLoading, policiesQueries.data]);

  useEffect(() => {
    if (
      !cancelRescheduleQueries.isLoading &&
      cancelRescheduleQueries.data
    ) {
      setSettings(cancelRescheduleQueries.data);
    }
  }, [cancelRescheduleQueries.isLoading, cancelRescheduleQueries.data]);

  useEffect(() => {
    if (
      !featureQueries.isLoading &&
      featureQueries.data
    ) {
      setFeature(featureQueries.data);
    }
  }, [featureQueries.isLoading, featureQueries.data]);

  useEffect(() => {
    if (
      !communicationSettingsQueries.isLoading &&
      communicationSettingsQueries.data
    ) {
      setCommunicationSettings(communicationSettingsQueries.data);
    }
  }, [communicationSettingsQueries.isLoading, communicationSettingsQueries.data]);

  useEffect(() => {
    if (
      !generalSettingsQueries.isLoading &&
      generalSettingsQueries.data
    ) {
      setGeneralSettings(generalSettingsQueries.data);
    }
  }, [generalSettingsQueries.isLoading, generalSettingsQueries.data]);

  useEffect(() => {
    if (
      !usersRolesQueries.isLoading &&
      usersRolesQueries.data
    ) {
      const usersRoles: RoleCreateInterface[] = usersRolesQueries.data.map((v) => ({
        name: v.role_name,
        description: v.description,
        permissions: v.permissions,
        users: v.user_count,
        role_id: v.role_id
      }))
      setUserRoles(usersRoles);
    }
  }, [usersRolesQueries.isLoading, usersRolesQueries.data]);

  const handleEditPermissions = (role: RoleCreateInterface) => {
    setSelectedRole(role);
    setPermissionsModalOpen(true);
  };

  const setChanges = (id: string) => {
    setHasUnsavedChanges(true)
    setTabs((prev) => prev.map(v => {
      const changed = v.id === id ? true : v.changed
      return {
        ...v,
        changed
      }
    }))
  }

  const handleSavePermissions = (permissions: number[], role_name: string, role_id: number) => {
    const newRole = {
      name: role_name,
      permissions
    };

    // setUserRoles(prev => [...prev, newRole]);
    editUserRolesMutation.mutate({ data: newRole, id: role_id })
  };

  const handleCreateRole = (roleData: {
    name: string;
    description: string;
    permissions: PermissionInterface[];
    isActive: boolean;
  }) => {
    const newRole = {
      name: roleData.name,
      description: roleData.description,
      is_active: roleData.isActive,
      permissions: roleData.permissions
    };

    // setUserRoles(prev => [...prev, newRole]);
    addUserRolesMutation.mutate(newRole)
  };

  const handleLogoUpload = async (e) => {
    try {
      const result = await uploadMutation.mutateAsync({
        path: 'settings/logo',
        file: e.target.files[0],
        prevFileLink: generalSettings.logo_url
      });

      setGeneralSettings({
        ...generalSettings,
        logo_url: result.url
      })
      setChanges("general")
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleBackupNow = () => {
    toast({
      title: "Backup Started",
      description: "System backup has been initiated and will complete shortly.",
    });
  };

  const handleExportData = (format: string) => {
    toast({
      title: `Export Started`,
      description: `Data export in ${format.toUpperCase()} format has been initiated.`,
    });
  };

  // Check permissions outside of map function
  const canUpdatePolicies = hasPermission("HAS_EDIT_SETTING");
  const canUpdateFeatures = hasPermission("HAS_EDIT_FEATURE_TOGGLE");
  const canUpdateCancelReschedule = hasPermission("HAS_EDIT_CANCEL_&_RESCHEDULE");
  const canUpdateGeneral = hasPermission("HAS_EDIT_SETTING");
  const canUpdateCommunication = hasPermission("HAS_EDIT_COMMUNICATION_SETTING");

  const handleSaveSettings = async () => {
    delete policies.id
    delete policies.created_at
    delete policies.updated_at

    delete featuresSetting.id
    delete featuresSetting.created_at
    delete featuresSetting.updated_at

    delete generalSettings.id
    delete generalSettings.created_at
    delete generalSettings.updated_at


    delete communicationSettings.id
    delete communicationSettings.created_at
    delete communicationSettings.updated_at

    const cancelReschedule = {
      "instructor_can_cancel_class": settings.instructor_can_cancel_class,
      "mini_hours_before_instructor_can_cancel_class": +settings.mini_hours_before_instructor_can_cancel_class,
      "instructor_can_reschedule_class": settings.instructor_can_reschedule_class,
      "mini_hours_before_instructor_can_reschedule_class": +settings.mini_hours_before_instructor_can_reschedule_class,
      "user_can_cancel_class": settings.user_can_cancel_class,
      "mini_hours_before_user_can_cancel_class": +settings.mini_hours_before_user_can_cancel_class,
      "user_can_reschedule_class": settings.user_can_reschedule_class,
      "mini_hours_before_user_can_reschedule_class": +settings.mini_hours_before_user_can_reschedule_class,
      "class_can_start_minutes_before_schedule_time": +settings.class_can_start_minutes_before_schedule_time,
      "max_days_in_future_for_rescheduling": +settings.max_days_in_future_for_rescheduling,
      "delay_limit_for_joining_class": settings.delay_limit_for_joining_class
    }



    const mapMutation = tabs
      .filter((v) => v.changed)
      .map((v) => {
        switch (v.id) {
          case "policies":
            return canUpdatePolicies ? updatePoliciesMutation.mutateAsync(policies) : Promise.resolve();
          case "features":
            return canUpdateFeatures ? updateFeatureMutation.mutateAsync(featuresSetting) : Promise.resolve();
          case "cancel-reschedule":
            return canUpdateCancelReschedule ? updateCancelRescheduleMutation.mutateAsync(cancelReschedule) : Promise.resolve();
          case "general":
            return canUpdateGeneral ? updateGeneralSettingsMutation.mutateAsync(generalSettings) : Promise.resolve();
          case "communication":
            return canUpdateCommunication ? updateCommunicationSettingsMutation.mutateAsync(communicationSettings) : Promise.resolve();
          default:
            return Promise.resolve(); // No-op if key is unknown
        }
      });
    console.log(mapMutation)
    Promise.all(mapMutation).then((e) => {
      toast({
        title: "Settings Saved",
        description: "All settings have been saved successfully.",
        duration: 3000
      });
      setHasUnsavedChanges(false);
    }).catch(() => {
      toast({
        title: "Settings not Saved",
        description: "All settings have not been saved successfully.",
        variant: "destructive",
        duration: 3000
      });
    })
  };

  return (
    <DashboardLayout title="System Settings">
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure and manage your Art Gharana platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
          {/* Mobile-responsive TabsList */}
          <div className="w-full overflow-x-auto">
            <TabsList className="flex flex-wrap gap-1 h-auto p-2 bg-muted rounded-lg w-full lg:w-auto lg:inline-flex">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-1 md:gap-2 text-xs sm:text-sm px-2 py-2 min-w-0 whitespace-nowrap"
                >
                  <tab.icon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline truncate">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Settings className="h-4 w-4 md:h-5 md:w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Configure basic platform settings and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="portal-logo">Portal Logo</Label>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-muted flex items-center justify-center">
                          <Upload className="h-4 w-4 md:h-6 md:w-6 text-muted-foreground" />
                        </div>
                        <Button variant="outline" size="sm" onClick={() => fileRef.current.click()}>
                          Upload Logo
                        </Button>
                        <Input ref={fileRef} type='file' style={{ display: "none" }} onChange={handleLogoUpload} />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="portal-name">Portal Name</Label>
                      <Input
                        id="portal-name"
                        value={generalSettings.portal_name}
                        onChange={(e) => {
                          setGeneralSettings((prev) => ({
                            ...prev,
                            portal_name: e.target.value
                          }))
                          setChanges("general")
                        }}
                        className="mt-1" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="timezone">Default Timezone</Label>
                      <Select
                        value={generalSettings.default_timezone}
                        onValueChange={(v) => {
                          setGeneralSettings((prev) => ({
                            ...prev,
                            default_timezone: v
                          }))
                          setChanges("general")
                        }}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asia-kolkata">Asia/Kolkata (IST)</SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="america-new_york">America/New_York (EST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="language">Default Language</Label>
                      <Select
                        value={generalSettings.default_language}
                        onValueChange={(v) => {
                          setGeneralSettings((prev) => ({
                            ...prev,
                            default_language: v
                          }))
                          setChanges("general")
                        }}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="support-email">Support Email</Label>
                      <Input id="support-email" type="email"
                        value={generalSettings.support_email}
                        onChange={(e) => {
                          setGeneralSettings((prev) => ({
                            ...prev,
                            support_email: e.target.value
                          }))
                          setChanges("general")
                        }}
                        className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="support-phone">Support Phone</Label>
                      <Input id="support-phone"
                        value={generalSettings.support_phone}
                        onChange={(e) => {
                          setGeneralSettings((prev) => ({
                            ...prev,
                            support_phone: e.target.value
                          }))
                          setChanges("general")
                        }} className="mt-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Settings Tab */}
          <TabsContent value="communication" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
                  Communication Settings
                </CardTitle>
                <CardDescription>Configure messaging and notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div className="flex-1">
                      <Label htmlFor="whatsapp-notifications">WhatsApp Notifications</Label>
                      <p className="text-sm text-muted-foreground">Enable WhatsApp messaging for notifications</p>
                    </div>
                    <Switch
                      id="whatsapp-notifications"
                      checked={communicationSettings.whatsapp_notification}
                      onCheckedChange={(check) => {
                        setCommunicationSettings((prev) => ({
                          ...prev,
                          whatsapp_notification: check
                        }))
                        setChanges("communication")
                      }} />
                  </div>

                  <div>
                    <Label htmlFor="whatsapp-templates">WhatsApp Template Messages</Label>
                    <Textarea
                      id="whatsapp-templates"
                      className="mt-1"
                      rows={3}
                      placeholder='Hi {student_name}, your class with {instructor_name} is scheduled for {date} at {time}.'
                      value={communicationSettings.whatsapp_message}
                      onChange={(e) => {
                        setCommunicationSettings((prev) => ({
                          ...prev,
                          whatsapp_message: e.target.value
                        }))
                        setChanges("communication")
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use variables: {"{student_name}, {instructor_name}, {date}, {time}, {class_name}"}
                    </p>
                  </div>

                  <Separator />

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div className="flex-1">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Enable email notifications</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={communicationSettings.email_notification}
                      onCheckedChange={(check) => {
                        setCommunicationSettings((prev) => ({
                          ...prev,
                          email_notification: check
                        }))
                        setChanges("communication")
                      }} />
                  </div>

                  <div>
                    <Label htmlFor="email-signature">Email Signature</Label>
                    <Textarea
                      id="email-signature"
                      className="mt-1"
                      rows={4}
                      value={communicationSettings.email_signature}
                      onChange={(e) => {
                        setCommunicationSettings((prev) => ({
                          ...prev,
                          email_signature: e.target.value
                        }))
                        setChanges("communication")
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email-footer">Default Footer for All Messages</Label>
                    <Textarea
                      id="email-footer"
                      className="mt-1"
                      rows={2}
                      value={communicationSettings.default_footer}
                      onChange={(e) => {
                        setCommunicationSettings((prev) => ({
                          ...prev,
                          default_footer: e.target.value
                        }))
                        setChanges("communication")
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Bell className="h-4 w-4 md:h-5 md:w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure email and WhatsApp notifications for system events</CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationSettingsContent />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles & Access Tab */}
          <TabsContent value="roles" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Users className="h-4 w-4 md:h-5 md:w-5" />
                  Roles & Access Management
                </CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                {hasPermission("HAS_CREATE_USER_ROLE") && <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <h3 className="text-base md:text-lg font-medium">User Roles</h3>
                  <Button onClick={() => setCreateRoleModalOpen(true)} size="sm">
                    Create New Role
                  </Button>
                </div>}

                {usersRolesQueries.isLoading ? (
                  <SectionLoader text="Loading user roles..." />
                ) : (
                  <div className="grid gap-4">
                    {userRoles.map((role) => (
                      <div key={role.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{role.name}</h4>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {role.permissions.slice(0, 3).map((permission) => (
                              <Badge key={permission.permission_id} variant="outline" className="text-xs">
                                {permission.permission_value}
                              </Badge>
                            ))}
                            {role.permissions.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{role.permissions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <Badge variant="secondary">{role.users} users</Badge>
                          {hasPermission("HAS_READ_PERMISSIONS") && <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPermissions(role)}
                          >
                            Edit Permissions
                          </Button>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Class Types Tab */}
          <TabsContent value="class-types" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <BookOpen className="h-4 w-4 md:h-5 md:w-5" />
                  Class Type Management
                </CardTitle>
                <CardDescription>Manage country/region-based categories and class types with payment links</CardDescription>
              </CardHeader>
              <CardContent>
                <ClassTypeManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cancel & Reschedule Tab */}
          <TabsContent value="cancel-reschedule" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <CalendarX className="h-4 w-4 md:h-5 md:w-5" />
                  Cancel and Rescheduling
                </CardTitle>
                <CardDescription>Configure permissions and settings for class cancellations and rescheduling</CardDescription>
              </CardHeader>
              <CardContent>
                <CancelReschedulingSettings
                  setChanges={() => setChanges("cancel-reschedule")}
                  settings={settings}
                  setSettings={setSettings} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banner Management Tab */}
          <TabsContent value="banners" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Image className="h-4 w-4 md:h-5 md:w-5" />
                  Banner Management
                </CardTitle>
                <CardDescription>Create and manage dashboard banners for different user audiences</CardDescription>
              </CardHeader>
              <CardContent>
                <BannerManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Star Teacher Management Tab */}
          <TabsContent value="star-teacher" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Image className="h-4 w-4 md:h-5 md:w-5" />
                  Star Teachers Management
                </CardTitle>
                <CardDescription>Create and manage dashboard banners for different user audiences</CardDescription>
              </CardHeader>
              <CardContent>
                <StartTeacherManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <FileText className="h-4 w-4 md:h-5 md:w-5" />
                  Legal Policies
                </CardTitle>
                <CardDescription>Manage terms, privacy, and other legal documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="terms-of-service">Terms of Service</Label>
                    <Textarea
                      id="terms-of-service"
                      className="mt-1"
                      rows={6}
                      value={policies.terms_of_service}
                      placeholder="Enter your terms of service..."
                      onChange={(e) => {
                        setPolicies((prev) => ({
                          ...prev,
                          terms_of_service: e.target.value
                        }))
                        setChanges("policies")
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="privacy-policy">Privacy Policy</Label>
                    <Textarea
                      id="privacy-policy"
                      className="mt-1"
                      rows={6}
                      value={policies.privacy_policy}
                      placeholder="Enter your privacy policy..."
                      onChange={(e) => {
                        setPolicies((prev) => ({
                          ...prev,
                          privacy_policy: e.target.value
                        }))
                        setChanges("policies")
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="refund-policy">Refund/Cancellation Policy</Label>
                    <Textarea
                      id="refund-policy"
                      className="mt-1"
                      rows={4}
                      value={policies.refund_cancellation_policy}
                      placeholder="Enter your refund and cancellation policy..."
                      onChange={(e) => {
                        setPolicies((prev) => ({
                          ...prev,
                          refund_cancellation_policy: e.target.value
                        }))
                        setChanges("policies")
                      }}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div className="flex-1">
                      <Label htmlFor="consent-checkboxes">Consent Checkboxes for Registration</Label>
                      <p className="text-sm text-muted-foreground">Require users to accept terms during registration</p>
                    </div>
                    <Switch id="consent-checkboxes"
                      checked={policies?.consent_checkboxes_for_registration}
                      onCheckedChange={(check) => {
                        setPolicies((prev) => ({
                          ...prev,
                          consent_checkboxes_for_registration: check
                        }))
                        setChanges("policies")
                      }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Shield className="h-4 w-4 md:h-5 md:w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security and authentication policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Password Policy</h3>

                    <div>
                      <Label htmlFor="min-password-length">Minimum Password Length</Label>
                      <Input id="min-password-length" type="number" defaultValue="8" className="mt-1" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1">
                        <Label htmlFor="require-special-chars">Require Special Characters</Label>
                        <p className="text-sm text-muted-foreground">Passwords must contain special characters</p>
                      </div>
                      <Switch id="require-special-chars" defaultChecked />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1">
                        <Label htmlFor="enable-2fa">Two-Factor Authentication (2FA)</Label>
                        <p className="text-sm text-muted-foreground">Enable 2FA for enhanced security</p>
                      </div>
                      <Switch id="enable-2fa" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Session & Access Control</h3>

                    <div>
                      <Label htmlFor="session-timeout">Session Timeout Duration</Label>
                      <Select defaultValue="60">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="480">8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="failed-attempts">Lock Account After Failed Attempts</Label>
                      <Input id="failed-attempts" type="number" defaultValue="5" className="mt-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data & Integrations Tab */}
          <TabsContent value="integrations" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Database className="h-4 w-4 md:h-5 md:w-5" />
                  Data & Integrations
                </CardTitle>
                <CardDescription>Manage data exports, backups, and third-party integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Data Management</h3>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-sm"
                        onClick={() => handleExportData('csv')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export All Data (CSV)
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-sm"
                        onClick={() => handleExportData('json')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export All Data (JSON)
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full justify-start text-sm" onClick={handleBackupNow}>
                        <Archive className="h-4 w-4 mr-2" />
                        Backup Now
                      </Button>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                        <div className="flex-1">
                          <Label htmlFor="auto-backup">Auto Backup</Label>
                          <p className="text-sm text-muted-foreground">Enable automatic backups</p>
                        </div>
                        <Switch id="auto-backup" defaultChecked />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="data-retention">Data Retention Period</Label>
                      <Select defaultValue="12">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">1 year</SelectItem>
                          <SelectItem value="24">2 years</SelectItem>
                          <SelectItem value="36">3 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Third-Party Integrations</h3>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1">
                        <Label htmlFor="google-calendar">Google Calendar Sync</Label>
                        <p className="text-sm text-muted-foreground">Sync class schedules with Google Calendar</p>
                      </div>
                      <Switch id="google-calendar" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1">
                        <Label htmlFor="zoom-integration">Zoom Integration</Label>
                        <p className="text-sm text-muted-foreground">Automatically create Zoom meetings for classes</p>
                      </div>
                      <Switch id="zoom-integration" defaultChecked />
                    </div>

                    <Separator />

                    <h4 className="font-medium">Payment Mode</h4>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1">
                        <Label htmlFor="razorpay-enabled">Razorpay</Label>
                        <p className="text-sm text-muted-foreground">Enable Razorpay payment gateway</p>
                      </div>
                      <Switch
                        id="razorpay-enabled"
                        checked={razorpayEnabled}
                        onCheckedChange={setRazorpayEnabled}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1">
                        <Label htmlFor="stripe-enabled">Stripe</Label>
                        <p className="text-sm text-muted-foreground">Enable Stripe payment gateway</p>
                      </div>
                      <Switch
                        id="stripe-enabled"
                        checked={stripeEnabled}
                        onCheckedChange={setStripeEnabled}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feature Toggles Tab */}
          <TabsContent value="features" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <ToggleLeft className="h-4 w-4 md:h-5 md:w-5" />
                  Feature Toggles
                </CardTitle>
                <CardDescription>Enable or disable platform features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature) => (
                  <div key={feature.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{feature.name}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    {hasPermission("HAS_EDIT_FEATURE_TOGGLE") && <Switch
                      checked={featuresSetting[feature.id]}
                      onCheckedChange={(check) => {
                        setFeature((prev) => ({
                          ...prev,
                          [feature.id]: check
                        }))
                        setChanges("features")
                      }}
                    />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Settings Button */}
        {(hasUnsavedChanges && tabs.some(v => v.changed && activeTab === v.id) && getActiveTabPermissions()) && (
          <div className="z-50">
            <Button
              size="lg"
              onClick={handleSaveSettings}
              className="shadow-lg"
              disabled={updatePoliciesMutation.isPending || updateFeatureMutation.isPending || updateCancelRescheduleMutation.isPending || updateGeneralSettingsMutation.isPending || updateCommunicationSettingsMutation.isPending}
            >
              {(updatePoliciesMutation.isPending || updateFeatureMutation.isPending || updateCancelRescheduleMutation.isPending || updateGeneralSettingsMutation.isPending || updateCommunicationSettingsMutation.isPending) ? (
                <InlineLoader size="sm" />
              ) : null}
              {(updatePoliciesMutation.isPending || updateFeatureMutation.isPending || updateCancelRescheduleMutation.isPending || updateGeneralSettingsMutation.isPending || updateCommunicationSettingsMutation.isPending) ? "Saving..." : "Save All Settings"}
            </Button>
          </div>
        )}
      </div>

      {/* Modals - Fixed prop names */}
      <RolePermissionsModal
        open={permissionsModalOpen}
        onOpenChange={setPermissionsModalOpen}
        role={selectedRole}
        currentPermissions={selectedRole?.permissions || []}
        onSave={handleSavePermissions}
      />

      <CreateRoleModal
        open={createRoleModalOpen}
        onOpenChange={setCreateRoleModalOpen}
        onSave={handleCreateRole}
      />
    </DashboardLayout>
  );
}
